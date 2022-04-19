MyGame.components.Undo = function(spec){
    return {
        get name(){return 'undo'},
        get type(){return spec.type},
    }
}