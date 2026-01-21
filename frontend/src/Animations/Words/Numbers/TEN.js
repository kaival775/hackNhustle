export const TEN = (ref) => {
    let animations = []

    // Right hand: Show 5 (all fingers extended)
    animations.push(["mixamorigRightForeArm", "rotation", "x", -Math.PI/4, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI/6, "+"]);

    // Left hand: Show 5 (all fingers extended)
    animations.push(["mixamorigLeftForeArm", "rotation", "x", -Math.PI/4, "-"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "z", -Math.PI/6, "-"]);

    ref.animations.push(animations);

    // Return to normal position
    animations = []
    animations.push(["mixamorigRightForeArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "z", 0, "+"]);

    ref.animations.push(animations);

    if(ref.pending === false){
        ref.pending = true;
        ref.animate();
    }
}
