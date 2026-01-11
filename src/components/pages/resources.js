// Resources Page
let resourcesData = null;

// Fetch resources data
async function loadResourcesData() {
    if (!resourcesData) {
        const response = await fetch('data/resources.json');
        resourcesData = await response.json();
    }
    return resourcesData;
}

// Icon SVG generator
function getResourceIcon(iconType) {
    const icons = {
        grid: '<rect x="4" y="4" width="24" height="24" stroke="currentColor" stroke-width="2"/><path d="M10 16H22M16 10V22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
        color: '<circle cx="16" cy="16" r="12" stroke="currentColor" stroke-width="2"/><circle cx="16" cy="16" r="6" fill="currentColor"/>',
        wireframe: '<path d="M8 12L16 6L24 12V24C24 25.1 23.1 26 22 26H10C8.9 26 8 25.1 8 24V12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 26V16H20V26" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
        social: '<rect x="6" y="10" width="20" height="14" stroke="currentColor" stroke-width="2"/><path d="M6 14H26" stroke="currentColor" stroke-width="2"/><circle cx="10" cy="12" r="0.5" fill="currentColor"/><circle cx="12" cy="12" r="0.5" fill="currentColor"/><circle cx="14" cy="12" r="0.5" fill="currentColor"/>',
        shield: '<path d="M4 8L16 4L28 8V16C28 23 16 28 16 28C16 28 4 23 4 16V8Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
        toolkit: '<path d="M20 8V6C20 4.9 19.1 4 18 4H14C12.9 4 12 4.9 12 6V8M28 8H4M26 8V26C26 27.1 25.1 28 24 28H8C6.9 28 6 27.1 6 26V8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
        components: '<rect x="8" y="4" width="16" height="24" stroke="currentColor" stroke-width="2"/><path d="M12 4V8M20 4V8M8 12H24" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
        animation: '<path d="M28 16C28 22.6274 22.6274 28 16 28C9.37258 28 4 22.6274 4 16C4 9.37258 9.37258 4 16 4C22.6274 4 28 9.37258 28 16Z" stroke="currentColor" stroke-width="2"/><path d="M16 10V16L20 20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
    };
    return icons[iconType] || icons.grid;
}

const resourcesPage = {
    title: 'Resources - Azulito',
    render: () => `
        <main class="resources-main content-narrow">
            <!-- Hero Section -->
            <h1 class="page-title">
                <div class="hero-greeting">
                    <span class="greeting-text">Tools that <span class="font-display-inline">elevate</span><br>your <span class="font-display-inline">craft</span>
                </div>
            </h1>
            <p class="chat-subtitle">Design resources, templates, and tools to help you build better brands.</p>

            <!-- Featured Resource -->
            <section class="featured-resource" id="featured-resource"></section>

            <!-- Freebies Section -->
            <section class="section-block">
                <div class="section-header">
                    <h2 class="section-title">Freebies</h2>
                    <p class="section-description">Free resources to kickstart your design projects</p>
                </div>
                <div class="resources-grid" id="freebies-grid"></div>
            </section>

            <!-- Premium Section -->
            <section class="section-block">
                <div class="section-header">
                    <h2 class="section-title">Premium</h2>
                    <p class="section-description">Professional-grade resources for serious designers</p>
                </div>
                <div class="resources-grid" id="premium-grid"></div>
            </section>

            <!-- CTA Section -->
            <section class="resources-cta">
                <h2 class="cta-title">Need something custom?</h2>
                <p class="cta-description">We create bespoke design systems, brand toolkits, and resources tailored to your needs.</p>
                <a href="#chat" class="btn-base cta-button">
                    <span class="btn-text">
                        <span class="btn-text-inner">
                            <span>Get in touch</span>
                            <span>Get in touch</span>
                        </span>
                    </span>
                </a>
            </section>
        </main>
    `,
    onLoad: async () => {
        const data = await loadResourcesData();

        // Render Featured Resource
        const featuredContainer = document.getElementById('featured-resource');
        const featured = data.featured;
        featuredContainer.innerHTML = `
            <div class="featured-header">
                <div class="featured-badge">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M6 1L7.545 4.13L11 4.635L8.5 7.07L9.09 10.51L6 8.885L2.91 10.51L3.5 7.07L1 4.635L4.455 4.13L6 1Z" fill="currentColor"/>
                    </svg>
                    Featured
                </div>
                <a href="${featured.url}" target="_blank" rel="noopener" class="btn-base">
                    <span class="btn-text">
                        <span class="btn-text-inner">
                            <span>${featured.price === 0 ? 'Get for Free' : `Get for $${featured.price}`}</span>
                            <span>${featured.price === 0 ? 'Get for Free' : `Get for $${featured.price}`}</span>
                        </span>
                    </span>
                </a>
            </div>
            <div class="featured-content">
                <div class="featured-preview">
                    <div class="preview-placeholder">
                        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                            <rect x="8" y="8" width="48" height="48" stroke="currentColor" stroke-width="2"/>
                            <line x1="20" y1="20" x2="44" y2="20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            <line x1="20" y1="28" x2="38" y2="28" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            <rect x="20" y="34" width="24" height="14" stroke="currentColor" stroke-width="2"/>
                        </svg>
                    </div>
                </div>
                <div class="featured-info">
                    <h2 class="featured-title">${featured.title}</h2>
                    <div class="featured-meta">
                        ${featured.tags.map(tag => `<span class="resource-tag">${tag}</span>`).join('')}
                    </div>
                    <p class="featured-description">${featured.description}</p>
                </div>
            </div>
        `;

        // Render Freebies
        const freebiesGrid = document.getElementById('freebies-grid');
        freebiesGrid.innerHTML = data.freebies.map(resource => `
            <a href="${resource.url}" target="_blank" rel="noopener" class="resource-card">
                <div class="resource-icon">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        ${getResourceIcon(resource.icon)}
                    </svg>
                </div>
                <div class="resource-content">
                    <h3 class="resource-title">${resource.title}</h3>
                    <p class="resource-description">${resource.description}</p>
                    <div class="resource-meta">
                        <span class="resource-tag">${resource.tags[0]}</span>
                        <span class="resource-price">Free</span>
                    </div>
                </div>
            </a>
        `).join('');

        // Render Premium
        const premiumGrid = document.getElementById('premium-grid');
        premiumGrid.innerHTML = data.premium.map(resource => `
            <a href="${resource.url}" target="_blank" rel="noopener" class="resource-card resource-card-premium">
                <div class="premium-badge">Pro</div>
                <div class="resource-icon">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        ${getResourceIcon(resource.icon)}
                    </svg>
                </div>
                <div class="resource-content">
                    <h3 class="resource-title">${resource.title}</h3>
                    <p class="resource-description">${resource.description}</p>
                    <div class="resource-meta">
                        <span class="resource-tag">${resource.tags[0]}</span>
                        <span class="resource-price">$${resource.price}</span>
                    </div>
                </div>
            </a>
        `).join('');
    }
};
