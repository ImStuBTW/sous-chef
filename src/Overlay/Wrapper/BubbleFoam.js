import React, { useEffect } from 'react';
import { useAnimate }  from 'react-simple-animate'; // Used to animate rise and fall of foam.

import BubbleFoamSprite from '../../Images/BubbleFoam.png';

function BubbleFoam({haltBubbles, foamOver, deleteCallback}) {
    // Absolutely positioned container to hold both foam image and yellow beer background div.
    // 7vh tall, placed 93 vh down the page. Full width.
    // Transformation starts it at 100vh off the page. Rises up in a second and a half.
    const {style, play} = useAnimate({
        position: "absolute",
        left: '0vw',
        top: '93vh',
        height: "7vh",
        width: "100vw",
        duration: 1.5,
        start: {transform: 'translateY(100vh)'},
        end: {transform: 'translateY(92vh)'}
    });

    // Repeating image background for pixel form. Fixed 32px height.
    const foamStyle = {
        height: "32px",
        width: "100vw",
        backgroundImage: "url(" + BubbleFoamSprite + ")"
    }

    // Yellow beer effect. Variable 7vh height based off of window size.
    // It's impossible to find a good shade of yellow.
    const beerStyle = {
        height: "7vh",
        width: "100vw",
        backgroundColor: '#f4cb42'
    }

    // Needs a 1 ms delay before react-simple-animate's play is triggered.
    useEffect(() => {
        setTimeout(() => {
            play(true)
        },1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // foamOver indicates that the bubbles components wants to unmount, and the foam should lower off the page.
    // play(false) reverses the animation. The animation takes 1.5 sec.
    // Once the animation has finished, call the deleteCallback to unmount the bubbles container.
    useEffect(() => {
        if(foamOver) {
            play(false);
            setTimeout(() => {
                deleteCallback();
            }, 1500);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [foamOver])

    // Uses react-simple-animate to animate the foam. Animation set with style={style}
    return (
        <div className="beer-foam-container" style={style}>
            <div className="foam" style={foamStyle}></div>
            <div className="beer" style={beerStyle}></div>
        </div>
  );
}

export default BubbleFoam;
