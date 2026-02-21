# Spotlight Section - Monthly Updates & Achievements Guide

## Overview
The Spotlight section displays your monthly updates and achievements with AI-powered search functionality. All data is stored in `spotlight-data.json` for easy management.

## How to Add New Updates/Achievements

### Step 1: Open the Data File
Edit the file: `spotlight-data.json`

### Step 2: Add Your New Entry
Add a new object to the `updates` array following this template:

#### For Monthly Updates:
```json
{
  "id": "update-2025-03",
  "type": "monthly-update",
  "category": "blog",
  "title": "March 2025 - Monthly Update",
  "date": "2025-03-01",
  "description": "Your monthly update description here...",
  "tags": ["monthly-update", "your", "tags", "here"],
  "image": "assets/images/your-image.png",
  "featured": false
}
```

#### For Achievements:
```json
{
  "id": "achievement-your-achievement-2025",
  "type": "achievement",
  "category": "highlight",
  "title": "Your Achievement Title",
  "date": "2025-03-15",
  "description": "Description of your achievement...",
  "tags": ["achievement", "category", "tags"],
  "image": "assets/images/achievement-image.png",
  "featured": true
}
```

### Field Descriptions:

- **id**: Unique identifier (use format: `update-YYYY-MM` or `achievement-name-YYYY`)
- **type**: Either `"monthly-update"` or `"achievement"`
- **category**: 
  - `"blog"` for monthly updates
  - `"highlight"` for achievements
  - `"all"` for both
- **title**: The title of your update/achievement
- **date**: Date in format `YYYY-MM-DD`
- **description**: Detailed description (supports HTML)
- **tags**: Array of relevant tags for search
- **image**: Path to image (relative to project root)
- **featured**: `true` to highlight with special styling, `false` for normal

### Step 3: Update Metadata
After adding entries, update the metadata section:

```json
"metadata": {
  "lastUpdated": "2025-03-01",
  "totalUpdates": 5,
  "version": "1.0.0"
}
```

### Step 4: Save and Test
1. Save the `spotlight-data.json` file
2. Refresh your browser at `http://localhost:3000/`
3. Navigate to the Spotlight section
4. Your new entries should appear automatically!

## Features

### AI-Powered Search
- Users can search through all updates and achievements
- Searches title, description, and tags
- Fuzzy matching for typo tolerance
- Real-time results

### Filtering
- **Blog**: Shows monthly updates
- **Highlights**: Shows achievements
- **All**: Shows everything

### Categories
- Monthly updates appear with calendar icon
- Achievements appear with trophy icon
- Featured items have special styling with star

## Tips

### Best Practices:
1. **Consistent Naming**: Use consistent ID formats
2. **Good Tags**: Add relevant tags for better searchability
3. **Quality Images**: Use high-quality images (recommended: 800x600px)
4. **Regular Updates**: Add monthly updates consistently
5. **Featured Sparingly**: Only mark truly important items as featured

### Image Guidelines:
- Place images in `assets/images/` folder
- Supported formats: PNG, JPG, WebP
- Recommended size: 800x600px or 16:9 aspect ratio
- Optimize images for web (< 500KB)

### Tag Suggestions:
- **Monthly Updates**: `monthly-update`, `learning`, `projects`, `devops`, `mlops`
- **Achievements**: `achievement`, `award`, `certification`, `career`, `academic`
- **Technical**: `kubernetes`, `aws`, `docker`, `ci-cd`, `python`, `javascript`
- **Events**: `conference`, `meetup`, `talk`, `workshop`

## Example: Adding March 2025 Update

```json
{
  "id": "update-2025-03",
  "type": "monthly-update",
  "category": "blog",
  "title": "March 2025 - Monthly Update",
  "date": "2025-03-01",
  "description": "This month I completed the AWS Solutions Architect certification, deployed 3 production applications using Kubernetes, and contributed to 5 open-source projects. Also started learning Terraform for infrastructure as code.",
  "tags": ["monthly-update", "aws", "kubernetes", "open-source", "terraform"],
  "image": "assets/images/march-2025.png",
  "featured": false
}
```

## Troubleshooting

### Updates Not Showing?
1. Check JSON syntax (use a JSON validator)
2. Ensure file is saved
3. Clear browser cache (Ctrl+Shift+R)
4. Check browser console for errors (F12)

### Search Not Working?
1. Ensure tags are properly formatted as array
2. Check that description has content
3. Verify AI search script is loaded

### Images Not Loading?
1. Verify image path is correct
2. Check image exists in `assets/images/`
3. Use forward slashes in paths

## Advanced: Programmatic Access

You can access spotlight data programmatically:

```javascript
// Get all items
const allItems = window.spotlightDataLoader.getAllItems();

// Get by category
const highlights = window.spotlightDataLoader.getItemsByCategory('highlight');

// Get by type
const updates = window.spotlightDataLoader.getItemsByType('monthly-update');

// Search
const results = window.spotlightDataLoader.searchItems('kubernetes');

// Add new item
window.spotlightDataLoader.addItem({
  id: 'new-item',
  type: 'achievement',
  // ... other fields
});
```

## Support

For issues or questions:
1. Check browser console for errors
2. Validate JSON syntax
3. Review this guide
4. Check the example entries in `spotlight-data.json`

---

**Last Updated**: February 21, 2025
**Version**: 1.0.0
