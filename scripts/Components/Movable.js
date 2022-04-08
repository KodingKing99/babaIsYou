MyGame.components.Movable = function(spec){
    return{
        // console.loo
        get name(){return 'movable';},
        get moveDirection(){return spec.moveDirection;},
        get facing(){return spec.facing;},
        set facing(dir){spec.facing = dir},
        set moveDirection(dir){spec.moveDirection = dir},
    }
};