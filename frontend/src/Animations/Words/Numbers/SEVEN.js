export const SEVEN = (ref) => {
    let animations = []

    // Right hand: Show 5 (all fingers extended)
    animations.push(["mixamorigRightForeArm", "rotation", "x", -Math.PI/4, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI/6, "+"]);

    // Left hand: Show 2 (index and middle extended)
    animations.push(["mixamorigLeftHandRing1", "rotation", "z", -Math.PI/2, "-"]);
    animations.push(["mixamorigLeftHandRing2", "rotation", "z", -Math.PI/2, "-"]);
    animations.push(["mixamorigLeftHandRing3", "rotation", "z", -Math.PI/2, "-"]);
    animations.push(["mixamorigLeftHandPinky1", "rotation", "z", -Math.PI/2, "-"]);
    animations.push(["mixamorigLeftHandPinky2", "rotation", "z", -Math.PI/2, "-"]);
    animations.push(["mixamorigLeftHandPinky3", "rotation", "z", -Math.PI/2, "-"]);
    animations.push(["mixamorigLeftHandThumb2", "rotation", "y", Math.PI/2.5, "+"]);
    animations.push(["mixamorigLeftHandThumb3", "rotation", "y", Math.PI/2.5, "+"]);

    animations.push(["mixamorigLeftForeArm", "rotation", "x", -Math.PI/4, "-"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "z", -Math.PI/6, "-"]);

    ref.animations.push(animations);

    // Return to normal position
    animations = []
    animations.push(["mixamorigRightForeArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);

    animations.push(["mixamorigLeftHandRing1", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigLeftHandRing2", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigLeftHandRing3", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigLeftHandPinky1", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigLeftHandPinky2", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigLeftHandPinky3", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigLeftHandThumb2", "rotation", "y", 0, "-"]);
    animations.push(["mixamorigLeftHandThumb3", "rotation", "y", 0, "-"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "z", 0, "+"]);

    ref.animations.push(animations);

    if(ref.pending === false){
        ref.pending = true;
        ref.animate();
    }
}
