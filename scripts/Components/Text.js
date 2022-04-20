MyGame.components.Text = function(spec){
    'use strict'
    const valueTypes = {
        WALL: 'Wall',
        STOP: 'Stop',
        PUSH: 'Push',
        IS: 'Is',
        ROCK: 'Rock',
        BABA: 'Baba',
        FLAG: 'Flag',
        YOU: 'You',
        WIN: 'Win',
        SINK: 'Sink',
        KILL: 'Kill',
        WATER: 'Water',
        LAVA: 'Lava',
    }
    const adjectives = {
        STOP: true,
        PUSH: true,
        WIN: true,
        YOU: true,
        SINK: true,
        KILL: true,
    };
    const verbs = {
        IS: true
    }
    const nouns = {
        WALL: true,
        ROCK: true,
        BABA: true,
        FLAG: true,
        WATER: true,
        LAVA: true,
    } 
    function isAdjective(key){
        if(adjectives[key]){
            return true;
        }
        return false;
    }
    function isVerb(key){
        if(verbs[key]){
            return true;
        }
        return false;
    }
    function isNoun(key){
        if(nouns[key]){
            return true;
        }
        return false;
    }
    return {
        get name(){return 'text';},
        get key(){return spec.key;},
        get valueType(){return valueTypes[spec.key];},
        get wordType(){return isNoun(spec.key) ? 'NOUN' : isVerb(spec.key) ? 'VERB' : isAdjective(spec.key) ? 'ADJECTIVE' : 'NONE'}
    }
}