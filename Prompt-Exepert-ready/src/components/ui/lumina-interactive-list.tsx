import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

export function LuminaInteractiveList() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 8;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const count = 220;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 1.5 + Math.random() * 4.5;
      const angle = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4.8;
      positions[i * 3 + 2] = Math.sin(angle) * radius - 2;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({ color: 0x67e8f9, size: 0.028, transparent: true, opacity: 0.35 });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(2.1, 64, 64),
      new THREE.MeshBasicMaterial({ color: 0x155e75, transparent: true, opacity: 0.12 })
    );
    scene.add(glow);

    const reveal = { opacity: 0 };
    gsap.to(reveal, { opacity: 1, duration: 1.6, ease: "power2.out" });

    const resize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", resize);

    let frame = 0;
    const render = () => {
      frame = requestAnimationFrame(render);
      points.rotation.y += 0.0007;
      points.rotation.x = Math.sin(Date.now() * 0.00025) * 0.08;
      glow.scale.setScalar(1 + Math.sin(Date.now() * 0.001) * 0.035);
      material.opacity = 0.12 + reveal.opacity * 0.24;
      renderer.render(scene, camera);
    };
    render();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      gsap.killTweensOf(reveal);
      geometry.dispose(); material.dispose();
      glow.geometry.dispose(); (glow.material as THREE.Material).dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />;
}
