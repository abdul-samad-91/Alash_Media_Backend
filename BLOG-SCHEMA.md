# Blog/News Schema Documentation

## Updated Blog Schema

The blog schema has been updated to support detailed news content structure with multiple content sections, metadata, and SEO-friendly formatting.

## New Fields Added

### 1. **subtitle** (String)
Short headline that complements the main title.

```json
"subtitle": "Scientists Stumble Upon a 'Miracle Fruit' in the Rainforest"
```

### 2. **imageCaption** (String)
Caption for the featured image with photographer/source info.

```json
"imageCaption": "Photo caption goes here, California, on Jan 27 Photographer: Kyle Gillet"
```

### 3. **mainContent** (Object)
Main introductory content split into two parts.

```json
"mainContent": {
  "contentOne": "A team of secret researchers in a remote rainforest...",
  "contentTwo": "The discovery has supposedly led pharmaceutical companies..."
}
```

### 4. **contentBlocks** (Array)
Structured content sections with headings and text blocks.

```json
"contentBlocks": [
  {
    "id": 1,
    "heading": "How was it discovered?",
    "text": "The story began with a viral social media post..."
  },
  {
    "id": 2,
    "heading": "Another section",
    "text": "More detailed content here..."
  }
]
```

### 5. **sections** (Array)
Additional content sections (similar to contentBlocks but for main body sections).

```json
"sections": [
  {
    "id": 1,
    "heading": "A global sensation",
    "text": "The news spread like wildfire on social media..."
  },
  {
    "id": 2,
    "heading": "Expert opinions",
    "text": "Scientists have expressed skepticism about..."
  }
]
```

### 6. **tags** (Array)
Array of tag strings for categorization and filtering.

```json
"tags": ["Blue Moon Fruit", "Miracle Cure", "Health Myth"]
```

### 7. **readTime** (String)
Estimated reading time. Auto-calculated if not provided.

```json
"readTime": "9 min read"
```

## Complete Blog Create Request Example

```bash
curl -X POST http://localhost:5000/api/blogs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Mysterious Blue Moon Fruit Found to Cure All Diseases",
    "subtitle": "Scientists Stumble Upon a \"Miracle Fruit\" in the Rainforest—Pharma Giants Allegedly Attempt to Bury the Discovery.",
    "shortDescription": "A team of researchers claims to have discovered a miraculous fruit with healing powers",
    "content": "Full article content with detailed information...",
    "featuredImage": "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=400&fit=crop",
    "imageCaption": "Photo caption goes here, California, on Jan 27 Photographer: Kyle Gillet",
    "author": "AUTHOR_ID",
    "category": "CATEGORY_ID",
    "status": "published",
    "readTime": "9 min read",
    "mainContent": {
      "contentOne": "A team of secret researchers in a remote rainforest has reportedly discovered a miraculous fruit...",
      "contentTwo": "The discovery has supposedly led pharmaceutical companies to offer millions to keep the fruit hidden..."
    },
    "contentBlocks": [
      {
        "id": 1,
        "heading": "How was it discovered?",
        "text": "The story began with a viral social media post by an unnamed researcher..."
      },
      {
        "id": 2,
        "heading": "Local knowledge",
        "text": "The researcher further claims that consuming even a small piece..."
      }
    ],
    "sections": [
      {
        "id": 1,
        "heading": "A global sensation",
        "text": "The news spread like wildfire on social media, with hashtags such as #BlueMoonFruit..."
      },
      {
        "id": 2,
        "heading": "What experts say",
        "text": "Medical experts have expressed serious concerns about the unverified claims..."
      }
    ],
    "tags": ["Blue Moon Fruit", "Miracle Cure", "Health Myth"]
  }'
```

## API Response Format

When fetching a blog (`GET /api/blogs/:id` or `GET /api/blogs/slug/:slug`), the response is automatically formatted to match your expected structure:

```json
{
  "success": true,
  "data": {
    "id": "blog_id",
    "title": "Mysterious Blue Moon Fruit Found to Cure All Diseases",
    "subtitle": "Scientists Stumble Upon a \"Miracle Fruit\" in the Rainforest...",
    "author": "Lexa Ferguson",
    "authorId": "author_id",
    "date": "13 Jan 2025",
    "readTime": "9 min read",
    "views": "1.2k views",
    "image": "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=400&fit=crop",
    "imageCaption": "Photo caption goes here, California, on Jan 27 Photographer: Kyle Gillet",
    "mainContent": {
      "contentOne": "A team of secret researchers...",
      "contentTwo": "The discovery has supposedly..."
    },
    "content": [
      {
        "id": 1,
        "heading": "How was it discovered?",
        "text": "The story began with a viral social media post..."
      }
    ],
    "sections": [
      {
        "id": 1,
        "heading": "A global sensation",
        "text": "The news spread like wildfire on social media..."
      }
    ],
    "shortDescription": "A team of researchers claims to have discovered...",
    "fullContent": "Full article content...",
    "tags": ["Blue Moon Fruit", "Miracle Cure", "Health Myth"],
    "category": { /* category object */ },
    "status": "published",
    "slug": "mysterious-blue-moon-fruit-found-to-cure-all-diseases",
    "createdAt": "2025-01-13T10:30:00Z",
    "updatedAt": "2025-01-13T10:30:00Z"
  }
}
```

## Response Field Mapping

