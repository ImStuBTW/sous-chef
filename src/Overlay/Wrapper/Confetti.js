import React, { useState, useEffect, useRef } from 'react';
import uuidv1 from 'uuid'; // Used to give confetti unique IDs.
import useInterval from '../Timer/useInterval'; // Utility for React Hooks friendly time loops.
import ConfettiSprite from './ConfettiSprite'; // Individual confetti sprites.

function Confetti({haltConfetti, confettiOver, burstAmount}) {
    // confetti contains array of all confetti items.
    // nextColor allows confetti to rotate through colors and avoid clumping.
    const [confetti, setConfetti] = useState([]);
    const [nextColor, setNextColor] = useState(0);

    // Reference to confetti object for deleteConfetti callbacks.
    let confettiRef = useRef(confetti);

    // Deletes a given piece of confetti by returning a filtered version of the array.
    // Uses reference to current confetti state, not the state that was passed to the ConfettiSprite.
    const deleteConfetti = (key) => {
        setConfetti(confettiRef.current.filter((item) => {
            return item.key !== key;
        }));
    };

    // Adds a new confetti item to the confetti array.
    // key is a randomly generated uuid.
    // color is the next color in the confetti rainbow.
    // x starts the confetti sprite anywhere along the x-axis.
    // y needs to be at least ten vh off the top of the page.
    //   Adds an extra random amount so the initial clump doesn't fall all at once.
    // newX is +/- 50 within the initial starting x value.
    // newY is 135 off of the page, since the item can appear up to 20 pixels above the page.
    // speed is how fast it falls down in seconds. needs to be at least 5, can be up to 8.
    const createConfetti = () => {
        let xCord = (Math.random()*100);
        setConfetti([...confetti,   {
            key: uuidv1(),
            color: nextColor,
            x: xCord,
            y: (Math.random()*-5)-5,
            newX: xCord+(Math.random()*15)-(Math.random()*15),
            newY: 110,
            speed: (Math.random()*3)+5
        }]);
        // Cycle through color options.
        if(nextColor === 5) { setNextColor(0); }
        else { setNextColor(nextColor+1); } 
    }

    // Same as create confetti, but makes an arbitrary number of confetti items.
    // Uses temp variables instead of the color state.
    const createBulkConfetti = (number) => {
        let bulkConfetti = [];
        let tempNextColor = 0;
        for(let i = 0; i < number; i++) {
            let xCord = (Math.random()*100);
            bulkConfetti.push({
                key: uuidv1(),
                color: tempNextColor,
                x: xCord,
                y: -10,
                newX: xCord+(Math.random()*15)-(Math.random()*15),
                newY: 110,
                speed: (Math.random()*3)+5
            })
            // Cycle through color options.
            if(tempNextColor === 5) { tempNextColor=0; }
            else { tempNextColor++; } 
        }
        // Spread operator combines the two arrays together.
        setConfetti([...confetti, ...bulkConfetti]);
    }

    // Makes N confetti when the confetti wrapper is loaded.
    useEffect(() => {
        createBulkConfetti(burstAmount ? burstAmount : 15);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Optionally logs changes to the confetti state to the log every time it changes.
    //  Updates confettiRef any time confetti is updated.
    useEffect(() => {
        //console.log(confetti);
        confettiRef.current = confetti;
    }, [confetti])

    // If the confetti hasn't been stopped with haltConfetti, a new item is created every quarter second.
    // If the confetti has been halted and all confetti has been removed from the confetti state array,
    //   trigger the callback to unmount the confetti wrapper.
    useInterval(() => {
        if(!haltConfetti) {
            createConfetti();
        }
        else {
            if(confetti.length === 0 && confettiOver) {
                confettiOver();
            }
        }
    }, 250)

    // Styles for fullscreen wrapper. Create a page-sized container absolutely positioned over the page.
    const fullscreenStyles = {
        height: '100vh',
        width: '100vw',
        position: 'absolute',
        top: 0
    }
    
    // CSS styles for .overlay-confetti-container. Hides confetti that has been positioned off the page.
    const containerStyles = {
        height: '100vh',
        width: '100vw',
        position: 'relative',
        overflow: 'hidden'
    }

    // Draw confetti array with a map.
    // ConfettiSprite needs a callback to remove confetti from the array when it's finished its animation.
    return (
        <div className="fullscreen-wrapper" style={fullscreenStyles}>
            <div style={containerStyles} className="overlay-confetti-container">
                {confetti.map((item) => {
                    return(<ConfettiSprite key={item.key} item={item} deleteCallback={deleteConfetti}/>)
                })}
            </div>
        </div>
    );
}

export default Confetti;
