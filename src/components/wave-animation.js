// Wave Animation Configuration
const config = {
    width: 1200,
    height: 200,
    numWaves: 5,
    baseStrokeWidth: 2,
    maxStrokeWidth: 7,
    amplitude: 16,
    frequency: 0.03,
    speed: 0.5,
    // Strict Theme Colors (will be updated from CSS variables if possible, but defaults here)
    paperColor: '#FAF8F5',
    blueColor: '#2563EB',
    topPadding: 100,
    strokeVariation: 0.2,
    glowRadius: 10, // Matching 16px cursor (8px radius + minimal bleed)
};

// Initialize wave animation
function initWaveAnimation() {
    const svg = document.getElementById('wave-svg');
    const cursorFollower = document.getElementById('cursor-follower');

    if (!svg) {
        console.error('Wave SVG not found');
        return;
    }

    // Clear existing content
    while (svg.firstChild) {
        svg.removeChild(svg.firstChild);
    }

    const waves = [];
    let animationTime = 0;

    // Global Mouse Tracking
    let mouseX = -100; // Start off-screen
    let mouseY = -100;
    let svgMouseX = -100;
    let svgMouseY = -100;

    // --- 1. Base Layer Group (Blue Waves on Paper) ---
    const baseGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    baseGroup.setAttribute('class', 'base-waves');

    // --- 2. Spotlight Layer Group (White Waves on Blue BG) ---
    const spotlightGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    spotlightGroup.setAttribute('class', 'spotlight-layer');

    // Define the Mask
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const mask = document.createElementNS('http://www.w3.org/2000/svg', 'mask');
    mask.setAttribute('id', 'spotlightMask');

    const maskCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    maskCircle.setAttribute('cx', '0');
    maskCircle.setAttribute('cy', '0');
    maskCircle.setAttribute('r', config.glowRadius);
    maskCircle.setAttribute('fill', 'white');
    mask.appendChild(maskCircle);
    defs.appendChild(mask);
    svg.appendChild(defs);

    spotlightGroup.setAttribute('mask', 'url(#spotlightMask)');

    // Spotlight Background
    // Spotlight Background (REMOVED - using global CSS cursor as background)
    // const spotlightBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    // spotlightBg.setAttribute('width', '100%');
    // spotlightBg.setAttribute('height', '100%');
    // spotlightBg.setAttribute('fill', config.blueColor);
    // spotlightGroup.appendChild(spotlightBg);

    // Spotlight Waves
    const spotlightWavesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    spotlightGroup.appendChild(spotlightWavesGroup);

    svg.appendChild(baseGroup);
    svg.appendChild(spotlightGroup);

    // Initialize Waves
    for (let i = 0; i < config.numWaves; i++) {
        const normalizedPos = i / (config.numWaves - 1);
        const depthCurve = Math.sin(normalizedPos * Math.PI);
        const baseStrokeWidth = config.baseStrokeWidth + (depthCurve * (config.maxStrokeWidth - config.baseStrokeWidth));

        // Base Wave (Theme Color)
        const baseWavePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        baseWavePath.setAttribute('stroke', 'var(--blue)');
        baseWavePath.setAttribute('stroke-width', baseStrokeWidth);
        baseWavePath.setAttribute('fill', 'none');
        baseWavePath.setAttribute('stroke-linecap', 'round');
        baseWavePath.setAttribute('stroke-linejoin', 'round');
        baseWavePath.setAttribute('opacity', '1');
        baseGroup.appendChild(baseWavePath);

        // Spotlight Wave (Paper/White-ish)
        const spotlightWavePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        spotlightWavePath.setAttribute('stroke', 'var(--paper)');
        spotlightWavePath.setAttribute('stroke-width', baseStrokeWidth);
        spotlightWavePath.setAttribute('fill', 'none');
        spotlightWavePath.setAttribute('stroke-linecap', 'round');
        spotlightWavePath.setAttribute('stroke-linejoin', 'round');
        spotlightWavePath.setAttribute('opacity', '1');
        spotlightWavesGroup.appendChild(spotlightWavePath);

        const randomOffset = (Math.random() - 0.5) * 20;

        const speedVariation = Math.random();
        let waveSpeed = (speedVariation < 0.3) ? 0.2 : (speedVariation < 0.7 ? 0.4 : 0.7);

        waves.push({
            paths: [baseWavePath, spotlightWavePath],
            yOffset: config.topPadding + (i / config.numWaves) * (config.height - config.topPadding) + randomOffset,
            phase: i * 0.5 + (Math.random() * Math.PI),
            speed: waveSpeed,
            amplitude: config.amplitude * (0.8 + Math.random() * 0.4),
            frequency: config.frequency * (0.8 + Math.random() * 0.4),
            baseWidth: baseStrokeWidth,
            widthPhase: Math.random() * Math.PI * 2,
            widthFreq: 1.5 + Math.random() * 2.5
        });
    }

    function generateWavePath(wave, time) {
        const points = [];
        const resolution = 40;

        let avgWidth = 0;
        for (let i = 0; i <= resolution; i++) {
            const progress = i / resolution;
            const widthVar = Math.sin((progress * Math.PI * wave.widthFreq) + wave.widthPhase + time * wave.speed * 0.25);
            const widthMod = 1 + (widthVar * 0.5) * config.strokeVariation;
            avgWidth += wave.baseWidth * widthMod;
        }
        avgWidth /= (resolution + 1);

        wave.paths.forEach(p => p.setAttribute('stroke-width', avgWidth));

        for (let i = 0; i <= resolution; i++) {
            const x = (i / resolution) * config.width;
            const progress = i / resolution;

            // Mouse Influence (Hill Effect)
            const amplitudeMod = Math.sin(time * wave.speed * 1.2 + wave.phase) * 0.5 + 1;
            let currentAmplitude = wave.amplitude * amplitudeMod;

            if (svgMouseX >= 0) {
                const distanceToMouse = Math.abs(x - svgMouseX);
                const influenceRadius = 200;
                const influence = Math.max(0, 1 - (distanceToMouse / influenceRadius));

                if (influence > 0) {
                    const pullStrength = 30;
                    const verticalDistance = Math.abs(wave.yOffset - svgMouseY);
                    const verticalInfluence = Math.max(0, 1 - (verticalDistance / 100));
                    currentAmplitude += influence * pullStrength * verticalInfluence;
                }
            }

            const wave1 = Math.sin((progress * Math.PI * 3.5) + (time * wave.speed) + wave.phase) * currentAmplitude;
            const wave2 = Math.sin((progress * Math.PI * 1.8) + (time * wave.speed * 0.55) + wave.phase) * (currentAmplitude * 0.45);

            const y = wave.yOffset + wave1 + wave2;
            points.push(`${x},${y}`);
        }

        let pathString = `M ${points[0]}`;
        for (let i = 1; i < points.length - 1; i++) {
            const [x1, y1] = points[i].split(',').map(Number);
            const [x2, y2] = points[i + 1].split(',').map(Number);
            const cpx = (x1 + x2) / 2;
            pathString += ` Q ${x1},${y1} ${cpx},${(y1 + y2) / 2}`;
        }
        pathString += ` L ${points[points.length - 1]}`;

        return pathString;
    }

    function animate() {
        animationTime += 0.02;

        // Use Global Cursor Position if available, else fallback
        if (window.GlobalCursor) {
            mouseX = window.GlobalCursor.x;
            mouseY = window.GlobalCursor.y;
        }

        // Update Spotlight Geometry
        const svgRect = svg.getBoundingClientRect();
        const scaleX = config.width / svgRect.width;
        const scaleY = config.height / svgRect.height;

        // Calculate SVG-relative mouse position
        svgMouseX = (mouseX - svgRect.left) * scaleX;
        svgMouseY = (mouseY - svgRect.top) * scaleY;

        // Update mask circle (Spotlight)
        maskCircle.setAttribute('cx', svgMouseX);
        maskCircle.setAttribute('cy', svgMouseY);

        waves.forEach(wave => {
            const pathString = generateWavePath(wave, animationTime);
            wave.paths.forEach(p => p.setAttribute('d', pathString));
        });

        requestAnimationFrame(animate);
    }

    animate();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWaveAnimation);
} else {
    initWaveAnimation();
}
