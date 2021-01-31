const StreamTimer = require('../utils/StreamTimer.js'),
      fs = require('fs');

module.exports = function(io, clientSocket) {
    let timer, answerTally = 0, timeRemaining = 1800, triviaInfo;

    fs.readFile('trivia.json', (err, data) => {
        if (err) {
            console.log('triva.js | readFile(\'triva.json\') | Could not read saved trivia file. Using defaults.');
            console.error(err); 
            triviaInfo = {questions: [], contestants: {}, interval: 1800, enabled: false, currentQuestion: 0};
        } else {
            triviaInfo = JSON.parse(data);
            // Regardless of what we saved, always init trivia as disabled.
            triviaInfo.enabled = false;
            io.emit('trivia-info', triviaInfo);
        }
    });
    
    let saveData = () => {
        fs.writeFile('trivia.json', JSON.stringify(triviaInfo), (err) => {
            if (err) { console.log(err); }
        });
    }

    let getCurrentQuestion = () => {
        let question = {};

        if (triviaInfo && triviaInfo.enabled && triviaInfo.currentQuestion < triviaInfo.questions.length) {
            question = triviaInfo.questions[triviaInfo.currentQuestion];
        }

        return question;
    }

    let goToNextQuestion = () => {
        if (triviaInfo && triviaInfo.questions && triviaInfo.questions.length > 0) {
            answerTally = 0;

            if ((triviaInfo.currentQuestion + 1) >= triviaInfo.questions.length) {
                triviaInfo.currentQuestion = 0;
            } else {
                triviaInfo.currentQuestion++;
            }

            postQuestion();
        }
    }

    let postQuestion = () => {
        let questionInfo = getCurrentQuestion();

        if (questionInfo) {
            io.emit('twitch-chatpost', {message: `🤔 Q${triviaInfo.currentQuestion + 1}: ${questionInfo.question}`});
        }
    };

    let checkEnabled = () => {
        let enabled = (triviaInfo && triviaInfo.enabled);

        if (!enabled) {
            io.emit('twitch-chatpost', {message: 'There is no trivia going on right now.'});
        }
    
        return enabled;
    }

    let checkTimeRemaining = () => {
        timeRemaining -= 60;

        if (timeRemaining > 0 && timeRemaining <= 60) {
            io.emit('twitch-chatpost', {message: '⚠️ Less than a minute left for the current trivia !question. Get your !answer in!'});
        } else if (timeRemaining <= 0) {
            timeRemaining = triviaInfo.interval;
            io.emit('twitch-chatpost', {message: 'Time\'s up! Ready for the next question?'});

            // Wait 5 seconds before posting the next question.
            setTimeout(goToNextQuestion, 3000);

            console.log(`trivia.js | Current standings: ${JSON.stringify(triviaInfo.contestants)}`);
        } else {
            console.log(`trivia.js | Time remaining for current question: ${timeRemaining} seconds`);
        }

        timer.repeatTimer();
    }

    clientSocket.on('trivia-intro', function() {
        if (checkEnabled()) {
            io.emit('twitch-chatpost', {message: 'There is a trivia game going on! PogChamp Answer questions for fame, glory, and points. Commands: !question to see the current question; !answer to give a guess.'});
        }
    });

    clientSocket.on('trivia-question', function() {
        if (checkEnabled()) {
            postQuestion();
        }
    });

    clientSocket.on('trivia-answer', function(msg) {
        if (checkEnabled()) {
            let question = getCurrentQuestion(),
                contestant = triviaInfo.contestants[msg.user],
                points = 0;

            if (!contestant) {
                contestant = {
                    points: 0,
                    answered: []
                };
                triviaInfo.contestants[msg.user] = contestant;
            } else if (contestant.answered.includes(triviaInfo.currentQuestion)) {
                io.emit('twitch-chatpost', {message: `❌ Sorry @${msg.user}, you\'ve already answered this question. 😔`});
                return;
            }
    
            if (question.answers.includes(msg.answer)) {
                answerTally++;
                
                switch(answerTally) {
                    case 1:
                        points = 5;
                        break;
                    case 2:
                    case 3:
                        points = 3;
                        break;
                    case 4:
                    case 5:
                        points = 2;
                        break;
                }

                contestant.points += points;
                contestant.answered.push(triviaInfo.currentQuestion);
                console.log(`trivia.js | ${msg.user} earned ${points} points on this question.`);
                saveData();    
            }

            io.emit('twitch-chatpost', {message: `Thanks @${msg.user}! Your answer has been received. SeemsGood`});
        }
    });

    io.on('connection', (socket) => {
        // FETCH QUESTIONS
        socket.on('trivia-fetch', (fn) => {
            console.log(`trivia.js | trivia-fetch | Sending current questions: ${JSON.stringify(triviaInfo)}`);
            fn(triviaInfo);
        });

        // UPDATE QUESTIONS
        socket.on('trivia-update', function(msg) {
            console.log(`trivia.js | trivia-update | Setting trivia metadata: interval: ${msg.interval}, enabled: ${msg.enabled}`);
            triviaInfo.enabled = msg.enabled;
            triviaInfo.interval = msg.interval;

            saveData();

            if (timer) {
                timer.disposeTimer();
            }
            if (msg.enabled) {
                timer = new StreamTimer('triviaTimer', 'Trivia Timer', 60, null, checkTimeRemaining);
                timeRemaining = triviaInfo.interval;
                io.emit('twitch-chatpost', {message: 'A round of trivia has begun! Answer questions using !answer. Good luck!'});
                postQuestion();
            }

            io.emit('trivia-info', triviaInfo);
        });        
    });
};