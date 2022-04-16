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
            direction: spec.direction,
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
        calls.sort((a, b) => a.components['board-position'].y - b.components['board-position'].y)
        calls.sort((a, b) => a.components['board-position'].x - b.components['board-position'].x)
        // console.log(calls);
        
        for (let i = 0; i < calls.length; i++) {
            makeCall(calls[i], elapsedTime)
            if(calls[i].components['particle-effect'].isComplete){
                deleteList[calls[i].id] = true;
            }
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
            // console.log(particle);
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
            // console.log("rendering particle")
            // MyGame.systems.render.graphics.drawTexture(particle.image, particle.center, particle.rotation, particle.size);
            // console.log("rendered particle")
            // MyGame.systems.render.graphics.drawSquare(particle.center, particle.size.x, "green", "black");
            MyGame.systems.render.graphics.drawCircle(particle.center, particle.size.x, "green");
            // MyGame.systems.render.graphics.drawCircle({x: 0, y: 0}, 2, "green");
            // console.log("drew circle");
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
    function spawnYouParticleXY(x, y, direction) {
        let spec = {
            center: { x: x, y: y },
            size: { mean: 5, stdev: 1 },
            speed: { mean: 10, stdev: 4 },
            lifetime: { mean: 5, stdev: 1 },
            direction: direction,
            image: YOUPARTICLE,
        }

        let p = create(spec);
        particles[p.name] = p;
    }
    function spawnLineParticles(ammount, x, y, direction, size) {
        switch (direction) {
            case 'up':
                {
                    let start = x - (size / 2);
                    let end = x + (size / 2);
                    let mY = y - (size / 2);
                    for (let i = 0; i < ammount; i++) {
                        let mX = MyGame.systems.Random.nextRange(start, end);
                        let mDirection = Random.nextUpVector();
                        spawnYouParticleXY(mX, mY, mDirection);
                    }
                    break;
                }
            case 'down':
                {
                    let start = x - (size / 2);
                    let end = x + (size / 2);
                    let mY = y + (size / 2);
                    for (let i = 0; i < ammount; i++) {
                        let mX = MyGame.systems.Random.nextRange(start, end);
                        let mDirection = Random.nextDownVector();
                        spawnYouParticleXY(mX, mY, mDirection);
                    }
                    break;
                }
            case 'right':
                {
                    let start = y - (size / 2);
                    let end = y + (size / 2);
                    let mX = x - (size / 2);
                    for (let i = 0; i < ammount; i++) {
                        let mY = MyGame.systems.Random.nextRange(start, end);
                        let mDirection = Random.nextLeftVector();
                        spawnYouParticleXY(mX, mY, mDirection);
                    }
                    break;
                }
            case 'left':
                {
                    let start = y - (size / 2);
                    let end = y + (size / 2);
                    let mX = x + (size / 2);
                    for (let i = 0; i < ammount; i++) {
                        let mY = MyGame.systems.Random.nextRange(start, end);
                        let mDirection = Random.nextRightVector();
                        spawnYouParticleXY(mX, mY, mDirection);
                    }
                    break;
                }

        }
    }
    function spawnYouParticles(ammount, x, y, size) {
        spawnLineParticles(ammount, x, y, 'up', size);
        spawnLineParticles(ammount, x, y, 'down', size);
        spawnLineParticles(ammount, x, y, 'right', size);
        spawnLineParticles(ammount, x, y, 'left', size);

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
        if (isYouEffectTime <= 0) {
            isYouEffectTime += 800;
            spawnYouParticles(100, entity.components.position.x, entity.components.position.y, entity.components.size.x);
            entity.components['particle-effect'].isComplete = true;
        }
        // console.log()
    }

    let api = {
        update: update,
        render: render,
        objectIsWin: objectIsWin,
        // get particles() { return particles; }
    };

    return api;
}(MyGame.systems.Random));