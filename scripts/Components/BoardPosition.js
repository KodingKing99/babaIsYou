MyGame.components.BoardPosition = function(spec){
    return {
        get name(){return 'board-position'},
        get x(){return spec.x;},
        set x(nX){spec.x = nX},
        get y(){return spec.y;},
        set y(nY){spec.y = nY},
    }
}