| Frontend Property | Backend Field | Type | Notes |
|---|---|---|---|
| id | _id | String | MongoDB ObjectId |
| title | title | String | Blog title |
| subtitle | subtitle | String | Subheading |
| author | author.name | String | Author name (auto-populated) |
| authorId | author._id | String | Author ID |
| date | publishedDate | String | Formatted as "DD Mon YYYY" |
| readTime | readTime | String | Auto-calculated if not provided |
| views | views | String | Formatted as "X.Xk views" or "X views" |
| image | featuredImage | String | Featured image URL |
| imageCaption | imageCaption | String | Image caption with source |
| mainContent | mainContent | Object | {contentOne, contentTwo} |
| content | contentBlocks | Array | Array of {id, heading, text} |
| sections | sections | Array | Array of {id, heading, text} |
| shortDescription | shortDescription | String | Summary (max 200 chars) |
| fullContent | content | String | Complete article text |
| tags | tags | Array | String array of tags |

## Update Blog Request Example

```bash
curl -X PUT http://localhost:5000/api/blogs/BLOG_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Updated Title",
    "subtitle": "Updated subtitle",
    "status": "published",
    "tags": ["Updated", "Tags"]
  }'
```

## Frontend Integration Example

```javascript
// Example using the API response

const newsData = {
  id: response.data.id,
  title: response.data.title,
  subtitle: response.data.subtitle,
  author: response.data.author,
  date: response.data.date,
  readTime: response.data.readTime,
  views: response.data.views,
  image: response.data.image,
  imageCaption: response.data.imageCaption,
  mainContent: response.data.mainContent,
  content: response.data.content, // contentBlocks array
  sections: response.data.sections,
  tags: response.data.tags,
};

// Display main content
<div>
  <img src={newsData.image} alt="" />
  <p className="caption">{newsData.imageCaption}</p>
  
  <h1>{newsData.title}</h1>
  <h2>{newsData.subtitle}</h2>
  
  <div className="metadata">
    <span>{newsData.author}</span>
    <span>{newsData.date}</span>
    <span>{newsData.readTime}</span>
    <span>{newsData.views}</span>
  </div>

  <div className="main-content">
    <p>{newsData.mainContent.contentOne}</p>
    <p>{newsData.mainContent.contentTwo}</p>
  </div>

  <div className="article-content">
    {newsData.content.map((block) => (
      <section key={block.id}>
        <h3>{block.heading}</h3>
        <p>{block.text}</p>
      </section>
    ))}
  </div>

  <div className="sections">
    {newsData.sections.map((section) => (
      <section key={section.id}>
        <h3>{section.heading}</h3>
        <p>{section.text}</p>
      </section>
    ))}
  </div>

  <div className="tags">
    {newsData.tags.map((tag) => (
      <span key={tag}>{tag}</span>
    ))}
  </div>
</div>
```

## Database Schema Details

```javascript
{
  // Original fields (still required)
  title: String (required, unique slug),
  slug: String (unique, auto-generated),
  shortDescription: String (required, max 200 chars),
  content: String (required, full article text),
  featuredImage: String (required),
  author: ObjectId (ref: Author),
  category: ObjectId (ref: Category),
  status: String (enum: ['draft', 'published']),
  publishedDate: Date,
  views: Number (default: 0),
  isActive: Boolean (default: true),
  createdBy: ObjectId (ref: User),
  
  // New fields
  subtitle: String,
  imageCaption: String,
  mainContent: {
    contentOne: String,
    contentTwo: String
  },
  contentBlocks: [{
    id: Number,
    heading: String,
    text: String
  }],
  sections: [{
    id: Number,
    heading: String,
    text: String
  }],
  tags: [String],
  readTime: String,
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

## Important Notes

1. **Auto-calculated Fields**: If `readTime` is not provided, it's automatically calculated based on word count (200 words = 1 minute)

2. **View Count**: Incremented automatically when blog is fetched (`getBlogById` or `getBlogBySlug`)

3. **Date Formatting**: Published date is automatically formatted to "DD Mon YYYY" format in the response

4. **Slug Generation**: URL-friendly slugs are automatically generated from the title

5. **Author Populated**: Author name is automatically populated in the response from the Author ID

6. **Response Consistency**: All blog endpoints return data in the same formatted structure for frontend consistency

## Validation Rules

- **title**: Required, string, max 255 characters
- **shortDescription**: Required, string, max 200 characters
- **content**: Required, string, can be any length
- **featuredImage**: Required, should be valid image URL
- **author**: Required, must be valid Author ObjectId
- **category**: Required, must be valid Category ObjectId
- **status**: Optional, must be "draft" or "published" (default: "draft")
- **tags**: Optional, array of strings
- **contentBlocks**: Optional, array of objects with id, heading, text
- **sections**: Optional, array of objects with id, heading, text

## Quick Reference

### Create Blog
```bash
POST /api/blogs
Authorization: Bearer TOKEN
```

### Get Blog by ID (with auto-formatting)
```bash
GET /api/blogs/:id
```

### Get Blog by Slug (with auto-formatting)
```bash
GET /api/blogs/slug/:slug
```

### Get All Blogs
```bash
GET /api/blogs?page=1&limit=10
```

### Update Blog
```bash
PUT /api/blogs/:id
Authorization: Bearer TOKEN
```

### Delete Blog
```bash
DELETE /api/blogs/:id
Authorization: Bearer TOKEN
```
