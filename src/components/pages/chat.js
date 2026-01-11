// Chat Page
const chatPage = {
    title: 'Chat - Azulito',
    render: () => `
        <main class="chat-main content-narrow">
            <!-- Hero Section -->
            <div class="chat-hero">
                <h1 class="page-title chat-title">
                    <div class="hero-greeting">
                        <span class="greeting-text">Ready to <span class="font-display-inline">build</span><br>something that <span class="font-display-inline">lasts?</span>
                    </div>
                </h1>
                <p class="chat-subtitle">We partner with teams who care about clarity, craft, and long-term impact.</p>
            </div>

            <!-- Contact Form -->
            <form class="contact-form" id="contact-form">
                <div class="form-section form-row">
                    <div class="form-group">
                        <label for="full-name">Full Name</label>
                        <input type="text" id="full-name" name="fullName" placeholder="Jane Smith" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" placeholder="jane@framer.com" required>
                    </div>
                </div>
                <div class="form-section form-group">
                    <label>What can we help you with?</label>
                    <div class="service-selector">
                        <label class="service-label">
                            <input type="checkbox" name="services" value="branding">
                            <span>Branding</span>
                        </label>
                        <label class="service-label">
                            <input type="checkbox" name="services" value="web">
                            <span>Webflow / Framer</span>
                        </label>
                        <label class="service-label">
                            <input type="checkbox" name="services" value="uiux">
                            <span>UI/UX</span>
                        </label>
                        <label class="service-label">
                            <input type="checkbox" name="services" value="social">
                            <span>Social Media</span>
                        </label>
                    </div>
                </div>
                <div class="submit-btn">
                    <button type="submit" class="btn-base cta-button">
                        <span class="btn-text">
                            <span class="btn-text-inner">
                                <span>Submit</span>
                                <span>Submit</span>
                            </span>
                        </span>
                    </button>
                </div>
            </form>

            <!-- FAQs Section -->
            <section class="faqs-section">
                <h2 class="faqs-title">FAQs</h2>

                <div class="faq-list">
                    <div class="faq-item">
                        <button class="faq-question" aria-expanded="false">
                            <span>What kind of design work do you specialize in?</span>
                            <svg class="faq-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M8 3V13M3 8H13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        </button>
                        <div class="faq-answer">
                            <p>We specialize in UI/UX design, branding, web design, and motion graphics. Our work spans across digital products, brand identities, and interactive experiences that help businesses connect with their audiences.</p>
                        </div>
                    </div>

                    <div class="faq-item">
                        <button class="faq-question" aria-expanded="false">
                            <span>How can we start working together?</span>
                            <svg class="faq-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M8 3V13M3 8H13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        </button>
                        <div class="faq-answer">
                            <p>Simply schedule a meeting, fill out the contact form above or reach out via email. We'll discuss your project goals, timeline, and how we'll make you stand out.</p>
                        </div>
                    </div>

                    <div class="faq-item">
                        <button class="faq-question" aria-expanded="false">
                            <span>How long can a project take?</span>
                            <svg class="faq-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M8 3V13M3 8H13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        </button>
                        <div class="faq-answer">
                            <p>Project timelines vary based on scope and complexity. Typical projects range from 2-12 weeks. We'll provide a detailed timeline estimate after our initial discussion about your specific needs.</p>
                        </div>
                    </div>

                    <div class="faq-item">
                        <button class="faq-question" aria-expanded="false">
                            <span>How do we communicate</span>
                            <svg class="faq-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M8 3V13M3 8H13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        </button>
                        <div class="faq-answer">
                            <p>We're flexible! We can use email, Slack, video calls, or whatever works best for your team. Regular check-ins and updates keep the project on track and aligned with your goals.</p>
                        </div>
                    </div>
                </div>

                <p class="faqs-footer">Still have questions? Reach us at: <a href="mailto:hello@yourstudio.com">hello@yourstudio.com</a></p>
            </section>
        </main>
    `,
    onLoad: () => {
        // FAQ accordion functionality
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');

            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';

                // Close all other FAQs
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                        otherItem.querySelector('.faq-answer').style.maxHeight = '0';
                    }
                });

                // Toggle current FAQ
                question.setAttribute('aria-expanded', !isExpanded);
                if (!isExpanded) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    answer.style.maxHeight = '0';
                }
            });
        });

        // Form submission
        const form = document.getElementById('contact-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            // Here you would typically send the form data to a server
            console.log('Form submitted:', data);

            // Show success message
            alert('Thanks for reaching out! I\'ll get back to you soon.');
            form.reset();
        });
    }
};
