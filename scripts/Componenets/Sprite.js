/////////////////////
// spec: {
//          assetKey: string - key to use for MyGame.assets
//          animationTimes: int[] of animation times
//      }
/////////////////////
MyGame.components.Sprite = function(spec){
    let subImageIndex = 0;
    let animationTimeCopy = spec.animationTime;
    function subAnimationTime(ammount){
        spec.animationTime -= ammount;
    }
    function resetAnimationTime(){
        spec.animationTime += animationTimeCopy;
    }
    function incrementSubImageIndex(){
        subImageIndex += 1;
        // Wrap back around
        subImageIndex = subImageIndex % spec.spriteCount
    }
    return {
        get key(){return spec.assetKey},
        get name(){return 'sprite'},
        get spriteCount(){return spec.spriteCount; },
        get animationTime(){ return spec.animationTime; },
        get subImageIndex(){ return subImageIndex; },
        set animationTime(ammount){spec.animationTime = ammount;},
        // subAnimationTime: subAnimationTime,
        resetAnimationTime: resetAnimationTime,
        set subImageIndex(mInt){
            subImageIndex = mInt;
        }
        // incrementSubImageIndex: incrementSubImageIndex,
    }
}