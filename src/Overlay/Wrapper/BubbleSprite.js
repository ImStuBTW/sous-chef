import React, { useEffect } from 'react';
import { useAnimate }  from 'react-simple-animate';

function BubbleSprite({item, deleteCallback}) {
    const Bubble0 = '../../Images/Bubble0.png';
    const Bubble1 = '../../Images/Bubble1.png';
    const Bubble2 = '../../Images/Bubble2.png';
    const Bubble3 = '../../Images/Bubble3.png';
    const Bubble4 = '../../Images/Bubble4.png';
    const Bubble5 = '../../Images/Bubble5.png';

    // Set up a wrapper for the bubble sprite giving it dimensions & position.
    const wrapperStyle = {
        position: "absolute",
        height: "32px",
        width: "24px"
    }

    // Define the animation. These styles and the wrapper styles unfortunately can't be on the same div.
    // Stats are dictated by the passed bubble item.
    // Duration is how long the animation plays.
    // Start and end move the bubble down the page.
    // No easing variable for bubbles, uses linear animation
    // Triggers a callback when the animation has finished to delete the bubble item from the array.
    const {style, play} = useAnimate({
        duration: item.speed,
        start: {transform: 'translateX('+item.x+'vw) translateY('+item.y+'vh)'},
        end: {transform: 'translateX('+item.newX+'vw) translateY('+item.newY+'vh)'},
        complete: {display: 'none'},
        onComplete: () => {deleteCallback(item.key)}
    });

    useEffect(() => {
        setTimeout(() => {
            play(true)
        },500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // No spritesheet for bubbles, just uses 5 seperate images.
    const bubbleList = [
        Bubble0,
        Bubble1,
        Bubble2,
        Bubble3,
        Bubble4,
        Bubble5
    ]

    // Uses react-simple-animate to animate the bubbles
    //    <span style={{top: "50%"}}>andrewcooks</span>
    return (
        <div className="bubblesprite" style={wrapperStyle}>
            <div style={style}>
                <img src={bubbleList[item.size]} alt="Bubble" />
            </div>
        </div>
  );
}

export default BubbleSprite;
