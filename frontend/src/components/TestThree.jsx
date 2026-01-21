import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function TestThree() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0fdfa);

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Create a simple cube
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    console.log('Test Three.js scene created successfully');

    return () => {
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute top-4 left-4 bg-white p-2 rounded">
        <p className="text-sm">If you see a rotating green cube, Three.js is working!</p>
      </div>
    </div>
  );
}
