MyGame.components.Size = function(spec){
    return {
        get name(){return 'size'},
        get x(){return spec.x;},
        get y(){return spec.y;}
    }
}