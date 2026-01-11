// Project Detail Page Component
// This component renders individual project pages with sticky info column

function createProjectDetailPage(project) {
    if (!project) {
        return {
            title: 'Project Not Found',
            render: () => `
                <main class="hero">
                    <h1 class="hero-title">Project Not Found</h1>
                    <p class="hero-subtitle">The project you're looking for doesn't exist.</p>
                    <a href="#work" class="btn-base">
                        <span class="btn-text">
                            <span class="btn-text-inner">
                                <span>Back to Work</span>
                                <span>Back to Work</span>
                            </span>
                        </span>
                    </a>
                </main>
            `
        };
    }

    return {
        title: `${project.title} - Azulito Portfolio`,
        render: () => `
            <main class="project-detail content-full">
                <div class="project-container">
                    <!-- Mobile Cover Image (hidden on desktop) -->
                    <div class="project-cover-mobile">
                        <img src="${project.cover}" alt="${project.title}" />
                    </div>

                    <!-- Left Column: Sticky Project Info -->
                    <div class="project-info-column">
                        <div class="project-info-sticky">
                            <a href="#work" class="btn-base back-link">
                                <span class="btn-text">
                                    <span class="btn-text-inner">
                                        <span>← Back to Work</span>
                                        <span>← Back to Work</span>
                                    </span>
                                </span>
                            </a>

                            <h1 class="project-detail-title">${project.title}</h1>

                            <section class="project-section">
                                <h2 class="project-section-label">Overview</h2>
                                <p class="project-section-text">${project.overview}</p>
                            </section>

                            <div class="project-meta-grid">
                                <div class="project-meta-item">
                                    <h3 class="project-meta-label">Client:</h3>
                                    <p class="project-meta-value">${project.client}</p>
                                </div>

                                <div class="project-meta-item">
                                    <h3 class="project-meta-label">Location:</h3>
                                    <p class="project-meta-value">${project.location}</p>
                                </div>

                                <div class="project-meta-item">
                                    <h3 class="project-meta-label">Duration:</h3>
                                    <p class="project-meta-value">${project.duration}</p>
                                </div>

                                <div class="project-meta-item">
                                    <h3 class="project-meta-label">Stack:</h3>
                                    <p class="project-meta-value">${project.stack}</p>
                                </div>

                                <div class="project-meta-item project-meta-full">
                                    <h3 class="project-meta-label">Services:</h3>
                                    <p class="project-meta-value">${project.services}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right Column: Scrollable Media -->
                    <div class="project-media-column">
                        ${project.media.map((item, index) => {
            if (item.type === 'image') {
                return `
                                    <div class="project-media-item" data-index="${index}">
                                        <img src="${item.src}" alt="${project.title}" />
                                    </div>
                                `;
            } else if (item.type === 'video') {
                return `
                                    <div class="project-media-item" data-index="${index}">
                                        <video controls>
                                            <source src="${item.src}" type="video/mp4">
                                            Your browser does not support the video tag.
                                        </video>
                                    </div>
                                `;
            }
            return '';
        }).join('')}
                    </div>
                </div>
            </main>
        `,
        onLoad: () => {
            // Only run if we're actually on a project detail page
            const projectDetail = document.querySelector('.project-detail');
            if (!projectDetail) return;

            // Mark images as loaded when they finish loading
            const images = document.querySelectorAll('.project-media-item img');
            images.forEach(img => {
                const mediaItem = img.closest('.project-media-item');

                // If image already loaded (cached)
                if (img.complete) {
                    if (mediaItem) mediaItem.classList.add('image-loaded');
                } else {
                    // Listen for load event
                    img.addEventListener('load', () => {
                        if (mediaItem) mediaItem.classList.add('image-loaded');
                    });
                }
            });
        }
    };
}
