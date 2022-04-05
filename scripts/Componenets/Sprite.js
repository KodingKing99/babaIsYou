/////////////////////
// spec: {
//          assetKey: string - key to use for MyGame.assets
//          animationTimes: int[] of animation times
//      }
/////////////////////
MyGame.components.Sprite = function(spec){
    return {
        get key(){return spec.assetKey},
        get name(){return 'sprite'},
        get animationTimes(){ return spec.animationTimes; },
    }
}