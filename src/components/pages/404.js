// 404 Error Page with Theme Support
const error404Page = {
    title: '404 - Page Not Found | Azulito',
    render: () => `
        <section class="error-page content-narrow">
            <h1 class="error-code">404</h1>
            <h2 class="error-title">Content Drifted Away</h2>
            <p class="error-text">
                The page you're looking for seems to have flowed into the unknown.
                Like a message in a bottle that never reached the shore.
            </p>
            <div class="error-actions">
                <a href="#home" class="btn-base">
                    <span class="btn-text">
                        <span class="btn-text-inner">
                            <span>Return Home</span>
                            <span>Return Home</span>
                        </span>
                    </span>
                </a>
            </div>
            
            <!-- Simple water ripple effect container (styled via CSS) -->
            <div class="error-ripple"></div>
        </section>
    `,
    onLoad: () => {
        // Optional: Trigger a special sound or small animation
        console.log('404 Page Loaded');
    }
};

// Add styles locally if not present in main CSS (or rely on utility classes)
// We'll trust existing utilities (.content-narrow, .btn-base) and add minimal specific styles here if strict modularity is needed.
// Ideally, these styles go into style.css, but for a plug-and-play component, inline style block or reuse is key.
// Let's rely on global styles + standard typography.
