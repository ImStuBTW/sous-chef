const fs = require('fs');

module.exports = function(io, clientSocket) {
    let pollInfo;
    const pollTime = 360;

    fs.readFile('polls.json', (err, data) => {
        if (err) {
            console.log('foodPolls.js | readFile(\'polls.json\') | Could not read saved polls file. Using defaults.');
            console.error(err); 
            pollInfo = {questions: [], currentQuestion: 0};
        } else {
            pollInfo = JSON.parse(data);
            io.emit('polls-info', pollInfo);
        }
    });

    let getCurrentQuestion = () => {
        let question = {};

        if (pollInfo && pollInfo.currentQuestion < pollInfo.questions.length) {
            question = pollInfo.questions[pollInfo.currentQuestion];
        }

        return question;
    }
   
    let saveData = () => {
        fs.writeFile('polls.json', JSON.stringify(pollInfo), (err) => {
            if (err) { console.log(err); }
        });
    }

    let goToNextQuestion = () => {
        if (pollInfo && pollInfo.questions && pollInfo.questions.length > 0) {
            if ((pollInfo.currentQuestion + 1) >= pollInfo.questions.length) {
                pollInfo.currentQuestion = 0;
            } else {
                pollInfo.currentQuestion++;
            }
        }

        saveData();
    }

    let postQuestion = () => {
        let questionInfo = getCurrentQuestion();

        if (questionInfo) {
            console.log(`foodPolls.js | New poll: ${questionInfo.question}`);
            io.emit('twitch-poll', {question: questionInfo.question, choices: questionInfo.choices, duration: pollTime});
            goToNextQuestion();
        }
    };

    clientSocket.on('foodpolls-start', function() {
        console.log("foodPolls.js | Starting new poll question!")
        postQuestion();
    });
}