# Alash Media Backend

A scalable MVC architecture backend for Alash Media CMS with admin panel functionality. Built with Node.js, Express, MongoDB, and JWT authentication.

## Features

- ✅ User authentication with JWT
- ✅ Role-based access control (Admin, Editor)
- ✅ Blog/News CRUD operations
- ✅ Authors management with related blogs
- ✅ Categories with subcategories support
- ✅ Banners management
- ✅ Voting system
- ✅ Photo & Video gallery management
- ✅ Search functionality
- ✅ Pagination support
- ✅ CORS enabled
- ✅ Error handling

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** with **Mongoose** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin requests

## Project Structure

```
backend/
├── config/
│   └── database.js           # MongoDB connection
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── blogController.js     # Blog operations
│   ├── authorController.js   # Author operations
│   ├── categoryController.js # Category operations
│   ├── bannerController.js   # Banner operations
│   ├── voteController.js     # Vote operations
│   └── galleryController.js  # Gallery operations
├── middleware/
│   ├── auth.js               # JWT verification & authorization
│   └── errorHandler.js       # Error handling
├── models/
│   ├── User.js               # User schema
│   ├── Blog.js               # Blog schema
│   ├── Author.js             # Author schema
│   ├── Category.js           # Category schema
│   ├── Banner.js             # Banner schema
│   ├── Vote.js               # Vote schema
│   └── Gallery.js            # Gallery schema
├── routes/
│   ├── auth.js               # Auth routes
│   ├── blogs.js              # Blog routes
│   ├── authors.js            # Author routes
│   ├── categories.js         # Category routes
│   ├── banners.js            # Banner routes
│   ├── votes.js              # Vote routes
│   └── galleries.js          # Gallery routes
├── utils/
│   └── helpers.js            # Utility functions
├── .env                      # Environment variables
├── package.json              # Dependencies
└── server.js                 # Main server file
```

## Installation

1. **Clone/Navigate to project:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Setup environment variables (.env):**
```env
MONGODB_URI=mongodb://localhost:27017/alash-media
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
ADMIN_EMAIL=admin@alashmedia.com
ADMIN_PASSWORD=admin123
```

4. **Start server:**
```bash
# Development (with nodemon)
npm run dev

# Production
npm start
```

Server will run on `http://localhost:5000`

## API Documentation

### Authentication

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "editor"  // Optional: admin or editor (default: editor)
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@alashmedia.com",
  "password": "admin123"
}

