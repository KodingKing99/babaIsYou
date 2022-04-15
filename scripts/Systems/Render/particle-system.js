// --------------------------------------------------------------
//
// Renders the particles in a particle system
//
// --------------------------------------------------------------

MyGame.systems.render.particles = (function() {
    'use strict';
    let nextName = 1;       // Unique identifier for the next particle
    // let particles = {};
    let spec = {
        center: { x: 10, y: 10 },
        size: { mean: 10, stdev: 4 },
        speed: { mean: 50, stdev: 25 },
        lifetime: { mean: 4, stdev: 1 },
    }

    //------------------------------------------------------------------
    //
    // This creates one new particle
    //
    //------------------------------------------------------------------
    function create() {
        let size = Random.nextGaussian(spec.size.mean, spec.size.stdev);
        let p = {
                center: { x: spec.center.x, y: spec.center.y },
                size: { x: size, y: size},  // Making square particles
                direction: Random.nextCircleVector(),
                speed: Random.nextGaussian(spec.speed.mean, spec.speed.stdev), // pixels per second
                rotation: 0,
                lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev),    // How long the particle should live, in seconds
                alive: 0    // How long the particle has been alive, in seconds
            };

        return p;
    }

    //------------------------------------------------------------------
    //
    // Update the state of all particles.  
    // This includes removing any that have exceeded their lifetime.
    //
    //------------------------------------------------------------------
    function update(entities, elapsedTime) {
        // TODO: get particles from entities
        // if no particles:
        let particles = {};
        
        // render(particles);

        let removeMe = [];

        //
        // We work with time in seconds, elapsedTime comes in as milliseconds
        elapsedTime = elapsedTime / 1000;
        
        Object.getOwnPropertyNames(particles).forEach(function(value, index, array) {
            let particle = particles[value];
            //
            // Update how long it has been alive
            particle.alive += elapsedTime;

            //
            // Update its center
            particle.center.x += (elapsedTime * particle.speed * particle.direction.x);
            particle.center.y += (elapsedTime * particle.speed * particle.direction.y);

            //
            // Rotate proportional to its speed
            particle.rotation += particle.speed / 500;

            //
            // If the lifetime has expired, identify it for removal
            if (particle.alive > particle.lifetime) {
                removeMe.push(value);
            }
        });

        //
        // Remove all of the expired particles
        for (let particle = 0; particle < removeMe.length; particle++) {
            delete particles[removeMe[particle]];
        }
        removeMe.length = 0;

        //
        // Generate some new particles
        for (let particle = 0; particle < 1; particle++) {
            //
            // Assign a unique name to each particle
            particles[nextName++] = create();
        }
    }

    //------------------------------------------------------------------
    //
    // Render all particles
    //
    //------------------------------------------------------------------
    function render(particles, image) {
        Object.getOwnPropertyNames(particles).forEach( function(value) {
            let particle = particles[value];
            MyGame.systems.render.graphics.drawTexture(image, particle.center, particle.rotation, particle.size);
        });
    }

    //------------------------------------------------------------------
    //
    // creates the particle effect when a player dies
    //
    //------------------------------------------------------------------
    function playerDeath() {

    }

    //------------------------------------------------------------------
    //
    // creates the particle effect when an object is destroyed
    //
    //------------------------------------------------------------------
    function objectDeath() {

    }

    //------------------------------------------------------------------
    //
    // creates the particle effect when the condition IS WIN changes
    //
    //------------------------------------------------------------------
    function objectIsWin(x, y) {

    }

    //------------------------------------------------------------------
    //
    // creates the particle effect when the winning condition is met
    //
    //------------------------------------------------------------------
    function gameWon() {

    }

    //------------------------------------------------------------------
    //
    // creates the particle effect when the verb for IS YOU changes
    //
    //------------------------------------------------------------------
    function objectIsYou() {

    }

    let api = {
        update: update,
        render: render,
        objectIsWin: objectIsWin,
        // get particles() { return particles; }
    };

    return api;
}());