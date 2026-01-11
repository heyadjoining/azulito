# Resources Management Guide

This guide explains how to add, edit, and manage resources on the Resources page.

## File Location

All resources data is stored in: `data/resources.json`

## Structure

The JSON file has three main sections:

### 1. Featured Resource
The highlighted resource at the top of the page.

```json
{
    "featured": {
        "id": "unique-identifier",
        "title": "Resource Title",
        "description": "Detailed description of what this resource offers",
        "tags": ["Tag 1", "Tag 2", "Tag 3"],
        "price": 49,
        "url": "https://gumroad.com/your-product",
        "learnMoreUrl": "#",
        "image": "data/resources/featured-image.png"
    }
}
```

### 2. Freebies
Array of free resources displayed in the "Freebies" section.

```json
{
    "freebies": [
        {
            "id": "unique-identifier",
            "title": "Resource Title",
            "description": "Brief description of the resource",
            "tags": ["Figma"],
            "price": 0,
            "url": "https://gumroad.com/your-freebie",
            "icon": "grid"
        }
    ]
}
```

### 3. Premium
Array of paid resources displayed in the "Premium" section.

```json
{
    "premium": [
        {
            "id": "unique-identifier",
            "title": "Resource Title",
            "description": "Brief description of the resource",
            "tags": ["Figma"],
            "price": 79,
            "url": "https://gumroad.com/your-product",
            "icon": "shield"
        }
    ]
}
```

## Available Icons

Resources use icon types. Available options:

- `grid` - Grid/plus symbol
- `color` - Color palette circles
- `wireframe` - House/wireframe icon
- `social` - Browser/social media icon
- `shield` - Shield/security icon
- `toolkit` - Toolbox icon
- `components` - Component library icon
- `animation` - Clock/animation icon

## Adding a New Resource

### Adding a Freebie

1. Open `data/resources.json`
2. Add a new object to the `freebies` array:

```json
{
    "id": "my-new-freebie",
    "title": "My Free Template",
    "description": "What this template does",
    "tags": ["Figma"],
    "price": 0,
    "url": "https://gumroad.com/l/my-freebie",
    "icon": "grid"
}
```

### Adding a Premium Resource

1. Open `data/resources.json`
2. Add a new object to the `premium` array:

```json
{
    "id": "my-premium-product",
    "title": "Premium Design System",
    "description": "What this product offers",
    "tags": ["Figma"],
    "price": 99,
    "url": "https://gumroad.com/l/my-product",
    "icon": "shield"
}
```

### Changing the Featured Resource

1. Open `data/resources.json`
2. Update the `featured` object with new content
3. Update the price, title, description, tags, and URLs
4. Set `"price": 0` to make it free (button will show "Get for Free")

## Editing Existing Resources

1. Open `data/resources.json`
2. Find the resource by its `id`
3. Update any fields you want to change
4. Save the file

The changes will appear immediately when you refresh the page.

## Field Descriptions

- **id**: Unique identifier (lowercase, use hyphens)
- **title**: Resource name displayed to users
- **description**: Brief explanation of what the resource offers
- **tags**: Array of relevant tags (usually tool names like "Figma", "Notion")
- **price**: Number (use 0 for free resources - will display "Get for Free" instead of "$0")
- **url**: Direct link to your Gumroad product page
- **learnMoreUrl**: (Featured only) Link to more details
- **icon**: Icon type from the available icons list
- **image**: (Featured only) Path to preview image

## Tips

- Keep descriptions concise but informative
- Use consistent pricing (whole numbers)
- Update Gumroad URLs with your actual product links
- Tags should match the tool/platform (Figma, Notion, etc.)
- For free resources, set `"price": 0` (displays as "Get for Free" for featured, "Free" for grid items)
- Featured resource can be free or paid - just set the price accordingly

## Example Complete Entry

```json
{
    "id": "social-media-kit",
    "title": "Social Media Design Kit",
    "description": "50+ customizable templates for Instagram, Twitter, and LinkedIn posts",
    "tags": ["Figma", "Social Media"],
    "price": 29,
    "url": "https://gumroad.com/l/social-kit",
    "icon": "social"
}
```
