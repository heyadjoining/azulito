// Work Page
const workPage = {
    title: 'Work - Azulito',
    render: () => `
        <main class="work-main content-wide">
            
            <h1 class="page-title">
                <div class="hero-greeting">
                    <span class="greeting-text">Clear <span class="font-display-inline">voice</span>, zero <span class="font-display-inline">filler</span>. 
                </div>
            </h1>

            <!-- Filter Pills -->
            <div class="filters-container">
                <div class="filter-group">
                    <button class="btn-base filter-pill active" data-filter="all">
                        <span class="btn-text">
                            <span class="btn-text-inner">
                                <span>All</span>
                                <span>All</span>
                            </span>
                        </span>
                    </button>
                    <button class="btn-base filter-pill" data-filter="branding">
                        <span class="btn-text">
                            <span class="btn-text-inner">
                                <span>Branding</span>
                                <span>Branding</span>
                            </span>
                        </span>
                    </button>
                    <button class="btn-base filter-pill" data-filter="web">
                         <span class="btn-text">
                            <span class="btn-text-inner">
                                <span>Web</span>
                                <span>Web</span>
                            </span>
                        </span>
                    </button>
                    <button class="btn-base filter-pill" data-filter="uiux">
                         <span class="btn-text">
                            <span class="btn-text-inner">
                                <span>UI/UX</span>
                                <span>UI/UX</span>
                            </span>
                        </span>
                    </button>
                    <button class="btn-base filter-pill" data-filter="social">
                         <span class="btn-text">
                            <span class="btn-text-inner">
                                <span>Social Media</span>
                                <span>Social Media</span>
                            </span>
                        </span>
                    </button>
                </div>
            </div>

            <!-- Projects Grid -->
            <div class="projects-grid"></div>

            <!-- Load More Button -->
            <div class="load-more-container">
                <button class="btn-base more-button" aria-label="Load more projects">
                    <span class="btn-text">
                        <span class="btn-text-inner">
                            <span>More</span>
                            <span>More</span>
                        </span>
                    </span>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-left: 8px;">
                        <path d="M8 1V15M1 8H15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                </button>
            </div>

            <!-- Testimonials Section -->
            <section class="testimonials-section">
                <h2 class="section-title">Feedback</h2>

                <div class="testimonials-carousel-wrapper">
                    <div class="testimonials-carousel"></div>
                </div>

                <!-- CTA -->
                <div class="work-cta">
                    <a href="#chat" class="btn-base cta-button">
                        <span class="btn-text">
                            <span class="btn-text-inner">
                                <span>Let's work together</span>
                                <span>Let's work together</span>
                            </span>
                        </span>
                    </a>
                </div>
            </section>
        </main>
    `,
    onLoad: () => {
        // Projects Data - Placeholder projects
        const projectsData = [
            {
                order: 1,
                title: "Lumina Analytics",
                image: "data/projects/placeholder1/cover.webp",
                industry: "ai",
                skills: ["uiux", "branding"],
                buttonText: "View Project",
                projectId: "placeholder1"
            },
            {
                order: 2,
                title: "Aethel & Co.",
                image: "data/projects/placeholder2/cover.webp",
                industry: "retail",
                skills: ["branding", "social"],
                buttonText: "View Project",
                projectId: "placeholder2"
            },
            {
                order: 3,
                title: "Finova Banking",
                image: "data/projects/placeholder3/cover.webp",
                industry: "fintech",
                skills: ["uiux", "web"],
                buttonText: "View Project",
                projectId: "placeholder3"
            },
            {
                order: 4,
                title: "FlowState SaaS",
                image: "data/projects/placeholder4/cover.webp",
                industry: "productivity",
                skills: ["uiux", "web"],
                buttonText: "View Project",
                projectId: "placeholder4"
            },
            {
                order: 5,
                title: "Blue & Beige Co.",
                image: "data/projects/placeholder5/cover.webp",
                industry: "retail",
                skills: ["branding", "social"],
                buttonText: "View Project",
                projectId: "placeholder5"
            },
            {
                order: 6,
                title: "Cerulean Café",
                image: "data/projects/placeholder6/cover.webp",
                industry: "hospitality",
                skills: ["branding", "uiux"],
                buttonText: "View Project",
                projectId: "placeholder6"
            },
            {
                order: 7,
                title: "Aura Athletics",
                image: "data/projects/placeholder7/cover.webp",
                industry: "retail",
                skills: ["uiux", "web"],
                buttonText: "View Project",
                projectId: "placeholder7"
            },
            {
                order: 8,
                title: "Nexus Analytics",
                image: "data/projects/placeholder8/cover.webp",
                industry: "ai",
                skills: ["uiux", "web"],
                buttonText: "View Project",
                projectId: "placeholder8"
            },
            {
                order: 9,
                title: "Apex Brandbook",
                image: "data/projects/placeholder9/cover.webp",
                industry: "agency",
                skills: ["branding", "uiux"],
                buttonText: "View Project",
                projectId: "placeholder9"
            }
        ].sort((a, b) => a.order - b.order); // Sort by order property

        // Filter labels mapping
        const filterLabels = {
            branding: "Branding",
            web: "Web",
            uiux: "UI/UX",
            social: "Social Media"
        };

        // Current filter and pagination
        let currentFilter = 'all';
        let projectsPerLoad = 6; // 2 rows × 3 columns
        let currentlyShowing = 6; // Show 2 rows initially

        // Lazy load images with Intersection Observer
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');

                        // Remove lazy-load class once image is loaded
                        img.addEventListener('load', () => {
                            img.classList.remove('lazy-load');
                        });

                        observer.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '50px'
        });

        // Ensure we're on the work page (avoid running on other routes)
        const workRoot = document.querySelector('.work-main');
        if (!workRoot) return;

        // Helper: reveal only when in viewport via Intersection Observer
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up--visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -50px 0px', threshold: 0.15 });

        const isInViewport = (el) => {
            const rect = el.getBoundingClientRect();
            return (
                rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
                rect.bottom > 0
            );
        };

        function observeReveal(el) {
            if (!el) return;
            el.classList.add('fade-in-up');
            // If already in view (e.g., initial load), mark visible immediately
            if (isInViewport(el)) {
                el.classList.add('fade-in-up--visible');
            } else {
                revealObserver.observe(el);
            }
        }

        // Render projects
        function renderProjects(append = false) {
            const grid = document.querySelector('.projects-grid');
            const loadMoreBtn = document.querySelector('.more-button');

            if (!append) {
                grid.innerHTML = '';
                currentlyShowing = 6; // Reset to 2 rows (6 items)
            }

            const filteredProjects = projectsData.filter(project => {
                return currentFilter === 'all' || project.skills.includes(currentFilter);
            });

            const projectsToShow = filteredProjects.slice(0, currentlyShowing);
            const startIndex = append ? currentlyShowing - projectsPerLoad : 0;

            projectsToShow.slice(startIndex).forEach((project, index) => {
                const card = document.createElement('div');
                card.className = 'project-card';

                // Add fade-out class starting from 3rd row (indices 6+)
                const absoluteIndex = startIndex + index;
                if (!append && absoluteIndex >= 6 && currentlyShowing === 9) {
                    card.classList.add('project-card-fade');
                }

                // Reveal animation
                observeReveal(card);

                const tags = project.skills.map(s => filterLabels[s]);
                const tagsHTML = tags.map(tag => `<span class="project-tag">${tag}</span>`).join('');

                // Make entire card clickable if projectId exists
                if (project.projectId) {
                    card.innerHTML = `
                        <a href="#project/${project.projectId}" class="project-card-link">
                            <div class="project-image">
                                <img data-src="${project.image}" alt="${project.title}" class="lazy-load" loading="lazy" decoding="async">
                            </div>
                            <div class="project-info">
                                <div class="project-tags">${tagsHTML}</div>
                                <span class="btn-base project-btn">
                                    <span class="btn-text">
                                        <span class="btn-text-inner">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                <circle cx="12" cy="12" r="3"></circle>
                                            </svg>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                <circle cx="12" cy="12" r="3"></circle>
                                            </svg>
                                        </span>
                                    </span>
                                </span>
                            </div>
                            
                        </a>
                    `;
                } else {
                    card.innerHTML = `
                        <div class="project-image">
                            <img data-src="${project.image}" alt="${project.title}" class="lazy-load" loading="lazy" decoding="async">
                        </div>
                        <div class="project-info">
                            <div class="project-tags">${tagsHTML}</div>
                            <span class="btn-base project-btn">
                                <span class="btn-text">
                                    <span class="btn-text-inner">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                    </span>
                                </span>
                            </span>
                        </div>
                    `;
                }

                grid.appendChild(card);

                // Observe lazy-load images
                const img = card.querySelector('.lazy-load');
                if (img) {
                    imageObserver.observe(img);
                }
            });

            // Show/hide load more button
            if (loadMoreBtn) {
                if (currentlyShowing >= filteredProjects.length) {
                    loadMoreBtn.style.display = 'none';
                } else {
                    loadMoreBtn.style.display = 'inline-flex';
                }
            }
        }

        // Load more functionality
        function loadMoreProjects() {
            // Remove fade class from previously faded cards
            document.querySelectorAll('.project-card-fade').forEach(card => {
                card.classList.remove('project-card-fade');
            });

            currentlyShowing += projectsPerLoad;
            renderProjects(true);
        }

        // Filter functionality
        document.querySelectorAll('.filter-pill').forEach(pill => {
            pill.addEventListener('click', function () {
                const filter = this.dataset.filter;

                document.querySelectorAll('.filter-pill').forEach(p => {
                    p.classList.remove('active');
                });
                this.classList.add('active');

                currentFilter = filter;
                currentlyShowing = 6; // Reset to show 2 rows on filter change
                renderProjects(false);
            });
        });

        // Load more button
        const loadMoreBtn = document.querySelector('.more-button');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', loadMoreProjects);
            observeReveal(loadMoreBtn);
        }

        // Initial render
        renderProjects();

        // Reveal other sections (only if present in viewport)
        observeReveal(document.querySelector('.filters-container'));
        observeReveal(document.querySelector('.load-more-container'));
        observeReveal(document.querySelector('.testimonials-section'));
        observeReveal(document.querySelector('.work-cta'));

        // Load and render testimonials from JSON
        fetch('data/testimonials.json')
            .then(response => response.json())
            .then(testimonialsData => {
                const carousel = document.querySelector('.testimonials-carousel');
                if (carousel) {
                    carousel.innerHTML = '';

                    function createTestimonialCard(testimonial) {
                        return `
                            <div class="testimonial-card">
                                <div class="testimonial-header">
                                    <div class="testimonial-avatar">
                                        <img src="${testimonial.avatar}" alt="${testimonial.name}">
                                    </div>
                                    <div class="testimonial-info">
                                        <div class="testimonial-name">${testimonial.name}</div>
                                        <div class="testimonial-credential">${testimonial.title}</div>
                                    </div>
                                </div>
                                <p class="testimonial-text">${testimonial.text}</p>
                            </div>
                        `;
                    }

                    // Only duplicate once for smoother performance
                    const repeatedTestimonials = [...testimonialsData, ...testimonialsData];
                    repeatedTestimonials.forEach(testimonial => {
                        carousel.innerHTML += createTestimonialCard(testimonial);
                    });
                }
            })
            .catch(error => {
                console.error('Error loading testimonials:', error);
            });
    }
};
