import React, { useState, useEffect, useRef } from 'react';
import uuidv1 from 'uuid'; // Used to give bubbles unique IDs.
import useInterval from '../Timer/useInterval'; // Utility for React Hooks friendly time loops.
import BubbleSprite from './BubbleSprite'; // Individual bubble sprites.
import BubbleFoam from './BubbleFoam'; // Beer foam component at bottom of page.

function Bubbles({haltBubbles, bubblesOver, burstAmount, showFoam}) {
    // bubbles is an array containing all bubble items.
    // nextSize loops through bubble sizes to avoid clustering.
    // foamOver triggers the beer foam to receed when bubble animation is completed.
    const [bubbles, setBubbles] = useState([]);
    const [nextSize, setNextSize] = useState(0);
    const [foamOver, setFoamOver] = useState(false);

    // Ref to bubbles array for use in the deleteBubble callback.
    let bubblesRef = useRef(bubbles);

    // Deletes a given bubble by returning a filtered version of the array.
    // Uses reference to current bubbles state, not the state that was passed to the BubbleSprite.
    const deleteBubble = (key) => {
        setBubbles(bubblesRef.current.filter((item) => {
            return item.key !== key;
        }));
    };

    // Adds a new bubble item to the bubble array.
    // key is a randomly generated uuid.
    // size is the next size of bubble image.
    // x starts the bubble sprite anywhere along the x-axis.
    // y is direction off the bottom of the page..
    // newX is +/- 50 within the initial starting x value.
    // newY is 0 so that the bubbles will 'pop' at the top of the page.
    // speed is how fast it floads down in seconds. needs to be at least 5, can be up to 8.
    const createBubble = () => {
        let xCord = (Math.random()*100);
        setBubbles([...bubblesRef.current, {
            key: uuidv1(),
            size: nextSize,
            x: xCord,
            y: 100,
            newX: xCord+(Math.random()*50)-(Math.random()*50),
            newY: -0,
            speed: (Math.random()*3)+5
        }]);
        // Cycle through size options.
        if(nextSize === 5) { setNextSize(0); }
        else { setNextSize(nextSize+1); } 
    }

    // Same as createBubbles, but makes an arbitrary number of bubbles items.
    // Uses temp variables instead of the size state.
    const createBulkBubbles = (number) => {
        let bulkBubbles = [];
        let tempNextSize = 0;
        for(let i = 0; i < number; i++) {
            let xCord = (Math.random()*100);
            bulkBubbles.push({
                key: uuidv1(),
                size: tempNextSize,
                x: xCord,
                y: 100,
                newX: xCord+(Math.random()*50)-(Math.random()*50),
                newY: -0,
                speed: (Math.random()*3)+5
            })
            // Cycle through size options.
            if(tempNextSize === 5) { tempNextSize=0; }
            else { tempNextSize++; } 
        }
        setBubbles([...bubbles, ...bulkBubbles]);
    }

    // Makes N bubbles when the wrapper is loaded.
    useEffect(() => {
        createBulkBubbles(burstAmount ? burstAmount : 10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Optionally logs changes to the bubble state to the log every time it changes.
    //  Updates bubblesRef any time bubbles is updated.
    useEffect(() => {
        console.log(bubbles);
        bubblesRef.current = bubbles;
    }, [bubbles])

    // If the bubbles hasn't been stopped with haltBubble, a new item is created every quarter second.
    // If the bubbles has been halted and all bubbles has been removed from the bubbles state array,
    //   trigger the callback to remove the beer foam, and eventually remove the bubble wrapper.
    useInterval(() => {
        if(!haltBubbles) {
            createBubble();
        }
        else {
            if(bubbles.length === 0) {
                (showFoam === undefined || showFoam === true)
                    ? setFoamOver(true)
                    : bubblesOver();
            }
        }
    }, 800)

    // Triggers callback signalling to overlay that the bubble animations have completed.
    const deleteFoam = () => {
        bubblesOver();
    }

    // Styles for fullscreen wrapper. Create a page-sized container absolutely positioned over the page.
    const fullscreenStyles = {
        height: '100vh',
        width: '100vw',
        position: 'absolute',
        overflow: 'hidden',
        top: 0
    }

    // CSS styles for .overlay-bubbles-container. Hides bubbles that have been rendered off the bottom of the page.
    const containerStyles = {
        height: '100vh',
        width: '100vw',
        position: 'relative',
        overflow: 'hidden'
    }

    // Draw bubbles array with a map.
    // BubblesSprite needs a callback to remove bubble from the array when it's finished its animation.
    // Beer foam slides up automatically when mounted. 
    return (
        <div className="fullscreen-wrapper" style={fullscreenStyles}>
            <div style={containerStyles} className="overlay-bubbles-container">
                {bubbles.map((item) => {
                    return(<BubbleSprite key={item.key} item={item} deleteCallback={deleteBubble}/>)
                })}
                {showFoam === undefined || showFoam === true
                    ? <BubbleFoam haltBubbles={haltBubbles} foamOver={foamOver} deleteCallback={deleteFoam}/>
                    : null}
            </div>
        </div>
    );
}

export default Bubbles;
