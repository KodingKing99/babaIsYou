MyGame.components.ParticleEffect = function(spec){
    const valueTypes = {
        NEWISYOU: 'NewIsYou',
        BABAWALK: 'BabaWalk',
        WON: 'Won',
    };
    let isComplete = false;
    return {
        get name(){return 'particle-effect'},
        get key(){return spec.key},
        get valueType(){return valueTypes[spec.key]},
        get isComplete(){return isComplete},
        set isComplete(mBool){isComplete = mBool},
    }
};