// Loading Screen Animation
(() => {
    const loaderScreen = document.querySelector('.loader-screen');
    const loaderCounter = document.querySelector('.loader-counter');
    const loaderProgress = document.querySelector('.loader-progress');

    if (!loaderScreen || !loaderCounter) return;

    // Check if loading screen was shown recently (within 30 minutes)
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    function setCookie(name, value, minutes) {
        const date = new Date();
        date.setTime(date.getTime() + (minutes * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value};${expires};path=/`;
    }

    const hasSeenLoader = getCookie('hasSeenLoader');

    if (hasSeenLoader === 'true') {
        // Skip animation - hide immediately and remove
        loaderScreen.style.display = 'none';
        loaderScreen.remove();
        return;
    }

    // Start counting immediately (fake progress)
    let count = 0;
    let pageLoaded = false;
    const slowDuration = 4000; // 4 seconds to reach 90%
    const slowIncrement = 90 / (slowDuration / 16); // Count to 90% slowly

    const counterInterval = setInterval(() => {
        if (!pageLoaded) {
            // Slow progress to 90%
            count += slowIncrement;
            if (count >= 90) {
                count = 90; // Cap at 90% until page loads
            }
        } else {
            // Fast progress to 100% once page loads
            count += 5; // Rush to 100%

            if (count >= 100) {
                count = 100;
                clearInterval(counterInterval);

                // Set cookie to remember for 30 minutes
                setCookie('hasSeenLoader', 'true', 30);

                // Wait a moment at 100%, then slide up
                setTimeout(() => {
                    loaderScreen.classList.add('loaded');

                    // Remove from DOM after animation completes
                    setTimeout(() => {
                        loaderScreen.remove();
                    }, 1000);
                }, 300);
            }
        }

        loaderCounter.textContent = Math.floor(count) + '%';
        if (loaderProgress) {
            loaderProgress.style.width = count + '%';
        }
    }, 16);

    // When page actually loads, rush to 100%
    window.addEventListener('load', () => {
        pageLoaded = true;
    });
})();
