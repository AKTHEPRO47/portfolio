/* ========================================
   SKILLS 3D — Interactions & Animations
   ======================================== */
(function () {
    'use strict';

    /* ── THREE.JS PARTICLE BACKGROUND ── */
    function initParticleBackground() {
        const canvas = document.getElementById('skills3dBg');
        if (!canvas || typeof THREE === 'undefined') return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Particles
        const particleCount = 200;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities = [];

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
            velocities.push({
                x: (Math.random() - 0.5) * 0.005,
                y: (Math.random() - 0.5) * 0.005,
                z: (Math.random() - 0.5) * 0.002
            });
        }
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            color: 0xff0000,
            size: 0.04,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending,
        });

        const particles = new THREE.Points(geometry, material);
        scene.add(particles);

        // Connection lines
        const lineGeometry = new THREE.BufferGeometry();
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0xff0000,
            transparent: true,
            opacity: 0.08,
        });
        const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
        scene.add(lines);

        camera.position.z = 8;

        let mouseX = 0, mouseY = 0;
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        });

        function animate() {
            requestAnimationFrame(animate);

            const pos = geometry.attributes.position.array;
            const linePositions = [];

            for (let i = 0; i < particleCount; i++) {
                pos[i * 3] += velocities[i].x;
                pos[i * 3 + 1] += velocities[i].y;
                pos[i * 3 + 2] += velocities[i].z;

                // Wrap around
                for (let a = 0; a < 3; a++) {
                    const idx = i * 3 + a;
                    if (pos[idx] > 10) pos[idx] = -10;
                    if (pos[idx] < -10) pos[idx] = 10;
                }

                // Connect nearby particles
                for (let j = i + 1; j < particleCount; j++) {
                    const dx = pos[i * 3] - pos[j * 3];
                    const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
                    const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
                    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                    if (dist < 2) {
                        linePositions.push(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
                        linePositions.push(pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]);
                    }
                }
            }

            geometry.attributes.position.needsUpdate = true;

            lineGeometry.setAttribute('position',
                new THREE.BufferAttribute(new Float32Array(linePositions), 3)
            );

            // Mouse parallax
            camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.02;
            camera.position.y += (-mouseY * 0.5 - camera.position.y) * 0.02;
            camera.lookAt(scene.position);

            particles.rotation.y += 0.0003;

            renderer.render(scene, camera);
        }

        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    /* ── 3D TILT EFFECT ON CARDS ── */
    function initTiltCards() {
        const cards = document.querySelectorAll('[data-tilt]');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -8;
                const rotateY = ((x - centerX) / centerX) * 8;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;

                // Move glow to mouse position
                const glow = card.querySelector('.card-glow');
                if (glow) {
                    glow.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(255,0,0,0.15), transparent 40%)`;
                    glow.style.opacity = '1';
                }
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                const glow = card.querySelector('.card-glow');
                if (glow) {
                    glow.style.opacity = '0';
                    glow.style.background = '';
                }
            });
        });
    }

    /* ── RADIAL PROGRESS ANIMATION ── */
    function initRadialProgress() {
        const circumference = 2 * Math.PI * 52; // r=52

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const value = parseInt(el.dataset.value);
                    const fillCircle = el.querySelector('.fill');
                    const offset = circumference - (value / 100) * circumference;
                    fillCircle.style.strokeDashoffset = offset;
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.3 });

        document.querySelectorAll('.radial-progress').forEach(el => {
            observer.observe(el);
        });
    }

    /* ── FILTER TABS ── */
    function initFilterTabs() {
        const tabs = document.querySelectorAll('.filter-tab');
        const cards = document.querySelectorAll('.skill-card-3d');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const filter = tab.dataset.filter;

                // Update active tab
                tabs.forEach(t => {
                    t.classList.remove('active');
                    t.setAttribute('aria-selected', 'false');
                });
                tab.classList.add('active');
                tab.setAttribute('aria-selected', 'true');

                // Filter cards with animation
                cards.forEach((card, i) => {
                    const category = card.dataset.category;
                    const show = filter === 'all' || category === filter;

                    if (show) {
                        card.classList.remove('hidden');
                        card.style.animation = 'none';
                        card.offsetHeight; // force reflow
                        card.style.animation = `cardReveal 0.5s ease-out ${i * 0.04}s both`;
                    } else {
                        card.classList.add('hidden');
                    }
                });
            });
        });
    }

    /* ── STAT COUNTER ANIMATION ── */
    function initStatCounters() {
        const stats = document.querySelectorAll('.stat-item');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.dataset.count);
                    const numEl = el.querySelector('.stat-number');
                    let current = 0;
                    const step = Math.max(1, Math.floor(target / 40));
                    const interval = setInterval(() => {
                        current += step;
                        if (current >= target) {
                            current = target;
                            clearInterval(interval);
                        }
                        numEl.textContent = current;
                    }, 40);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        stats.forEach(s => observer.observe(s));
    }

    /* ── RADAR CHART (Canvas) ── */
    function initRadarChart() {
        const canvas = document.getElementById('skillRadarCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const dpr = window.devicePixelRatio || 1;
        const displaySize = Math.min(500, window.innerWidth - 40);
        canvas.style.width = displaySize + 'px';
        canvas.style.height = displaySize + 'px';
        canvas.width = displaySize * dpr;
        canvas.height = displaySize * dpr;
        ctx.scale(dpr, dpr);

        const centerX = displaySize / 2;
        const centerY = displaySize / 2;
        const maxRadius = displaySize * 0.38;

        const categories = [
            { label: 'AI / ML', value: 0.90 },
            { label: 'Frontend', value: 0.85 },
            { label: 'Backend', value: 0.80 },
            { label: 'Cloud/DB', value: 0.75 },
            { label: 'Analytics', value: 0.80 },
            { label: 'DevOps', value: 0.77 },
        ];
        const sides = categories.length;
        const angleStep = (Math.PI * 2) / sides;

        let animProgress = 0;
        let animFrame;

        function drawChart(progress) {
            ctx.clearRect(0, 0, displaySize, displaySize);

            // Grid rings
            for (let ring = 1; ring <= 5; ring++) {
                const r = (ring / 5) * maxRadius;
                ctx.beginPath();
                for (let i = 0; i <= sides; i++) {
                    const angle = i * angleStep - Math.PI / 2;
                    const x = centerX + r * Math.cos(angle);
                    const y = centerY + r * Math.sin(angle);
                    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.strokeStyle = 'rgba(255, 0, 0, 0.08)';
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            // Axis lines
            for (let i = 0; i < sides; i++) {
                const angle = i * angleStep - Math.PI / 2;
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(centerX + maxRadius * Math.cos(angle), centerY + maxRadius * Math.sin(angle));
                ctx.strokeStyle = 'rgba(255, 0, 0, 0.1)';
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            // Data polygon
            ctx.beginPath();
            for (let i = 0; i <= sides; i++) {
                const idx = i % sides;
                const angle = idx * angleStep - Math.PI / 2;
                const r = maxRadius * categories[idx].value * progress;
                const x = centerX + r * Math.cos(angle);
                const y = centerY + r * Math.sin(angle);
                i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            }
            ctx.closePath();

            const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
            gradient.addColorStop(0, 'rgba(255, 0, 0, 0.25)');
            gradient.addColorStop(1, 'rgba(220, 20, 60, 0.08)');
            ctx.fillStyle = gradient;
            ctx.fill();
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.7)';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Data points & labels
            for (let i = 0; i < sides; i++) {
                const angle = i * angleStep - Math.PI / 2;
                const r = maxRadius * categories[i].value * progress;
                const x = centerX + r * Math.cos(angle);
                const y = centerY + r * Math.sin(angle);

                // Glow dot
                ctx.beginPath();
                ctx.arc(x, y, 5, 0, Math.PI * 2);
                ctx.fillStyle = '#ff0000';
                ctx.fill();
                ctx.beginPath();
                ctx.arc(x, y, 10, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
                ctx.fill();

                // Labels
                const labelR = maxRadius + 30;
                const lx = centerX + labelR * Math.cos(angle);
                const ly = centerY + labelR * Math.sin(angle);
                ctx.font = '600 13px Montserrat, sans-serif';
                ctx.fillStyle = '#ffffff';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(categories[i].label, lx, ly);

                // Percentage
                const pctR = maxRadius * categories[i].value * progress + 18;
                const px = centerX + pctR * Math.cos(angle);
                const py = centerY + pctR * Math.sin(angle);
                ctx.font = '700 11px Montserrat, sans-serif';
                ctx.fillStyle = 'rgba(255, 100, 100, 0.9)';
                ctx.fillText(Math.round(categories[i].value * 100 * progress) + '%', px, py);
            }

            // Center glow
            const cGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 30);
            cGrad.addColorStop(0, 'rgba(255, 0, 0, 0.15)');
            cGrad.addColorStop(1, 'rgba(255, 0, 0, 0)');
            ctx.beginPath();
            ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
            ctx.fillStyle = cGrad;
            ctx.fill();
        }

        function animateChart() {
            animProgress += 0.02;
            if (animProgress > 1) animProgress = 1;
            drawChart(animProgress);
            if (animProgress < 1) {
                animFrame = requestAnimationFrame(animateChart);
            }
        }

        // Start animation when visible
        const radarObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animProgress = 0;
                    animateChart();
                    radarObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        radarObserver.observe(canvas);
    }

    /* ── SCROLL REVEAL FOR CARDS ── */
    function initScrollReveal() {
        const cards = document.querySelectorAll('.skill-card-3d');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        cards.forEach(card => {
            card.style.animationPlayState = 'paused';
            observer.observe(card);
        });
    }

    /* ── INIT ALL ── */
    document.addEventListener('DOMContentLoaded', () => {
        initParticleBackground();
        initTiltCards();
        initRadialProgress();
        initFilterTabs();
        initStatCounters();
        initRadarChart();
        initScrollReveal();
    });
})();
