// Home Page
const homePage = {
    title: 'Azulito - Product & Branding Design',
    render: () => `
        <main class="hero content-wide">

            <!-- Center: 3D Shapes -->
            <div class="shapes">
                <div class="shape shape-1" data-speed="0.15" style="-webkit-mask-image: url(img/shape_00.svg); mask-image: url(img/shape_00.svg);"></div>
                <div class="shape shape-2" data-speed="0.25" style="-webkit-mask-image: url(img/shape_01.svg); mask-image: url(img/shape_01.svg);"></div>
                <div class="shape shape-3" data-speed="0.20" style="-webkit-mask-image: url(img/shape_02.svg); mask-image: url(img/shape_02.svg);"></div>
                <div class="shape shape-4" data-speed="0.30" style="-webkit-mask-image: url(img/shape_03.svg); mask-image: url(img/shape_03.svg);"></div>
            </div>

            <!-- Hero Content Wrapper (hidden until shapes load) -->
            <div class="hero-content" style="opacity: 0; transition: opacity 0.5s ease;">
                <!-- Top Left: Tagline -->
                <div class="hero-greeting">
                    <span class="greeting-text">We design with <span class="font-display-inline">flow</span> and <span class="font-display-inline">clarity</span></span>
                </div>

                <!-- Top Right: Azulito | Studio -->
                <div class="hero-brand">
                    <div class="brand-text">AZULITO | CREATIVE STUDIO</div>
                    <a class="btn-base" href="#work">
                        <span class="btn-text">
                            <span class="btn-text-inner">
                                <span>View Work</span>
                                <span>View Work</span>
                            </span>
                        </span>
                    </a>
                </div>

                <!-- Center-Left: Dictionary Definition -->
                <div class="hero-definition">
                    <div class="definition-title">
                        <div class="definition-word">a·zu·li·to</div>
                        <div class="definition-pronunciation">/aθuˈlito/</div>
                        <div class="definition-type">noun</div>
                    </div>
                    <div class="definition-type">Origin: Spanish / "little blue one"</div>
                    <div class="definition-text">A term of endearment for something small and blue. Evokes calm waters, clear skies, and the serene depths of the ocean.</div>
                </div>

                <!-- Bottom Right: Description -->
                <div class="hero-description">
                    <p>Smooth, flowing design that brings harmony to your brand. Like water finding its path.</p>
                </div>
            </div>

        </main>
    `,
    onLoad: () => {
        // Combined rotation + parallax effect for shapes
        const hero = document.querySelector('.hero');
        const shapes = document.querySelectorAll('.shape');
        const heroContent = document.querySelector('.hero-content');

        if (!hero || shapes.length === 0) return;

        // Wait for all shapes to load before showing hero content
        let loadedCount = 0;
        const totalShapes = shapes.length;

        function checkAllLoaded() {
            loadedCount++;
            if (loadedCount >= totalShapes && heroContent) {
                heroContent.style.opacity = '1';
            }
        }

        shapes.forEach(shape => {
            if (shape.complete) {
                checkAllLoaded();
            } else {
                shape.addEventListener('load', checkAllLoaded);
                shape.addEventListener('error', checkAllLoaded);
            }
        });

        // Shape animation data
        const shapeData = [];
        const rotationSpeeds = [0.6, -0.8, 0.9, -0.7, 0.85];

        shapes.forEach((shape, index) => {
            shapeData.push({
                element: shape,
                rotation: Math.random() * 360,
                rotationSpeed: rotationSpeeds[index] || 0.8,
                speed: parseFloat(shape.dataset.speed) || 0.25,
                currentX: 0,
                currentY: 0,
                targetX: 0,
                targetY: 0
            });
        });

        // Parallax hover handling
        let mouseX = 0;
        let mouseY = 0;

        // Use document for mouse events so header doesn't block interaction
        document.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();

            // Only respond if mouse is within the hero's vertical bounds
            const isWithinHeroArea = e.clientY >= rect.top && e.clientY <= rect.bottom;

            if (!isWithinHeroArea) {
                // Reset when outside hero area
                shapeData.forEach(data => {
                    data.targetX = 0;
                    data.targetY = 0;
                });
                return;
            }

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            mouseX = e.clientX - rect.left - centerX;
            mouseY = e.clientY - rect.top - centerY;

            // Update Targets - increased from 12px to 40px for stronger parallax
            shapeData.forEach(data => {
                const moveX = Math.max(-40, Math.min(40, (mouseX / centerX) * 40 * data.speed));
                const moveY = Math.max(-40, Math.min(40, (mouseY / centerY) * 40 * data.speed));
                data.targetX = moveX;
                data.targetY = moveY;
            });
        });

        // Animation loop
        let animationId = null;
        const LERP_FACTOR = 0.16;

        function animate() {
            shapeData.forEach(data => {
                data.rotation += data.rotationSpeed;
                data.currentX += (data.targetX - data.currentX) * LERP_FACTOR;
                data.currentY += (data.targetY - data.currentY) * LERP_FACTOR;

                const transform = `translate3d(${data.currentX}px, ${data.currentY}px, 0) rotate(${data.rotation}deg)`;

                // Apply transform
                data.element.style.transform = transform;
            });

            animationId = requestAnimationFrame(animate);
        }

        // Start animation
        animationId = requestAnimationFrame(animate);

        // Pause/resume when tab visibility changes to save cycles
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            } else if (!document.hidden && !animationId) {
                animationId = requestAnimationFrame(animate);
            }
        });

        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        });
    }
};
