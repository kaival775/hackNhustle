export const FIVE = (ref) => {
    let animations = []

    // Extend all fingers including thumb on right hand (open palm)
    // Raise forearm (elbow rotation only, no shoulder)
    animations.push(["mixamorigRightForeArm", "rotation", "x", -Math.PI/4, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI/6, "+"]);

    ref.animations.push(animations);

    // Return to normal position
    animations = []
    animations.push(["mixamorigRightForeArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);

    ref.animations.push(animations);

    if(ref.pending === false){
        ref.pending = true;
        ref.animate();
    }
}
