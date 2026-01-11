// Book a Call Modal Logic
document.addEventListener('DOMContentLoaded', () => {
    const bookCallBtn = document.querySelector('.book-call-btn');
    const calendlyModal = document.querySelector('.calendly-modal');
    const bookCallWrapper = document.querySelector('.book-call-wrapper');
    const modalClose = document.querySelector('.modal-close');

    if (!bookCallBtn || !calendlyModal || !modalClose) return;

    // Open modal
    bookCallBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        calendlyModal.classList.add('active');
    });

    // Close modal with button
    modalClose.addEventListener('click', (e) => {
        e.stopPropagation();
        calendlyModal.classList.remove('active');
    });

    // Close modal when clicking outside
    document.addEventListener('click', (e) => {
        if (!bookCallWrapper.contains(e.target)) {
            calendlyModal.classList.remove('active');
        }
    });

    // Keep modal open when hovering
    calendlyModal.addEventListener('mouseenter', () => {
        calendlyModal.classList.add('active');
    });
});



// Hover Sound Effect for Button/Nav Animations
document.addEventListener('DOMContentLoaded', () => {
    // Preload the click sound
    const hoverSound = new Audio('click.wav');
    hoverSound.volume = 0.15; // Adjust volume (0.0 to 1.0)
    hoverSound.preload = 'auto';

    let audioUnlocked = false;

    // Unlock audio on first user interaction (required by browser autoplay policies)
    function unlockAudio() {
        if (!audioUnlocked) {
            hoverSound.play().then(() => {
                hoverSound.pause();
                hoverSound.currentTime = 0;
                audioUnlocked = true;
            }).catch(() => {
                // Try again on next interaction
            });
        }
    }

    // Try to unlock audio on any user interaction
    document.addEventListener('click', unlockAudio, { once: true });
    document.addEventListener('touchstart', unlockAudio, { once: true });
    document.addEventListener('keydown', unlockAudio, { once: true });

    // Function to play sound
    function playHoverSound() {
        if (!audioUnlocked) return; // Don't try to play if not unlocked yet

        // Clone and play to allow rapid repeated plays
        const sound = hoverSound.cloneNode();
        sound.volume = 0.15;
        sound.play().catch(() => {
            // Silently fail if still blocked
        });
    }

    // Add hover sound to navigation links and buttons (except footer/close/filters/project buttons)
    function addHoverSounds() {
        const navLinks = document.querySelectorAll('.nav-link');
        const buttons = document.querySelectorAll('.btn-base');

        navLinks.forEach(link => {
            link.addEventListener('mouseenter', playHoverSound);
        });

        buttons.forEach(button => {
            // Exclude: modal close, filter pills, project buttons, and more button
            const isExcluded =
                button.classList.contains('modal-close') ||
                button.classList.contains('filter-pill') ||
                button.classList.contains('project-btn') ||
                button.classList.contains('more-button');

            if (!isExcluded) {
                button.addEventListener('mouseenter', playHoverSound);
            }
        });
    }

    // Initial setup
    addHoverSounds();

    // Re-add sounds when page content is loaded (for SPA navigation)
    window.addEventListener('pageContentLoaded', () => {
        addHoverSounds();
    });
});
