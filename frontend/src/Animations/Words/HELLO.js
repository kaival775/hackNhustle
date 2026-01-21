export const HELLO = (ref) => {
    let animations = [];

    // Step 1: Raise right hand
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI/3, "-"]);
    animations.push(["mixamorigRightArm", "rotation", "z", Math.PI/6, "+"]);
    ref.animations.push(animations);

    // Step 2: Wave (rotate forearm)
    animations = [];
    animations.push(["mixamorigRightForeArm", "rotation", "y", Math.PI/4, "+"]);
    ref.animations.push(animations);

    animations = [];
    animations.push(["mixamorigRightForeArm", "rotation", "y", -Math.PI/4, "-"]);
    ref.animations.push(animations);

    // Step 3: Reset to default
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightArm", "rotation", "z", Math.PI/3, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "y", Math.PI/1.5, "+"]);
    ref.animations.push(animations);

    if (ref.pending === false) {
        ref.pending = true;
        ref.animate();
    }
};