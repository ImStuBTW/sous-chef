import React, { useEffect } from 'react';
import { useAnimate }  from 'react-simple-animate'; // Used for animations.
import Spritesheet from 'react-responsive-spritesheet'; // Used to cycle through spritesheet frames.

import ConfettiSpriteSheet from '../../Images/PrideConfetti.png';

function ConfettiSprite({item, deleteCallback}) {
    // Set up a wrapper for the confetti sprite giving it dimensions & position.
    const wrapperStyle = {
        position: "absolute",
        height: "32px",
        width: "24px"
    }

    // Define the animation. These styles and the wrapper styles unfortunately can't be on the same div.
    // Stats are dictated by the passed confetti item.
    // Duration is how long the animation plays.
    // Start and end move the confetti down the page.
    // Slight easing in the animation. Slower at first, then faster at the end.
    // Triggers a callback when the animation has finished to delete the confetti item from the array.
    const {style, play} = useAnimate({
        duration: item.speed,
        start: {transform: 'translateX('+item.x+'vw) translateY('+item.y+'vh)'},
        end: {transform: 'translateX('+item.newX+'vw) translateY('+item.newY+'vh)'},
        easeType: "cubic-bezier(0.445, 0.05, 0.55, 0.95)",
        onComplete: () => {deleteCallback(item.key)}
    });

    // For some reason play() needs a ms of delay before kicking the animation off.
    // Trigers when the component mounts.
    useEffect(() => {
        setTimeout(() => {
            play(true)
        },250);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Uses a 3x6 CSS sprite for PrideConfetti.png. Array defines the start/end of confetti loops.
    const confettiFrames = [
        [1,3],
        [4,5],
        [7,9],
        [10,12],
        [13,15],
        [16,18]
    ]

    // Uses react-simple-animate to animate the confetti. react-responsive-spritesheet to cycle through sprites.
    // style={style} is what triggers the animation, along with the useAnimate().
    // SpriteSheet styles are fairly straightforward.
    // image refers to PrideConfetti.png (see imports at top of file.)
    // widthFrame & heightFrame set resolution. Steps is number of frames in spritesheet total.
    // fps is the speed it cycles through the frames.
    // Loop doesn't matter since the confetti is destoried on animation end.
    // Autoplay is set to true. isResponsive is set to false so the confetti is always the same size.
    // The sprite sheet starting / end frames are defined by the confettiFrames array.
    // goToAndPlay starts the animation on the first frame of the confnetti loop.
    return (
        <div className="confettisprite" style={wrapperStyle}>
            <Spritesheet
                style={style}
                image={ConfettiSpriteSheet}
                widthFrame={32}
                heightFrame={24}
                steps={18}
                fps={8}
                loop={true}
                autoplay={true}
                isResponsive={false}
                onInit={(spritesheet) => {
                    spritesheet.setStartAt(confettiFrames[item.color][0]);
                    spritesheet.setEndAt(confettiFrames[item.color][1]);
                    spritesheet.goToAndPlay(confettiFrames[item.color][0])
                }}
            />
      </div>
  );
}

export default ConfettiSprite;
