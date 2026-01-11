// Navigation Component
document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Hamburger Menu ---
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const mobileNav = document.querySelector('.mobile-nav');

    if (hamburgerBtn && mobileNav) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('active');
            mobileNav.classList.toggle('active');
            hamburgerBtn.setAttribute('aria-expanded',
                hamburgerBtn.classList.contains('active'));
        });

        // Close menu when clicking a link
        mobileNav.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburgerBtn.classList.remove('active');
                mobileNav.classList.remove('active');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
            });
        });

        // Mobile Chat button - close menu on click (navigation handled by href)
        const mobileChatBtn = document.querySelector('.mobile-chat-btn');
        if (mobileChatBtn) {
            mobileChatBtn.addEventListener('click', () => {
                hamburgerBtn.classList.remove('active');
                mobileNav.classList.remove('active');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
            });
        }

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburgerBtn.contains(e.target) && !mobileNav.contains(e.target)) {
                hamburgerBtn.classList.remove('active');
                mobileNav.classList.remove('active');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // --- Scroll-based Header Logic ---
    const header = document.querySelector('.header');

    if (header) {
        let lastScrollY = window.scrollY;
        let lastDirectionChangeY = window.scrollY;
        let lastDirection = 0;
        let ticking = false;
        const hoverZoneHeader = 80;
        const scrollThresholdShow = 100;
        const scrollThresholdHide = 20;

        // Detect mobile/touch device
        const isMobile = () => window.innerWidth <= 768;

        // Hover state tracking
        let headerHovering = false;
        let headerHideTimeout = null;
        const hoverHideDelay = 600;

        // Navigation state - prevents flash when navigating to project pages
        let navigatingToProject = false;

        // Check if on project detail page
        function isProjectDetailPage() {
            return document.querySelector('.project-detail') !== null;
        }

        // Listen for navigation start
        window.addEventListener('pageNavigating', (e) => {
            if (e.detail.isProjectPage) {
                navigatingToProject = true;
                header.classList.add('header-hidden');
            }
        });

        function showHeader() {
            header.classList.remove('header-hidden');
        }

        function hideHeader() {
            header.classList.add('header-hidden');
        }

        function updateHeader() {
            const mobile = isMobile();

            // On mobile, always show header (no hide behavior except on project pages)
            if (mobile && !isProjectDetailPage() && !navigatingToProject) {
                showHeader();
                ticking = false;
                return;
            }

            // On project detail pages or navigating to one
            if (isProjectDetailPage() || navigatingToProject) {
                // On mobile project pages, show on scroll up, hide on scroll down
                if (mobile) {
                    const currentScrollY = window.scrollY;
                    const scrollDelta = currentScrollY - lastScrollY;
                    if (scrollDelta < -10) {
                        showHeader();
                    } else if (scrollDelta > 10) {
                        hideHeader();
                    }
                    lastScrollY = currentScrollY;
                } else {
                    if (!headerHovering) hideHeader();
                }
                ticking = false;
                return;
            }

            const currentScrollY = window.scrollY;
            const scrollDelta = currentScrollY - lastScrollY;
            const halfViewport = window.innerHeight * 0.5;

            // Detect direction change
            const currentDirection = scrollDelta > 0 ? 1 : scrollDelta < 0 ? -1 : 0;
            if (currentDirection !== 0 && currentDirection !== lastDirection) {
                lastDirectionChangeY = lastScrollY;
                lastDirection = currentDirection;
            }

            const scrollSinceDirectionChange = Math.abs(currentScrollY - lastDirectionChangeY);

            // Above the fold - show
            if (currentScrollY < halfViewport) {
                showHeader();
            }
            // Past the fold - hide/show based on scroll direction + distance
            else if (scrollDelta > 5 && scrollSinceDirectionChange > scrollThresholdHide) {
                if (!headerHovering) hideHeader();
            } else if (scrollDelta < -5 && scrollSinceDirectionChange > scrollThresholdShow) {
                showHeader();
            }

            lastScrollY = currentScrollY;
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        }, { passive: true });

        // Hover near edges to reveal (desktop only - no hover on touch)
        document.addEventListener('mousemove', (e) => {
            // Skip hover logic on mobile
            if (isMobile()) return;

            const mouseY = e.clientY;
            const windowHeight = window.innerHeight;
            const onProjectPage = isProjectDetailPage();

            // Near top - show header
            if (mouseY < hoverZoneHeader) {
                headerHovering = true;
                clearTimeout(headerHideTimeout);
                header.classList.remove('header-hidden');
            } else if (headerHovering) {
                headerHovering = false;
                headerHideTimeout = setTimeout(() => {
                    // Hide if on project page OR scrolled past fold
                    if (onProjectPage || window.scrollY > windowHeight * 0.5) {
                        header.classList.add('header-hidden');
                    }
                }, hoverHideDelay);
            }
        }, { passive: true });

        // Handle page content loaded
        window.addEventListener('pageContentLoaded', () => {
            // Reset navigation flag
            navigatingToProject = false;

            if (isProjectDetailPage()) {
                hideHeader();
            } else {
                // On other pages, reset scroll tracking and show if at top
                lastScrollY = window.scrollY;
                lastDirectionChangeY = window.scrollY;
                if (window.scrollY < window.innerHeight * 0.5) {
                    showHeader();
                }
            }
        });
    }
});
