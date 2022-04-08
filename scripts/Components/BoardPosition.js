MyGame.components.BoardPosition = function(spec){
    return {
        get name(){return 'board-position'},
        get x(){return spec.x;},
        get y(){return spec.y;}
    }
}