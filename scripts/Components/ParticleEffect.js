MyGame.components.ParticleEffect = function(spec){
    const valueTypes = {
        NEWISYOU: 'NewIsYou',
    }
    return {
        get name(){return 'particle-effect'},
        get key(){return spec.key},
        get valueType(){return valueTypes[spec.key]},
    }
};