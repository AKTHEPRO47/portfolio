// Hero 3D Animation using Three.js - Enhanced Red/Black Theme
let scene, camera, renderer, orb, innerOrb, particles, particleSystem2, ring1, ring2;
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;
let time = 0;

function initHeroAnimation() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    // Setup scene with fog
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.02);
    
    // Setup camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 5;

    // Setup renderer
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create main glass orb with red glow
    const orbGeometry = new THREE.SphereGeometry(1, 64, 64);
    const orbMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xff0000,
        metalness: 0.3,
        roughness: 0.1,
        transparent: true,
        opacity: 0.4,
        envMapIntensity: 1,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        emissive: 0xff0000,
        emissiveIntensity: 0.3
    });
    orb = new THREE.Mesh(orbGeometry, orbMaterial);
    scene.add(orb);

    // Inner pulsing core
    const innerGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const innerMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.6
    });
    innerOrb = new THREE.Mesh(innerGeometry, innerMaterial);
    orb.add(innerOrb);

    // Add animated wireframe
    const wireframeGeometry = new THREE.SphereGeometry(1.05, 32, 32);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true,
        transparent: true,
        opacity: 0.4
    });
    const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    orb.add(wireframe);

    // Outer glowing ring
    const outerWireframeGeometry = new THREE.SphereGeometry(1.15, 24, 24);
    const outerWireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0xdc143c,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const outerWireframe = new THREE.Mesh(outerWireframeGeometry, outerWireframeMaterial);
    orb.add(outerWireframe);

    // Rotating rings
    const ringGeometry = new THREE.TorusGeometry(1.5, 0.02, 16, 100);
    const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.6
    });
    ring1 = new THREE.Mesh(ringGeometry, ringMaterial);
    ring1.rotation.x = Math.PI / 2;
    scene.add(ring1);

    const ringMaterial2 = new THREE.MeshBasicMaterial({
        color: 0xdc143c,
        transparent: true,
        opacity: 0.4
    });
    ring2 = new THREE.Mesh(ringGeometry, ringMaterial2);
    ring2.rotation.y = Math.PI / 2;
    scene.add(ring2);

    // Enhanced particle system - red particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const positions = new Float32Array(particlesCount * 3);
    const velocities = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i += 3) {
        // Spread particles in a sphere
        const radius = 8;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        
        positions[i] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i + 2] = radius * Math.cos(phi);
        
        velocities[i] = (Math.random() - 0.5) * 0.02;
        velocities[i + 1] = (Math.random() - 0.5) * 0.02;
        velocities[i + 2] = (Math.random() - 0.5) * 0.02;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        color: 0xff0000,
        size: 0.05,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Second particle layer - smaller, crimson
    const particlesGeometry2 = new THREE.BufferGeometry();
    const particlesCount2 = 500;
    const positions2 = new Float32Array(particlesCount2 * 3);

    for (let i = 0; i < particlesCount2 * 3; i++) {
        positions2[i] = (Math.random() - 0.5) * 15;
    }

    particlesGeometry2.setAttribute('position', new THREE.BufferAttribute(positions2, 3));
    
    const particlesMaterial2 = new THREE.PointsMaterial({
        color: 0xdc143c,
        size: 0.03,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    particleSystem2 = new THREE.Points(particlesGeometry2, particlesMaterial2);
    scene.add(particleSystem2);

    // Add dynamic lights
    const ambientLight = new THREE.AmbientLight(0x330000, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xff0000, 2, 10);
    pointLight.position.set(2, 3, 4);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xdc143c, 2, 10);
    pointLight2.position.set(-2, -3, -4);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xff0000, 1.5, 8);
    pointLight3.position.set(0, 0, 2);
    scene.add(pointLight3);

    // Mouse movement
    document.addEventListener('mousemove', onMouseMove);
    
    // Handle resize
    window.addEventListener('resize', onWindowResize);

    // Start animation
    animate();
}

function onMouseMove(event) {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    time += 0.01;

    // Smooth mouse following
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    // Rotate main orb with complex motion
    if (orb) {
        orb.rotation.x += 0.002;
        orb.rotation.y += 0.003;
        orb.position.x = targetX * 0.5 + Math.sin(time * 0.5) * 0.1;
        orb.position.y = targetY * 0.5 + Math.cos(time * 0.5) * 0.1;
        
        // Scale pulsing effect
        const scale = 1 + Math.sin(time * 2) * 0.05;
        orb.scale.set(scale, scale, scale);
    }

    // Pulse inner core
    if (innerOrb) {
        const innerScale = 1 + Math.sin(time * 3) * 0.2;
        innerOrb.scale.set(innerScale, innerScale, innerScale);
        innerOrb.material.opacity = 0.4 + Math.sin(time * 2) * 0.2;
    }

    // Rotate rings in opposite directions
    if (ring1) {
        ring1.rotation.z += 0.01;
        ring1.position.x = Math.sin(time * 0.3) * 0.5;
        ring1.position.y = Math.cos(time * 0.3) * 0.5;
    }
    if (ring2) {
        ring2.rotation.x -= 0.008;
        ring2.position.x = Math.cos(time * 0.4) * 0.3;
        ring2.position.z = Math.sin(time * 0.4) * 0.3;
    }

    // Animate particles with velocity
    if (particles) {
        particles.rotation.y += 0.0005;
        const positions = particles.geometry.attributes.position.array;
        const velocities = particles.geometry.attributes.velocity.array;
        
        for (let i = 0; i < positions.length; i += 3) {
            positions[i] += velocities[i];
            positions[i + 1] += velocities[i + 1];
            positions[i + 2] += velocities[i + 2];
            
            // Wrap around
            if (Math.abs(positions[i]) > 10) velocities[i] *= -1;
            if (Math.abs(positions[i + 1]) > 10) velocities[i + 1] *= -1;
            if (Math.abs(positions[i + 2]) > 10) velocities[i + 2] *= -1;
        }
        particles.geometry.attributes.position.needsUpdate = true;
    }

    // Rotate second particle system
    if (particleSystem2) {
        particleSystem2.rotation.x += 0.0003;
        particleSystem2.rotation.y += 0.0005;
    }

    renderer.render(scene, camera);
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroAnimation);
} else {
    initHeroAnimation();
}
