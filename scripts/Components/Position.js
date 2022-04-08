MyGame.components.Position = function(spec){
    return {
        get name(){return 'position'},
        get x(){return spec.x;},
        get y(){return spec.y;},
        set x(nX){spec.x = nX},
        set y(nY){spec.y = nY},
    }
}