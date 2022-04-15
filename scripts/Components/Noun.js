MyGame.components.Noun = function(spec){
    const valueTypes = {
        BABA: 'Baba',
        WALL: 'Wall',
        ROCK: 'Rock',
        HEDGE: 'Hedge',
        FLAG: 'Flag',
    }
    return {
        get name(){return 'noun'},
        get key(){return spec.key},
        get valueType(){return valueTypes[spec.key]},
    }
};