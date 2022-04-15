// --------------------------------------------------------------
//
// Renders the particles in a particle system
//
// --------------------------------------------------------------

MyGame.systems.render.particles = (function (Random) {
    'use strict';
    let YOUPARTICLE = MyGame.assets['smoke'];
    let nextName = 1;       // Unique identifier for the next particle
    let particles = {};


    //------------------------------------------------------------------
    //
    // This creates one new particle
    //
    //------------------------------------------------------------------
    function create(spec) {
        let size = Random.nextGaussian(spec.size.mean, spec.size.stdev);
        let p = {
            center: { x: spec.center.x, y: spec.center.y },
            size: { x: size, y: size },  // Making square particles
            direction: Random.nextCircleVector(),
            speed: Random.nextGaussian(spec.speed.mean, spec.speed.stdev), // pixels per second
            rotation: 0,
            lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev),    // How long the particle should live, in seconds
            alive: 0,    // How long the particle has been alive, in seconds,
            image: spec.image,
            name: nextName++,
        };
        return p;
    }
    function makeCall(call, elapsedTime) {
        // console.log(call);
        switch (call.components['particle-effect'].valueType) {
            case 'NewIsYou':
                objectIsYou(call, elapsedTime)
        }
    }
    function checkForNewCalls(entities, elapsedTime, deleteList) {
        let calls = [];
        for (let id in entities) {
            let entity = entities[id];
            if (entity.components['particle-effect']) {
                calls.push({ ...entity });
            }
        }
        // console.log(calls);
        for (let i = 0; i < calls.length; i++) {
            makeCall(calls[i], elapsedTime)
            deleteList[calls[i].id] = true;
        }

    }
    function updateParticles(elapsedTime) {
        let removeMe = [];

        //
        // We work with time in seconds, elapsedTime comes in as milliseconds
        elapsedTime = elapsedTime / 1000;

        Object.getOwnPropertyNames(particles).forEach(function (value, index, array) {
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
        // for (let particle = 0; particle < 1; particle++) {
        //     //
        //     // Assign a unique name to each particle
        //     particles[nextName++] = create();
        // }
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
        // let particles = {};

        // render(particles);
        let deleteList = {};
        checkForNewCalls(entities, elapsedTime, deleteList);
        for (let i in deleteList) {
            delete entities[i];
        }
        updateParticles(elapsedTime);
        // for(let value in particles){
        //     let p = particles[value]
        //     // console.logp)
        //     render(p);
        // }
        render(particles)

    }

    //------------------------------------------------------------------
    //
    // Render all particles
    //
    //------------------------------------------------------------------
    function render(particles) {
        // Object.getOwnPropertyNames(particles).forEach( function(value) {
        //     let particle = particles[value];
        //     MyGame.systems.render.graphics.drawTexture(image, particle.center, particle.rotation, particle.size);
        // });
        // console.log(particle);
        for (let i in particles) {
            let particle = particles[i];
            // MyGame.systems.render.graphics.drawTexture(particle.image, particle.center, particle.rotation, particle.size);
            MyGame.systems.render.graphics.drawSquare(particle.center, particle.size.x, "green", "black");
        }


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
    function spawnYouParticles(ammount, x, y) {
        for (let i = 0; i < ammount; i++) {
            let spec = {
                center: { x: x, y: y },
                size: { mean: 5, stdev: 1 },
                speed: { mean: 10, stdev: 4 },
                lifetime: { mean: 5, stdev: 1 },
                image: YOUPARTICLE,
            }
            let p = create(spec);
            particles[p.name] = p;
        }
        // console.log(particles);
    }
    //------------------------------------------------------------------
    //
    // creates the particle effect when the verb for IS YOU changes
    //
    //------------------------------------------------------------------
    let isYouEffectTime = 0;
    function objectIsYou(entity, elapsedTime) {
        isYouEffectTime -= elapsedTime;
        // console.log("In object is you")
        // console.log(elapsedTime)
        // console.log(isYouEffectTime)
        if (isYouEffectTime <= 0) {
            isYouEffectTime += 1000;
            // console.log("In object is you")
            // console.log(entity);
            spawnYouParticles(100, entity.components.position.x, entity.components.position.y);
        }
    }

    let api = {
        update: update,
        render: render,
        objectIsWin: objectIsWin,
        // get particles() { return particles; }
    };

    return api;
}(MyGame.systems.Random));