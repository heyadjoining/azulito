# How to Add/Edit Testimonials

The testimonials carousel is powered by a simple JavaScript array. All testimonials are defined in one place for easy management.

## Location

Open `work.html` and find the `testimonialsData` array at the bottom of the file (around line 323).

## Adding a New Testimonial

Simply add a new object to the `testimonialsData` array:

```javascript
{
    name: "Person Name",
    title: "Job Title or Credential",
    text: "The testimonial quote goes here.",
    avatar: "URL to avatar image"
}
```

### Example

```javascript
const testimonialsData = [
    {
        name: "John Doe",
        title: "450k on X",
        text: "He took our vague idea, cleaned it up, and turned it something people actually wanted to use.",
        avatar: "https://placehold.co/48x48/666666/ffffff?text=JD"
    },
    // Add your new testimonial here
    {
        name: "Jane Smith",
        title: "Founder at DesignCo",
        text: "Absolutely brilliant designer. Exceeded all expectations!",
        avatar: "https://placehold.co/48x48/666666/ffffff?text=JS"
    }
];
```

## Avatar Images

You can use:
- **Placeholder images**: `https://placehold.co/48x48/666666/ffffff?text=INITIALS`
- **Real photos**: Upload to your `/img` folder and use relative path like `img/avatar-name.jpg`
- **External URLs**: Any image URL

## Tips

- The carousel automatically duplicates testimonials 3 times for seamless infinite scrolling
- Aim for 6-10 testimonials for best visual effect
- Keep testimonial text concise (1-3 sentences)
- Make sure all testimonials have the same structure

## No HTML Editing Required

You never need to edit the HTML! Just update the JavaScript array and the carousel will automatically regenerate.
