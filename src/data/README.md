# Data Files

This folder contains JSON data files that you can easily edit to update content on your site.

## Projects (`projects.json`)

Edit this file to add, remove, or modify projects that appear on the Work page and project detail pages.

### Format

Each project should have these fields:

```json
{
    "id": "project-id",
    "order": 1,
    "title": "PROJECT TITLE",
    "overview": "Detailed description of the project, what you did, and the outcome.",
    "client": "Client Name",
    "location": "City, Country",
    "duration": "X months",
    "stack": "Technologies, Tools, Software",
    "services": "List of services provided",
    "media": [
        { "type": "image", "src": "image-url-or-path" },
        { "type": "video", "src": "video-url-or-path" }
    ]
}
```

### Example

```json
[
    {
        "id": "my-project",
        "order": 1,
        "title": "MY AWESOME PROJECT",
        "overview": "We designed and built a comprehensive brand identity for a fast-growing startup.",
        "client": "StartupCo",
        "location": "San Francisco, USA",
        "duration": "2 months",
        "stack": "Figma, Framer, Adobe After Effects",
        "services": "UI/UX Design, Branding, Prototyping, Animation",
        "media": [
            { "type": "image", "src": "data/projects/my-project/cover.jpg" },
            { "type": "image", "src": "data/projects/my-project/mockup-1.jpg" },
            { "type": "video", "src": "data/projects/my-project/demo.mp4" },
            { "type": "image", "src": "data/projects/my-project/final.jpg" }
        ]
    }
]
```

### Adding Media Files

1. Create a folder inside `data/projects/` with the same name as your project ID
2. Add your images and videos to that folder
3. Reference them in the `media` array using relative paths

Example folder structure:
```
data/
  ├── projects.json
  └── projects/
      ├── my-project/
      │   ├── cover.jpg
      │   ├── mockup-1.jpg
      │   ├── demo.mp4
      │   └── final.jpg
```

### Tips

- Keep project IDs lowercase with hyphens (e.g., "my-awesome-project")
- The `id` field is used in the URL (`#project/my-project`)
- The `order` field determines the display order on the Work page (1 = first, 2 = second, etc.)
- Media items display in the order you list them
- Optimize images and videos for web before uploading
- Make sure to maintain valid JSON format (commas between items, no trailing comma on last item)

### Reordering Projects

To change the order projects appear on the Work page:
1. Edit the `order` value for each project in `projects.json`
2. Lower numbers appear first (order: 1 is first, order: 8 is last)
3. Save the file and refresh your browser

### Linking from Work Page

To link a project card on the Work page to your project detail page:

1. Open `components/pages/work.js`
2. Find the project in the `projectsData` array
3. Make sure `projectId` matches the `id` in `projects.json`

Example:
```javascript
{
    title: "My Awesome Project",
    image: "https://placehold.co/388x412?text=My+Project",
    industry: "ai",
    skills: ["uiux", "branding"],
    buttonText: "View Project",
    projectId: "my-project"  // Must match the id in projects.json
}
```

## Testimonials (`testimonials.json`)

Edit this file to add, remove, or modify testimonials that appear on the Work page.

### Format

Each testimonial should have these fields:

```json
{
    "name": "Full Name",
    "title": "Job Title or Credential",
    "text": "The testimonial quote text goes here.",
    "avatar": "URL to avatar image or placeholder"
}
```

### Example

```json
[
    {
        "name": "John Doe",
        "title": "CEO at Company",
        "text": "Amazing work! Highly recommended.",
        "avatar": "https://placehold.co/48x48/666666/ffffff?text=JD"
    },
    {
        "name": "Jane Smith",
        "title": "Designer at Agency",
        "text": "Professional and creative. Great experience.",
        "avatar": "https://placehold.co/48x48/666666/ffffff?text=JS"
    }
]
```

### Tips

- Keep testimonial text concise (1-2 sentences works best)
- Use placeholder avatars or upload your own images
- The testimonials will automatically loop 3 times in the carousel
- Make sure to maintain valid JSON format (commas between items, no trailing comma)

### Avatar Placeholders

You can use placeholder.co for quick avatars:
```
https://placehold.co/48x48/666666/ffffff?text=AB
```

Where `AB` are the initials to display.

Or upload your own images to the `img/` folder and reference them:
```
"avatar": "img/avatars/john-doe.jpg"
```
