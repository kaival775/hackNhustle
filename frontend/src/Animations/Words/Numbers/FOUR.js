export const FOUR = (ref) => {
    let animations = []

    // Extend all fingers except thumb on right hand
    animations.push(["mixamorigRightHandThumb2", "rotation", "y", -Math.PI/2.5, "-"]);
    animations.push(["mixamorigRightHandThumb3", "rotation", "y", -Math.PI/2.5, "-"]);

    // Raise forearm (elbow rotation only, no shoulder)
    animations.push(["mixamorigRightForeArm", "rotation", "x", -Math.PI/4, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI/6, "+"]);

    ref.animations.push(animations);

    // Return to normal position
    animations = []
    animations.push(["mixamorigRightHandThumb2", "rotation", "y", 0, "+"]);
    animations.push(["mixamorigRightHandThumb3", "rotation", "y", 0, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);

    ref.animations.push(animations);

    if(ref.pending === false){
        ref.pending = true;
        ref.animate();
    }
}
