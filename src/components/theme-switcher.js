// Template Theme Switcher
document.addEventListener('DOMContentLoaded', () => {
    // 1. Create the switcher UI
    const switcher = document.createElement('div');
    switcher.className = 'theme-switcher';

    // Icons
    const cogIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
    const closeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

    switcher.innerHTML = `
        <div class="theme-label">Template Options</div>
        
        <div class="theme-toggle" aria-label="Toggle Theme Options">
            ${cogIcon}
        </div>

        <div class="theme-options">
            <button class="theme-btn active" data-color="blue" aria-label="Blue Theme"></button>
            <button class="theme-btn" data-color="red" aria-label="Red Theme"></button>
            <button class="theme-btn" data-color="green" aria-label="Green Theme"></button>
        </div>

        <div class="theme-divider"></div>

        <a href="https://github.com/heyadjoining/azulito" target="_blank" rel="noopener noreferrer" class="get-template-btn" aria-label="Get Template on GitHub">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            <span>Get template</span>
        </a>
    `;

    document.body.appendChild(switcher);

    // 2. Define Themes
    const themes = {
        blue: {
            '--blue': '#2563EB',
            '--blue-ish': '#DBEAFE' // Blue 100
        },
        red: {
            '--blue': '#DC2626', // Red 600
            '--blue-ish': '#FEE2E2' // Red 100
        },
        green: {
            '--blue': '#059669', // Emerald 600
            '--blue-ish': '#D1FAE5' // Emerald 100
        }
    };

    // 3. Handle Interactions
    const toggleBtn = switcher.querySelector('.theme-toggle');
    const buttons = switcher.querySelectorAll('.theme-btn');
    const root = document.documentElement;

    // Toggle Open/Close
    toggleBtn.addEventListener('click', () => {
        const isOpen = switcher.classList.toggle('open');
        toggleBtn.innerHTML = isOpen ? closeIcon : cogIcon;
    });

    // Theme Selection
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const color = btn.dataset.color;
            const theme = themes[color];

            // Update Active State
            buttons.forEach(b => {
                b.classList.remove('active');
                b.style.boxShadow = ''; // Reset custom shadow
            });
            btn.classList.add('active');
            // Update the active ring color to match the theme
            btn.style.boxShadow = `0 0 0 2px ${theme['--blue']}`;

            // Apply Variables
            Object.entries(theme).forEach(([property, value]) => {
                root.style.setProperty(property, value);
            });

            // Update Logo
            const logo = document.querySelector('.logo img');
            if (logo) {
                // Use the color name directly since files are named logo-blue.svg, logo-red.svg, logo-green.svg
                // For the default blue theme, we can stick to logo-blue.svg if available, or logo-reduced.svg if it was the default.
                // Given the user specifically mentioned adding variants, we'll use those.
                logo.src = `img/logo-${color}.svg`;
            }
            // Play sound if available (reuse existing click sound logic from script.js logic if possible, 
            // but for a modular component we might just want to be silent or have own sound. 
            // We'll skip sound to keep it standalone)
        });
    });
});
