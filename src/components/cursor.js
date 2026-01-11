
// Global Cursor Manager
window.GlobalCursor = {
    x: -100,
    y: -100,
    isHovering: false
};

const CursorManager = {
    init: () => {
        const cursorFollower = document.getElementById('cursor-follower');

        if (!cursorFollower) return;

        // Efficient Hover Color Check (Event Delegation)
        // Check computed color of element under mouse
        // Update Global State & Color Check on Mouse Move
        document.addEventListener('mousemove', (e) => {
            // 1. Update Coordinates
            window.GlobalCursor.x = e.clientX;
            window.GlobalCursor.y = e.clientY;
            window.GlobalCursor.isHovering = true;

            // 2. Color Detection (White Cursor over Blue Content)
            // Use elementFromPoint to handle continuous movement accurately
            const target = document.elementFromPoint(e.clientX, e.clientY);

            if (!target) return;

            let isBlue = false;

            // Check computed style
            const style = window.getComputedStyle(target);
            const color = style.getPropertyValue('color');
            const bg = style.getPropertyValue('background-color');
            const stroke = style.getPropertyValue('stroke');

            // Helper to detect blue (approx matching #2563EB or rgb(37, 99, 235))
            const isBlueColor = (c) => {
                if (!c) return false;
                return c.includes('37, 99, 235') || c.includes('#2563EB') || c.includes('rgb(37, 99, 235)');
            };

            if (isBlueColor(color) || isBlueColor(bg) || isBlueColor(stroke)) {
                isBlue = true;
            }

            // Special case for Wave Paths (SVG), Shapes, and Buttons
            // Walk up the tree to find buttons (more reliable than closest in some cases)
            let el = target;
            while (el && el !== document.body) {
                if (el.classList && (
                    el.classList.contains('btn-base') ||
                    el.classList.contains('nav-link') ||
                    el.classList.contains('filter-pill') ||
                    el.classList.contains('wave-path') ||
                    el.classList.contains('shape') ||
                    el.tagName === 'path'
                )) {
                    isBlue = true;
                    break;
                }
                el = el.parentElement;
            }

            // Additional direct checks
            if (target.classList.contains('wave-path') ||
                target.tagName === 'path' ||
                target.classList.contains('shape')) {
                isBlue = true;
            }

            // Apply State
            if (isBlue) {
                cursorFollower.classList.add('cursor-white');
            } else {
                cursorFollower.classList.remove('cursor-white');
            }
        });

        // Animation Loop using RAF for smooth movement
        function animate() {
            if (window.GlobalCursor.isHovering) {
                const { x, y } = window.GlobalCursor;
                cursorFollower.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
            }
            requestAnimationFrame(animate);
        }

        // Start Loop
        animate();
    }
};

// Auto-init logic matching other components
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', CursorManager.init);
} else {
    CursorManager.init();
}
