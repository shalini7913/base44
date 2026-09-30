import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * 3D Rotating Interactive/Ambient Globe for Front Page Background
 * Uses Three.js WebGL with GPU acceleration.
 * - Multi-layered wireframe & dot-matrix geospatial sphere
 * - Pulsing disaster telemetry nodes & orbital transmission rings
 * - Smooth continuous rotation with realistic axial tilt & subtle cursor parallax
 * - Fully non-intrusive (pointer-events-none, background z-index)
 */
export default function GlobeBackground({ className = '' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 240;

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: 'high-performance' 
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Root Globe Group (allows tilting the axis)
    const globeGroup = new THREE.Group();
    globeGroup.rotation.x = 0.32; // ~18 deg axial tilt
    globeGroup.rotation.z = -0.08;
    scene.add(globeGroup);

    const radius = 75;

    // 3. Inner Dark Transparent Sphere (gives depth & atmospheric body)
    const innerGeo = new THREE.SphereGeometry(radius * 0.98, 48, 48);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.05,
    });
    const innerSphere = new THREE.Mesh(innerGeo, innerMat);
    globeGroup.add(innerSphere);

    // 4. Primary Latitude/Longitude Wireframe Grid
    const wireGeo = new THREE.SphereGeometry(radius, 36, 26);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x0ea5e9, // Sky-500
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    const wireSphere = new THREE.Mesh(wireGeo, wireMat);
    globeGroup.add(wireSphere);

    // 5. Equatorial & Tropic Highlight Rings
    const ringMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.45,
    });
    [-35, 0, 35].forEach(latDeg => {
      const phi = (90 - latDeg) * (Math.PI / 180);
      const ringRadius = radius * Math.sin(phi);
      const ringY = radius * Math.cos(phi);

      const circleGeo = new THREE.BufferGeometry();
      const points = [];
      const segments = 64;
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(
          ringRadius * Math.cos(theta),
          ringY,
          ringRadius * Math.sin(theta)
        ));
      }
      circleGeo.setFromPoints(points);
      const ringLine = new THREE.Line(circleGeo, ringMat);
      globeGroup.add(ringLine);
    });

    // 6. Global Telemetry Nodes (Distributed Points mimicking continents & stations)
    const particleCount = 520;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorSky = new THREE.Color(0x0284c7);
    const colorTeal = new THREE.Color(0x06b6d4);
    const colorAmber = new THREE.Color(0xf59e0b);
    const colorRed = new THREE.Color(0xef4444);

    for (let i = 0; i < particleCount; i++) {
      // Golden Spiral distribution on sphere surface
      const phi = Math.acos(1 - 2 * (i + 0.5) / particleCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;

      const r = radius * (1 + (Math.random() * 0.025));
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.cos(phi);
      const z = r * Math.sin(phi) * Math.sin(theta);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Color distribution: mostly sky/teal, some amber warnings, few red critical pings
      let pColor = colorSky;
      const rand = Math.random();
      if (rand > 0.94) pColor = colorRed;
      else if (rand > 0.85) pColor = colorAmber;
      else if (rand > 0.55) pColor = colorTeal;

      colors[i * 3] = pColor.r;
      colors[i * 3 + 1] = pColor.g;
      colors[i * 3 + 2] = pColor.b;
    }

    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    dotGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Custom circular glow texture
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.3, 'rgba(56,189,248,0.9)');
    grad.addColorStop(0.7, 'rgba(14,165,233,0.3)');
    grad.addColorStop(1, 'rgba(14,165,233,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(32, 32, 32, 0, Math.PI * 2);
    ctx.fill();

    const dotTexture = new THREE.CanvasTexture(canvas);
    const dotMat = new THREE.PointsMaterial({
      size: 5.5,
      map: dotTexture,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const pointsField = new THREE.Points(dotGeo, dotMat);
    globeGroup.add(pointsField);

    // 7. Outer Orbital Satellite / Telemetry Transmission Arcs
    const orbitalGroup = new THREE.Group();
    globeGroup.add(orbitalGroup);

    const orbitMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.3,
    });

    const createOrbitArc = (rotX, rotY, radiusMult) => {
      const arcGeo = new THREE.BufferGeometry();
      const pts = [];
      const segs = 72;
      for (let i = 0; i <= segs; i++) {
        const a = (i / segs) * Math.PI * 2;
        pts.push(new THREE.Vector3(
          radius * radiusMult * Math.cos(a),
          0,
          radius * radiusMult * Math.sin(a)
        ));
      }
      arcGeo.setFromPoints(pts);
      const arc = new THREE.Line(arcGeo, orbitMat);
      arc.rotation.x = rotX;
      arc.rotation.y = rotY;
      orbitalGroup.add(arc);
    };

    createOrbitArc(Math.PI / 4, Math.PI / 6, 1.25);
    createOrbitArc(-Math.PI / 3, Math.PI / 4, 1.35);

    // 8. Interactive Parallax via Cursor
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onPointerMove = (e) => {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.0003;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.0003;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    // 9. Animation Loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      // Smooth continuous 3D rotation
      globeGroup.rotation.y += delta * 0.22;
      orbitalGroup.rotation.y -= delta * 0.12;

      // Subtle mouse tilt
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;
      globeGroup.rotation.x = 0.32 + targetY;
      globeGroup.rotation.z = -0.08 + targetX;

      renderer.render(scene, camera);
    };
    animate();

    // 10. Resize Observer
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 500;
      const newH = container.clientHeight || 500;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', onPointerMove);
      cancelAnimationFrame(animId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      dotGeo.dispose();
      dotMat.dispose();
      dotTexture.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none select-none overflow-hidden ${className}`}
      aria-hidden="true"
    />
  );
}
