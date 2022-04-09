/////////////////////
// spec: {
//          assetKey: string - key to use for MyGame.assets
//          animationTimes: int[] of animation times
//      }
/////////////////////
MyGame.components.Sprite = function(spec){
    let subImageIndex = 0;
    let animationTimeOriginal = spec.animationTime;
    let spritesToAnimateOriginal = spec.spritesToAnimate;
    let animationTimeCopy = animationTimeOriginal;
    let extraAnimationDuration;
    // animateExtra: true if we need to animate more of an animation for a period of time
    let animateExtra = false;
    function subAnimationTime(ammount){
        spec.animationTime -= ammount;
    }
    //------------------------------------------------------------------
    // For setting the animation time back to it's original 
    //------------------------------------------------------------------
    function resetAnimationToOriginal(){
        spec.animationTime = animationTimeOriginal;
        spec.spritesToAnimate = spritesToAnimateOriginal;
        animationTimeCopy = spec.animationTime;
    }
    //------------------------------------------------------------------
    // For animating each fram. 
    //------------------------------------------------------------------
    function resetAnimationFrame(){
        spec.animationTime += animationTimeCopy;
    }
    function incrementSubImageIndex(){
        subImageIndex += 1;
        // Wrap back around
        subImageIndex = subImageIndex % spec.spriteCount
    }
    return {
        get key(){return spec.assetKey},
        set key(newKey){spec.assetKey = newKey},
        get name(){return 'sprite'},
        get spriteCount(){return spec.spriteCount; },
        get animationTime(){ return spec.animationTime; },
        get subImageIndex(){ return subImageIndex; },
        set animationTime(ammount){spec.animationTime = ammount;},
        get animateExtra(){return animateExtra;},
        set animateExtra(mBool){animateExtra = mBool},
        get spritesToAnimate(){return spec.spritesToAnimate;},
        set spritesToAnimate(howMuch){spec.spritesToAnimate = howMuch;},
        set animationTimeCopy(howMuch){animationTimeCopy = howMuch},
        get extraAnimationDuration(){return extraAnimationDuration;},
        set extraAnimationDuration(extraDuration){extraAnimationDuration = extraDuration},
        // subAnimationTime: subAnimationTime,
        resetAnimationToOriginal: resetAnimationToOriginal,
        resetAnimationFrame: resetAnimationFrame,
        set subImageIndex(mInt){
            subImageIndex = mInt;
        }
        // incrementSubImageIndex: incrementSubImageIndex,
    }
}