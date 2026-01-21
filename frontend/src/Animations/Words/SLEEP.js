export const SLEEP = (ref) => {

    let animations = [];

    // Step 1: Raise both arms towards face level (opposite rotations to meet at center)
    animations.push(["mixamorigLeftArm", "rotation", "x", -Math.PI / 2.5, "-"]);
    animations.push(["mixamorigLeftArm", "rotation", "z", -Math.PI / 4, "-"]);
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 2.5, "-"]);
    animations.push(["mixamorigRightArm", "rotation", "z", Math.PI / 4, "+"]);

    ref.animations.push(animations);

    // Step 2: Bend forearms inward (opposite y rotations to bring hands together)
    animations = [];
    animations.push(["mixamorigLeftForeArm", "rotation", "x", -Math.PI / 1.8, "-"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "y", Math.PI / 3, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "x", -Math.PI / 1.8, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "y", -Math.PI / 3, "-"]);

    ref.animations.push(animations);

    // Step 3: Angle hands to form pillow pose (opposite z rotations) and tilt head
    animations = [];
    animations.push(["mixamorigLeftHand", "rotation", "x", -Math.PI / 8, "-"]);
    animations.push(["mixamorigLeftHand", "rotation", "z", Math.PI / 6, "+"]);
    animations.push(["mixamorigRightHand", "rotation", "x", -Math.PI / 8, "-"]);
    animations.push(["mixamorigRightHand", "rotation", "z", -Math.PI / 6, "-"]);
    animations.push(["mixamorigHead", "rotation", "z", -Math.PI / 8, "-"]);
    animations.push(["mixamorigHead", "rotation", "x", Math.PI / 18, "+"]);

    ref.animations.push(animations);

    // Step 4: Hold the sleep position briefly
    animations = [];
    ref.animations.push(animations);

    // Step 5: Reset to neutral/default pose
    animations = [];
    animations.push(["mixamorigLeftArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigLeftArm", "rotation", "z", -Math.PI/3, "-"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "y", -Math.PI/1.5, "-"]);
    animations.push(["mixamorigLeftHand", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigLeftHand", "rotation", "z", 0, "-"]);

    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightArm", "rotation", "z", Math.PI/3, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "y", Math.PI/1.5, "+"]);
    animations.push(["mixamorigRightHand", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightHand", "rotation", "z", 0, "+"]);

    animations.push(["mixamorigHead", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigHead", "rotation", "x", 0, "-"]);

    ref.animations.push(animations);

    if (ref.pending === false) {
        ref.pending = true;
        ref.animate();
    }
};
