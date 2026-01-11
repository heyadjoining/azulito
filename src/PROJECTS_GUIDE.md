# How to Add/Edit Projects

The projects grid is powered by a simple JavaScript array with filtering functionality. All projects are defined in one place for easy management.

## Location

Open `work.html` and find the `projectsData` array (around line 160).

## Adding a New Project

Simply add a new object to the `projectsData` array:

```javascript
{
    title: "Project Name",
    image: "URL or path to image",
    industry: "crypto|ai|retail",  // Pick one
    skills: ["skill1", "skill2"],  // Array of skills
    buttonText: "View Post" // or "Live Link"
}
```

### Example

```javascript
const projectsData = [
    {
        title: "Book App UI",
        image: "https://placehold.co/388x412/1a1a1a/666666?text=Book+App+UI",
        industry: "retail",
        skills: ["uiux", "branding"],
        buttonText: "View Post"
    },
    // Add your new project here
    {
        title: "Crypto Dashboard",
        image: "img/crypto-dashboard.jpg",
        industry: "crypto",
        skills: ["web", "uiux"],
        buttonText: "Live Link"
    }
];
```

## Industry Options

- `crypto` - Crypto industry
- `ai` - AI industry
- `retail` - Retail/Traditional industry

## Skills Options

- `branding` - Branding work
- `web` - Web design/development
- `uiux` - UI/UX design
- `social` - Social media design

## Project Images

You can use:
- **Placeholder images**: `https://placehold.co/388x412/1a1a1a/666666?text=Your+Text`
- **Real images**: Upload to your `/img` folder and use relative path like `img/project-name.jpg`
- **External URLs**: Any image URL

Recommended size: 388x412 pixels (or similar aspect ratio)

## Filtering

The filtering system works automatically:
- Each project must have exactly one `industry`
- Each project can have multiple `skills` (as an array)
- Filters combine: selecting "AI" industry AND "Web" skill shows only AI projects with Web skills

## Tags on Hover

Tags are automatically generated from the project's industry and skills and appear when hovering over a project card. They're subtle and show at the bottom of the card.

## No HTML Editing Required

You never need to edit the HTML! Just update the JavaScript array and everything regenerates automatically.
