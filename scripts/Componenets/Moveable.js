MyGame.components.Moveable = (function(spec){
    return{
        get name(){return 'moveable';},
        get moveDirection(){return spec.moveDirection;},
        get facing(){return spec.facing;},
    }
});