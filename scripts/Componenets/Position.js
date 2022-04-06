MyGame.components.Position = function(spec){
    return {
        get name(){return 'position'},
        get x(){return spec.x;},
        get y(){return spec.y;}
    }
}