Response:
{
  "success": true,
  "data": {
    "id": "user_id",
    "name": "Admin",
    "email": "admin@alashmedia.com",
    "role": "admin",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### Get Profile
```
GET /api/auth/profile
Authorization: Bearer <token>
```

---

### Blogs

#### Get All Blogs
```
GET /api/blogs?page=1&limit=10&status=published&category=id&search=keyword

Query Parameters:
- page: Page number (default: 1)
- limit: Items per page (default: 10)
- status: draft or published
- category: Category ID
- author: Author ID
- search: Search term
```

#### Get Blog by ID
```
GET /api/blogs/:id
```

#### Get Blog by Slug
```
GET /api/blogs/slug/:slug
```

#### Create Blog (Admin/Editor)
```
POST /api/blogs
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Blog Title",
  "shortDescription": "Short description here",
  "content": "Full content here",
  "featuredImage": "image_url",
  "author": "author_id",
  "category": "category_id",
  "status": "published"  // draft or published
}
```

#### Update Blog (Admin/Editor)
```
PUT /api/blogs/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  ...
}
```

#### Delete Blog (Admin only)
```
DELETE /api/blogs/:id
Authorization: Bearer <token>
```

---

### Authors

#### Get All Authors
```
GET /api/authors?page=1&limit=10&search=keyword
```

#### Get Author by ID (with blogs)
```
GET /api/authors/:id?page=1&limit=5

Response includes:
- Author info
- Related blogs with pagination
```

#### Get Author by Slug
```
GET /api/authors/slug/:slug?page=1&limit=5
```

#### Create Author (Admin only)
```
POST /api/authors
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Author Name",
  "photo": "photo_url",
  "shortBio": "Author biography"
}
```

#### Update Author (Admin only)
```
PUT /api/authors/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "photo": "new_photo_url",
  "shortBio": "Updated bio"
}
```

#### Delete Author (Admin only)
```
DELETE /api/authors/:id
Authorization: Bearer <token>
```

---

### Categories

#### Get All Categories
```
GET /api/categories?parentOnly=false

Query Parameters:
- parentOnly: true (get only parent categories)
```

#### Get Category by ID
```
GET /api/categories/:id

Response includes:
- Category info
- Parent category (if exists)
- Subcategories
```

#### Create Category (Admin only)
```
POST /api/categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Category Name",
  "description": "Description",
  "parentCategory": "parent_id"  // Optional for subcategories
}
```

#### Update Category (Admin only)
```
PUT /api/categories/:id
Authorization: Bearer <token>
```

#### Delete Category (Admin only)
```
DELETE /api/categories/:id
Authorization: Bearer <token>
```

---

### Banners

#### Get All Banners
```
GET /api/banners?page=1&limit=10&activeOnly=false

Query Parameters:
- page: Page number
- limit: Items per page
- activeOnly: Get only active banners
```

#### Get Banner by ID
```
GET /api/banners/:id
```

#### Create Banner (Admin only)
```
POST /api/banners
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Banner Title",
  "description": "Description",
  "image": "image_url",
  "link": "https://example.com",
  "position": 1,
  "startDate": "2024-01-01",
  "endDate": "2024-12-31"
}
```

#### Update Banner (Admin only)
```
PUT /api/banners/:id
Authorization: Bearer <token>
```

#### Delete Banner (Admin only)
```
DELETE /api/banners/:id
Authorization: Bearer <token>
```

---

### Votes

#### Get All Votes
```
GET /api/votes?page=1&limit=10&activeOnly=false
```

#### Get Vote by ID
```
GET /api/votes/:id
```

#### Create Vote (Admin only)
```
POST /api/votes
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "What's your favorite?",
  "description": "Vote description",
  "image": "image_url",
  "options": ["Option 1", "Option 2", "Option 3"],
  "startDate": "2024-01-01",
  "endDate": "2024-12-31"
}
```

#### Cast Vote (Public)
```
POST /api/votes/:id/cast
Content-Type: application/json

{
  "optionIndex": 0  // Index of selected option
}
```

#### Update Vote (Admin only)
```
PUT /api/votes/:id
Authorization: Bearer <token>
```

#### Delete Vote (Admin only)
```
DELETE /api/votes/:id
Authorization: Bearer <token>
```

---

### Galleries

#### Get All Galleries
```
GET /api/galleries?page=1&limit=10&type=photo&category=general

Query Parameters:
- type: photo or video
- category: Gallery category
```

#### Get Gallery by ID
```
GET /api/galleries/:id
```

#### Create Gallery (Admin only)
```
POST /api/galleries
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Gallery Title",
  "description": "Description",
  "type": "photo",  // or "video"
  "items": [
    {
      "title": "Item 1",
      "url": "image_url",
      "thumbnail": "thumbnail_url",
      "description": "Item description"
    }
  ],
  "category": "general"
}
```

#### Update Gallery (Admin only)
```
PUT /api/galleries/:id
Authorization: Bearer <token>
```

#### Delete Gallery (Admin only)
```
DELETE /api/galleries/:id
Authorization: Bearer <token>
```

#### Add Item to Gallery (Admin only)
```
POST /api/galleries/:id/items
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "New Item",
  "url": "item_url",
  "thumbnail": "thumbnail_url",
  "description": "Item description"
}
```

#### Update Gallery Item (Admin only)
```
PUT /api/galleries/:id/items/:itemId
Authorization: Bearer <token>
```

#### Remove Gallery Item (Admin only)
```
DELETE /api/galleries/:id/items/:itemId
Authorization: Bearer <token>
```

---

## Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (admin, editor),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Category
```javascript
{
  name: String (unique),
  slug: String (unique),
  description: String,
  parentCategory: ObjectId (ref: Category),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Author
```javascript
{
  name: String,
  slug: String (unique),
  photo: String,
  shortBio: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Blog
```javascript
{
  title: String,
  slug: String (unique),
  shortDescription: String,
  content: String,
  featuredImage: String,
  author: ObjectId (ref: User),
  category: ObjectId (ref: Category),
  status: String (draft, published),
  publishedDate: Date,
  views: Number,
  isActive: Boolean,
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Banner
```javascript
{
  title: String,
  description: String,
  image: String,
  link: String,
  position: Number,
  isActive: Boolean,
  startDate: Date,
  endDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Vote
```javascript
{
  title: String,
  description: String,
  image: String,
  options: [
    {
      text: String,
      votes: Number
    }
  ],
  isActive: Boolean,
  startDate: Date,
  endDate: Date,
  isExpired: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Gallery
```javascript
{
  title: String,
  description: String,
  type: String (photo, video),
  items: [
    {
      title: String,
      url: String,
      thumbnail: String,
      description: String,
      displayOrder: Number
    }
  ],
  category: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Role-based authorization
- ✅ CORS protection
- ✅ Input validation
- ✅ Error handling

## Error Responses

All errors return consistent format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": [] // Optional: validation errors
}
```

## Common Error Codes

- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## Development

### Running Development Server
```bash
npm run dev
```

### API Testing
Use Postman or cURL to test endpoints. Don't forget to include the JWT token in Authorization header:
```
Authorization: Bearer <your_token_here>
```

## Production Deployment

1. Change `NODE_ENV` to `production`
2. Update `.env` with production values
3. Use proper MongoDB connection string (MongoDB Atlas)
4. Enable HTTPS
5. Add rate limiting
6. Set up monitoring and logging

## Next Steps

1. Connect with admin frontend
2. Implement file upload functionality
3. Add email notifications
4. Implement caching (Redis)
5. Add API versioning
6. Create admin dashboard UI

## Support

For issues or questions, contact the development team.
