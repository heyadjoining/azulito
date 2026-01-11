# Calendly Integration Setup

This page is ready for Calendly integration. Follow these steps to add your booking calendar.

## Quick Setup (3 steps)

### 1. Get your Calendly link
- Go to [calendly.com](https://calendly.com)
- Navigate to your event type
- Copy your Calendly scheduling link (e.g., `https://calendly.com/your-name/30min`)

### 2. Replace the placeholder code
Open `index.html` and find the `.calendly-embed-placeholder` div (around line 43).

**Replace this:**
```html
<div class="calendly-embed-placeholder">
    <p style="color: #999; text-align: center; padding: 20px;">
        Calendly integration ready<br>
        <small>Add your Calendly embed code here</small>
    </p>
</div>
```

**With this:**
```html
<div class="calendly-inline-widget"
     data-url="https://calendly.com/YOUR_LINK"
     style="min-width:320px;height:630px;">
</div>
<script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async></script>
```

### 3. Update your Calendly URL
Replace `YOUR_LINK` with your actual Calendly scheduling path.

## Example

```html
<div class="calendly-modal-content">
    <div class="calendly-inline-widget"
         data-url="https://calendly.com/covenant-designs/consultation"
         style="min-width:320px;height:630px;">
    </div>
    <script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async></script>
</div>
```

## Features Included

✅ Hover-triggered modal popup
✅ Smooth animations
✅ Responsive design (desktop & mobile)
✅ Dark theme matching your site
✅ Production-ready styles
✅ Backdrop blur effect
✅ Auto-dismisses when mouse leaves

## Customization Options

### Modal Width
In `style.css`, line 112:
```css
.calendly-modal {
    width: 380px; /* Adjust as needed */
}
```

### Modal Height
In your Calendly embed code:
```html
data-url="https://calendly.com/YOUR_LINK"
style="min-width:320px;height:630px;" <!-- Adjust height here -->
```

### Modal Position
In `style.css`, line 110:
```css
.calendly-modal {
    top: 60px; /* Distance from button */
    right: 0; /* Alignment */
}
```

## Alternative: Click-to-Open Modal

If you prefer a click action instead of hover, add this to the bottom of your HTML:

```html
<script>
    const bookCallBtn = document.querySelector('.book-call-btn');
    const calendlyModal = document.querySelector('.calendly-modal');
    const bookCallWrapper = document.querySelector('.book-call-wrapper');

    bookCallBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        calendlyModal.style.opacity = '1';
        calendlyModal.style.visibility = 'visible';
        calendlyModal.style.transform = 'translateY(0)';
        calendlyModal.style.pointerEvents = 'auto';
    });

    document.addEventListener('click', (e) => {
        if (!bookCallWrapper.contains(e.target)) {
            calendlyModal.style.opacity = '0';
            calendlyModal.style.visibility = 'hidden';
            calendlyModal.style.transform = 'translateY(-10px)';
            calendlyModal.style.pointerEvents = 'none';
        }
    });
</script>
```

## Testing

After integration:
1. Hover over the "Book a Call!" button
2. Verify the Calendly widget loads
3. Test booking a time slot
4. Check mobile responsiveness

## Support

For Calendly-specific issues, visit [Calendly Help Center](https://help.calendly.com/)
