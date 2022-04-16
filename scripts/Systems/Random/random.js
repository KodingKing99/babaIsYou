// ------------------------------------------------------------------
//
// This is a random number generation object.  It provides a handful
// of different ways to generate random numbers.  It is written as a
// Singleton so that there is only one of these throughout the program.
//
// ------------------------------------------------------------------
MyGame.systems.Random = (function () {
    'use strict';

    function nextDouble() {
        return Math.random();
    }

    function nextRange(min, max) {
        let range = max - min;
        return Math.floor((Math.random() * range) + min);
    }

    function nextCircleVector() {
        let angle = Math.random() * 2 * Math.PI;
        return {
            x: Math.cos(angle),
            y: Math.sin(angle)
        };
    }
    function nextUpVector() {
        return {
            x: 0,
            y: -1,
        }
    }

    function nextDownVector() {
        return {
            x: 0,
            y: 1,
        }
    }
    function nextRightVector() {
        return {
            x: 1,
            y: 0,
        }
    }
    function nextLeftVector() {
        return {
            x: -1,
            y: 0,
        }
    }
    function nextCircleXY(x, y, radius){
        let r1 = Math.random();
        let r2 = Math.random();
        // if(r1 < 0.5){
        //     r1 = -1;
        // }
        // else{
        //     r1 = 1;
        // }
        let r = radius * r2;
        // console.log(r2);
        let cirleVec = nextCircleVector();

        return {
            x: x + (cirleVec.x * r),
            y: y + (cirleVec.y * r),
        }
    }
    //
    // This is used to give a small performance optimization in generating gaussian random numbers.
    let usePrevious = false;
    let y2;

    //
    // Generate a normally distributed random number.
    //
    // NOTE: This code is adapted from a wiki reference I found a long time ago.  I originally
    // wrote the code in C# and am now converting it over to JavaScript.
    //
    function nextGaussian(mean, stdDev) {
        let x1 = 0;
        let x2 = 0;
        let y1 = 0;
        let z = 0;

        if (usePrevious) {
            usePrevious = false;
            return mean + y2 * stdDev;
        }

        usePrevious = true;

        do {
            x1 = 2 * Math.random() - 1;
            x2 = 2 * Math.random() - 1;
            z = (x1 * x1) + (x2 * x2);
        } while (z >= 1);

        z = Math.sqrt((-2 * Math.log(z)) / z);
        y1 = x1 * z;
        y2 = x2 * z;

        return mean + y1 * stdDev;
    }
    // function uniformDist(start, end, ){

    // }
    return {
        nextDouble: nextDouble,
        nextRange: nextRange,
        nextCircleVector: nextCircleVector,
        nextGaussian: nextGaussian,
        nextUpVector: nextUpVector,
        nextDownVector: nextDownVector,
        nextRightVector: nextRightVector,
        nextLeftVector: nextLeftVector,
        nextCircleXY: nextCircleXY,
    };

}());
