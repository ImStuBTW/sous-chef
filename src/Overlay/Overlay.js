
// Import React packages.
import React from 'react';
import ReactDOM from 'react-dom';
import Sound from 'react-sound';
import { Chart } from 'react-chartjs-2';

// Import other packages.
import io from 'socket.io-client';
import $ from 'jquery';

import './Overlay.scss';

// Import Overlay Packages
import TimerContainer from './Timer/TimerControlContainer';
import Timer from './Timer/ActiveTimer';
import Panel from './Panel/Panel';
import TempPanel from './Panel/TempPanel';
import ImagePanel from './Panel/ImagePanel';
import TweetPanel from './Panel/TweetPanel';
import ConfettiWrapper from './Wrapper/ConfettiWrapper';
import BubbleWrapper from './Wrapper/BubbleWrapper';
import ImageSlide from './Panel/ImageSlide';

class Overlay extends React.Component {
  componentDidMount() {
    let socket = io(`http://${window.location.hostname}:3001/`),
    urlParams = new URLSearchParams(window.location.search),
    expiredTimers = 0,
    probeAlert = false;


    let showInset = !(urlParams.get('hideInset') === 'true');

    // Common code for showing the recipe or drink panels.
    function mountCustomPanel(id, customProps, childComponent) {
        mountPanel(id, null, null, null, false, customProps, childComponent);
    }

    function unmountPanel(id) {
        ReactDOM.unmountComponentAtNode(document.getElementById(id));
    }

    function mountPanel(id, title, content, subcontent, hidden, customProps, childComponent) {
        let mountPoint = document.getElementById(id);

        if (!hidden) {
            let panelProps = customProps || {
                title: title,
                content: content,
                subcontent: subcontent,
                animate: true
            };

            let panelComponent = childComponent
                ? React.createElement(Panel, panelProps, childComponent)
                : React.createElement(Panel, panelProps);

            ReactDOM.render(panelComponent, mountPoint);
        }
        else {
            ReactDOM.unmountComponentAtNode(mountPoint);
        }
    }

    // RECIPE
    // Display recipe details, if visible.
    // Otherwise, remove component.
    function initRecipe(msg) {
        mountPanel('recipe', '!recipe', msg.title, msg.subtitle, msg.hidden);
    }

    // DRINK
    // Display drink details, if visible.
    // Otherwise, remove component.
    function initDrink(msg) {
        mountPanel('drink', '!beer', msg.brewery, msg.beer, msg.hidden);
    }

    // CHART
    // Display temperature panel or chart panel.
    // Otherwise, remove component.

    // Data container for chart temps
    let chartData = {
        datasets: [{
            label: 'Temp',
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 5,
            fill: false,
            steppedLine: 'before',
            data: []
        }, {
            label: 'Target',
            borderColor: 'rgb(99, 132, 255',
            borderWidth: 5,
            fill: false,
            steppedLine: 'before',
            data: []
        }]
    }

    function initProbe(msg) {
        const elementId = 'temp';
        let temperature;
        let tempFloat;
        if(msg.temp === 'No Data') {
            temperature = msg.temp;
        }
        else {
            temperature = msg.temp;
            // tempFloat = parseFloat(msg.temp);
            // Floats wiggle on the chart too much.
            // Ints have really noticeable "teeth" when it crosses a number.
            // Doubling a value, rounding, and dividing by two,
            // gives you whole numbers or 0.5. Looks nice when charted.
            tempFloat = Math.round(msg.temp*2)/2;
        }

        if(msg.tempHidden) {
            const props = {
                animate: true,
                alignment: 'left',
                contentClass: 'panel-content-temp',
                title: 'Temp:',
                content: parseFloat(temperature).toFixed(1) + ' F',
                hidden: msg.hidden
            }

            mountCustomPanel(elementId, props);
        }
        else {
            unmountPanel(elementId);
        }

        chartData.datasets[0].data.push({
            x: Date.now(),
            y: tempFloat
        })

        if(msg.target !== 'No Data') {
            chartData.datasets[1].data.push({
                x: Date.now(),
                y: parseInt(msg.target)
            });
        }

        let min = chartData.datasets[0].data[0].y;
        let max = chartData.datasets[0].data[0].y;

        for(let i = 0; i < chartData.datasets[0].data.length; i++) {
            if(chartData.datasets[0].data[i].y > max) {
                max = chartData.datasets[0].data[i].y;
            }
            else if(chartData.datasets[0].data[i].y < min) {
                min = chartData.datasets[0].data[i].y;
            }
        }

        // This logic can make the target and current temp always show on chart.
        /* for(let i = 0; i < chartData.datasets[1].data.length; i++) {
            if(chartData.datasets[1].data[i].y > max) {
                max = chartData.datasets[1].data[i].y;
            }
            else if(chartData.datasets[1].data[i].y < min) {
                min = chartData.datasets[1].data[i].y;
            }
        } */

        min = Math.round((min-5)/5)*5;
        max = Math.round((max+5)/5)*5;

        let delta = 0.000;

        if(chartData.datasets[0].data.length > 5) {
            delta = chartData.datasets[0].data[chartData.datasets[0].data.length-1].y - chartData.datasets[0].data[chartData.datasets[0].data.length-6].y;
        }

        let options = {
            defaultFontFamily: Chart.defaults.global.defaultFontFamily = "'ChevyRay - Skullboy'",
            defaultFontColor: Chart.defaults.global.defaultFontColor = 'white',
            defaultFontSize: Chart.defaults.global.defaultFontSize = 38,
            scales: {
                xAxes: [{
                    type: 'realtime',
                    realtime: {
                        duration: 45000,
                        ttl: 50000,
                        delay: 1000
                    },
                    gridLines: {
                        color: "#eeeeee",
                        lineWidth: 2
                    }
                }],
                yAxes: [{
                    type: 'linear',
                    display: true,
                    gridLines: {
                        color: "#eeeeee",
                        lineWidth: 2
                    },
                    ticks: {
                        stepSize: 5,
                        precision: 0,
                        min: min,
                        max: max,
                        lineWidth: 2
                    }
                }]
            },
            borderWidth: 5,
            tooltips: { enabled: false },
            elements: { point: { radius: 0 } },
            legend: { display: false },
            animation: {
                duration: 0 // general animation time
            },
            hover: {
                animationDuration: 0 // duration of animations when hovering an item
            },
            responsiveAnimationDuration: 0, // animation duration after a resize
            plugins: {
                streaming: {
                    frameRate: 30 // chart is drawn 5 times every second
                }
            }
        }

        if(msg.chartHidden) {
            ReactDOM.render(
                React.createElement(TempPanel, {chartData: chartData, options: options, temp: temperature, delta: delta, target: msg.target, tickMin: min, tickMax: max, probeAlert: probeAlert}),
                document.getElementById('chart')
            );    
        }
        else {
            ReactDOM.unmountComponentAtNode(document.getElementById('chart'));
        }
    }

    // PROBE ALARM
    function handleProbeAlarm(msg) {
        // If the alarm's going off, pretend to be an expired timer.
        if(!probeAlert && msg.alerted) {
            addExpiredTimer();
            probeAlert = true;
            // This component is required to avoid an issue with the Sound component looping when chart component redraws.
            ReactDOM.render(
                React.createElement(Sound, {
                    url: 'http://localhost:3000/assets/whistle.mp3',
                    playStatus: Sound.status.PLAYING,
                    loop: false
                }), document.getElementById('alarm')
            );
        }
        // If the probe alarm is turned off while flashing, pretend to be an expired timer with 0 seconds remaining.
        if(probeAlert && !msg.alerted) {
            removeExpiredTimer({seconds: 0});
            probeAlert = false;
            ReactDOM.unmountComponentAtNode(document.getElementById('alarm'));
        }
    }

    // IMAGE
    // Display any image URL, if visible.
    // Otherwise, remove component.
    function initImage(msg) {
        let elementId = 'show-us';

        if (!msg.hidden) {
            ReactDOM.render(
                // Rotate Options: 'none', 'cw', 'flip', 'ccw'
                React.createElement(ImagePanel, {url: msg.url, rotate: msg.rotate}),
                document.getElementById(elementId)
            );  
        }
        else {
            unmountPanel(elementId);
        }
    }

    // TWEET
    // Display a tweet embed, if visible.
    // Otherwise, remove component.
    function initTweet(msg) {
        let elementId = 'tweet-embed';
        unmountPanel(elementId);

        if (!msg.hidden) {
            ReactDOM.render(
                React.createElement(TweetPanel, {url: msg.url, tweet: msg.tweet}),
                document.getElementById(elementId)
            );
        }
    }

    // NOTICE
    function initNotice(msg) {
        let elementId = 'notice';

        if (msg.show) {
            let props = {
                animate: true,
                alignment: 'left',
                sound: `http://localhost:3000/assets/${msg.sound}.mp3`,
                title: 'Hey! Listen!',
                content: 'Disaster is iminent!',
                subcontent: `${msg.users.join(', ')} ${msg.users.length > 1 ? 'need' : 'needs'} your attention.`
            };

            mountCustomPanel(elementId, props);
        }
        else {
            unmountPanel(elementId);
        }
    }

    // BANNER
    function initBanner(msg) {
        let elementId = 'banner';

        if (msg.show) {
            ReactDOM.render(
                React.createElement(ImageSlide, {
                    leftImageUrl: 'images/mj.png',
                    rightImageFirstUrl: 'images/mj1.png',
                    rightImageSecondUrl: 'images/mj2.png'
                }),
                document.getElementById(elementId)
            );
        }
        else {
            unmountPanel(elementId);
        }
    }

    // Initialize video inset overlay component.
    if (showInset) {
        let videoBorderProps = {
            contentClass: 'panel-videocontent'
        };
        ReactDOM.render(
            React.createElement(Panel, videoBorderProps),
            document.getElementById('inset-border')
        );
    }

    // Handle an expired timer.
    // When timer reaches 0, flash border of page in red.
    socket.on('timer-expired', addExpiredTimer);

    // Handle a repeated timer.
    // Most repeat logic is handled by the timer container.
    // But, we do want to remove the flashing border if all expired
    // timers have been either deleted or repeated.
    socket.on('timer-restart', removeExpiredTimer);

    // Handle deleting a timer.
    // Most delete logic is handled by the timer container.
    // But, we do want to remove the flashing border if all expired
    // timers have been deleted or repeated.
    socket.on('timer-deleted', removeExpiredTimer);

    // Handle new recipe details.
    socket.on('recipe-info', initRecipe);

    // Handle new drink details.
    socket.on('drink-info', initDrink);

    // Handle new image URL.
    socket.on('image-info', initImage);

    // Handle new tweet
    socket.on('tweet-info', initTweet);

    socket.on('notice-info', initNotice);

    socket.on('banner-info', initBanner);

    // Handle Probe Temp and Probe Chart Panels
    socket.on('probe-temp', initProbe);

    // Handle Probe Alarms
    socket.on('probe-alert', handleProbeAlarm);

    // Listen for event that indicates no timers.
    // This helps us reset the border alert if we miss an event.
    // TODO: Use socket confirmations so this isn't necessary.
    socket.on('timer-empty', handleTimerEmpty);

    // Helper function that makes sure border doesn't get dismissed if there's an active probe alarm.
    function handleTimerEmpty() {
        if(!probeAlert) {
            stopBorderThrob();
        }
    }

    socket.on('itunes-playing', (song) => {
        let panelProps = {
            title: song.artist,
            content: song.track,
            subcontent: song.album,
            image: song.artwork,
            animate: true,
            autohide: true,
            alignment: 'left'
        };

        mountCustomPanel('now-playing', panelProps);

        // Remove component after animations complete.
        setTimeout(() => unmountPanel('now-playing'), 10000);
    });

    ReactDOM.render(
        React.createElement(ConfettiWrapper, {
            socket: socket
        }),
        document.getElementById('confetti')
    );

    ReactDOM.render(
        React.createElement(BubbleWrapper, {
            socket: socket
        }),
        document.getElementById('bubbles')
    );


    // Pull latest state from server with fetch events
    socket.emit('recipe-fetch', (recipe) => {
        initRecipe(recipe);
    });

    socket.emit('drink-fetch', (drink) => {
        initDrink(drink);
    });

    socket.emit('timer-fetch', (timers) => {
        // console.log('timers: ');
        // console.log(timers);
        ReactDOM.render(
            React.createElement(TimerContainer, {timers: timers, socket: socket, component: Timer, showNone: false}),
            document.getElementById('timers')
        );    
    });

    // Helper functions
    function addExpiredTimer() {
        expiredTimers++;
        console.log('addExpiredTimer - ' + expiredTimers);
        startBorderThrob();
    }

    function removeExpiredTimer(msg) {
        if (msg.seconds === 0) {
            expiredTimers--;
            console.log('removeExpiredTimer - ' + expiredTimers);
            if (expiredTimers <= 0) {
                console.log('removeExpiredTimer - ' + expiredTimers);
                stopBorderThrob();
                // Reset in case something goes awry and our counter goes negative.
                expiredTimers = 0;
            }
        }
    }

    function startBorderThrob() {
        $('#top, #bottom, #left, #right').addClass('border-throb');
    }

    function stopBorderThrob() {
        $('#top, #bottom, #left, #right').removeClass('border-throb');
    }
  };

  render() {
    return (
      <div id="overlay-body">
          <div id="left"></div>
          <div id="right"></div>
          <div id="top"></div>
          <div id="bottom"></div>

          <div id="app-left">
              <div id="notice"></div>
              <div id="temp"></div>
              <div id="chart"></div>
              <div id="alarm"></div>
              <div id="show-us"></div>
              <div id="tweet-embed"></div>
              <div id="now-playing"></div>
          </div>
          <div id="app-right">
              <div id="inset-border"></div>
              <div id="recipe"></div>
              <div id="drink"></div>
              <div id="timers"></div>
          </div>
          <div id="confetti"></div>
          <div id="bubbles"></div>
          <div id="banner"></div>
      </div>
    )
  };
}

export default Overlay;
