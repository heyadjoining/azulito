// Simple hash-based SPA router

class Router {
    constructor(pages) {
        this.pages = pages;
        this.contentContainer = document.getElementById('app-content');
        this.init();
    }

    init() {
        // Listen for hash changes
        window.addEventListener('hashchange', async () => {
            await this.handleRoute();
        });

        // Handle initial load immediately
        this.handleRoute();
    }

    async handleRoute() {
        // Get current hash (remove the #)
        let hash = window.location.hash.slice(1) || 'home';

        // Normalize route name
        hash = hash.toLowerCase();

        // Track if we're leaving home
        const currentPage = this.contentContainer.querySelector('main');
        const leavingHome = currentPage && currentPage.classList.contains('hero') && currentPage.classList.contains('content-wide') && hash !== 'home';
        const enteringHome = hash === 'home';

        let page;
        let routeType = 'page';

        // Check if it's a project detail route (e.g., project/groww)
        if (hash.startsWith('project/')) {
            const projectId = hash.split('/')[1];

            // Fetch project from JSON
            try {
                const response = await fetch('data/projects.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const projects = await response.json();
                const project = projects.find(p => p.id === projectId);
                page = createProjectDetailPage(project);
                routeType = 'project';
            } catch (error) {
                console.error('Error loading project:', error);
                page = createProjectDetailPage(null);
                routeType = 'project';
            }
        } else {
            // Check if page exists, fallback to 404 if mapped, else Home (or 404)
            if (this.pages[hash]) {
                page = this.pages[hash];
            } else if (hash === '') {
                // Empty hash -> Home
                page = this.pages.home;
            } else {
                // Unknown Route -> 404
                console.warn(`Route "${hash}" not found, serving 404.`);
                // Use a dedicated 404 page if available in window.pages (we need to ensure it's loaded in index.html)
                page = (typeof error404Page !== 'undefined') ? error404Page : this.pages.home;
            }
        }

        // Dispatch event before navigation (for hiding header/footer)
        window.dispatchEvent(new CustomEvent('pageNavigating', {
            detail: { isProjectPage: routeType === 'project' }
        }));

        // Reset scroll position to top
        window.scrollTo({ top: 0, behavior: 'instant' });

        // Update page title
        document.title = page.title;

        // Render page content with appropriate transition
        this.renderPage(page, leavingHome, enteringHome);

        // Update active nav state (only for regular pages, not projects)
        if (routeType === 'page') {
            this.updateNavigation(hash);
        } else {
            // For project pages, mark "work" as active
            this.updateNavigation('work');
        }
    }

    renderPage(page, leavingHome = false, enteringHome = false) {
        if (!this.contentContainer) {
            console.error('Content container #app-content not found');
            return;
        }

        // Apply exit animation
        if (leavingHome) {
            // Slide left and fade out
            this.contentContainer.style.opacity = '0';
            this.contentContainer.style.transform = 'translateX(-50px)';
        } else {
            // Regular fade out
            this.contentContainer.style.opacity = '0';
            this.contentContainer.style.transform = 'translateX(0)';
        }

        setTimeout(() => {
            // Update content
            this.contentContainer.innerHTML = page.render();

            // Reset transform for new page
            this.contentContainer.style.transform = 'translateX(0)';

            // Run page-specific onLoad function if it exists
            if (page.onLoad && typeof page.onLoad === 'function') {
                page.onLoad();
            }

            // Dispatch event after page content is loaded
            window.dispatchEvent(new CustomEvent('pageContentLoaded'));

            // Fade in
            requestAnimationFrame(() => {
                this.contentContainer.style.opacity = '1';

                // Add simple stagger animations for sections if not home
                if (!enteringHome) {
                    const sections = this.contentContainer.querySelectorAll('section, .page-title, .filters-container, .projects-grid');
                    sections.forEach((section, index) => {
                        section.style.opacity = '0';
                        section.style.transform = 'translateY(10px)';
                        section.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                        setTimeout(() => {
                            section.style.opacity = '1';
                            section.style.transform = 'translateY(0)';
                        }, 50 + (index * 50));
                    });
                }
            });
        }, 200);
    }

    updateNavigation(currentRoute) {
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to current route
        const activeLink = document.querySelector(`.nav-link[href="#${currentRoute}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        } else if (currentRoute === 'home') {
            // Handle home/hey link
            const homeLink = document.querySelector('.nav-link[href="#home"]') ||
                document.querySelector('.nav-link[href="#"]');
            if (homeLink) {
                homeLink.classList.add('active');
            }
        }
    }
}

// Initialize router when pages are available
window.addEventListener('DOMContentLoaded', () => {
    if (window.pages) {
        new Router(window.pages);
    }
});
