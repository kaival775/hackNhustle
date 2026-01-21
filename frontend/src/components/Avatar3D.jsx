import { useEffect, useRef, useImperativeHandle, forwardRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import ybot from '../Models/ybot/ybot.glb';
import * as words from '../Animations/words';
import * as alphabets from '../Animations/alphabets';
import * as numbers from '../Animations/numbers';
import { defaultPose } from '../Animations/defaultPose';

const Avatar3D = forwardRef((props, ref) => {
  const containerRef = useRef(null);
  const componentRef = useRef({});
  const { current: avatarRef } = componentRef;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useImperativeHandle(ref, () => ({
    performSign: (text, onComplete) => {
      if (!text) return;
      
      const str = text.toUpperCase();
      const strWords = str.split(' ');

      for (let word of strWords) {
        if (numbers[word]) {
          avatarRef.animations.push(['add-text', word + ' ']);
          numbers[word](avatarRef);
        } else if (words[word]) {
          avatarRef.animations.push(['add-text', word + ' ']);
          words[word](avatarRef);
        } else {
          for (const ch of word.split('')) {
            avatarRef.animations.push(['add-text', ch]);
            alphabets[ch] && alphabets[ch](avatarRef);
          }
        }
      }

      avatarRef.onComplete = onComplete;

      if (avatarRef.pending === false) {
        avatarRef.pending = true;
        avatarRef.animate();
      }
    }
  }));

  useEffect(() => {
    if (!containerRef.current) {
      // console.log('Container ref not ready');
      return;
    }

    // console.log('Initializing Avatar3D...');
    // console.log('Container dimensions:', containerRef.current.clientWidth, containerRef.current.clientHeight);

    avatarRef.flag = false;
    avatarRef.pending = false;
    avatarRef.animations = [];
    avatarRef.characters = [];
    avatarRef.speed = 0.1;
    avatarRef.pause = 800;

    avatarRef.scene = new THREE.Scene();
    avatarRef.scene.background = new THREE.Color(0xf0fdfa);

    const spotLight = new THREE.SpotLight(0xffffff, 2);
    spotLight.position.set(0, 5, 5);
    avatarRef.scene.add(spotLight);

    avatarRef.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    const width = containerRef.current.clientWidth || 400;
    const height = containerRef.current.clientHeight || 400;

    // console.log('Setting up renderer with dimensions:', width, height);

    avatarRef.camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 1000);
    avatarRef.renderer.setSize(width, height);

    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(avatarRef.renderer.domElement);
    // console.log('Renderer added to DOM');

    avatarRef.camera.position.z = 1.6;
    avatarRef.camera.position.y = 1.4;

    // console.log('Loading model from:', ybot);

    const loader = new GLTFLoader();
    loader.load(
      ybot,
      (gltf) => {
        // console.log('Avatar loaded successfully');
        gltf.scene.traverse((child) => {
          if (child.type === 'SkinnedMesh') {
            child.frustumCulled = false;
          }
        });
        avatarRef.avatar = gltf.scene;
        avatarRef.avatar.visible = false;
        avatarRef.scene.add(avatarRef.avatar);
        defaultPose(avatarRef);
        
        setTimeout(() => {
          avatarRef.avatar.visible = true;
          setLoading(false);
        }, 100);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      (error) => {
        console.error('Error loading avatar:', error);
        setError(error.message);
        setLoading(false);
      }
    );

    avatarRef.animate = () => {
      if (avatarRef.animations.length === 0) {
        avatarRef.pending = false;
        return;
      }
      requestAnimationFrame(avatarRef.animate);
      
      if (avatarRef.animations[0].length) {
        if (!avatarRef.flag) {
          if (avatarRef.animations[0][0] === 'add-text') {
            avatarRef.animations.shift();
          } else {
            for (let i = 0; i < avatarRef.animations[0].length; ) {
              let [boneName, action, axis, limit, sign] = avatarRef.animations[0][i];
              if (sign === '+' && avatarRef.avatar.getObjectByName(boneName)[action][axis] < limit) {
                avatarRef.avatar.getObjectByName(boneName)[action][axis] += avatarRef.speed;
                avatarRef.avatar.getObjectByName(boneName)[action][axis] = Math.min(
                  avatarRef.avatar.getObjectByName(boneName)[action][axis],
                  limit
                );
                i++;
              } else if (sign === '-' && avatarRef.avatar.getObjectByName(boneName)[action][axis] > limit) {
                avatarRef.avatar.getObjectByName(boneName)[action][axis] -= avatarRef.speed;
                avatarRef.avatar.getObjectByName(boneName)[action][axis] = Math.max(
                  avatarRef.avatar.getObjectByName(boneName)[action][axis],
                  limit
                );
                i++;
              } else {
                avatarRef.animations[0].splice(i, 1);
              }
            }
          }
        }
      } else {
        avatarRef.flag = true;
        setTimeout(() => {
          avatarRef.flag = false;
        }, avatarRef.pause);
        avatarRef.animations.shift();
      }
      avatarRef.renderer.render(avatarRef.scene, avatarRef.camera);
    };

    const renderLoop = () => {
      if (avatarRef.renderer && avatarRef.scene && avatarRef.camera) {
        avatarRef.renderer.render(avatarRef.scene, avatarRef.camera);
      }
      requestAnimationFrame(renderLoop);
    };
    renderLoop();

    return () => {
      if (containerRef.current && avatarRef.renderer && avatarRef.renderer.domElement) {
        try {
          containerRef.current.removeChild(avatarRef.renderer.domElement);
        } catch (e) {
          console.log('Cleanup error:', e);
        }
      }
    };
  }, [avatarRef]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-slate-600">Loading avatar...</div>
        </div>
      )}
    </div>
  );
});

Avatar3D.displayName = 'Avatar3D';

export default Avatar3D;
