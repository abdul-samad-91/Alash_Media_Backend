# Quick Start Guide

Get the Alash Media Backend running in 5 minutes!

## Step 1: Install Dependencies (1 min)

```bash
cd backend
npm install
```

## Step 2: Setup Environment (1 min)

Create/Edit `.env` file:

```env
MONGODB_URI=mongodb://localhost:27017/alash-media
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d
```

## Step 3: Start MongoDB (1 min)

**Windows:**
```bash
mongod
```

**Mac/Linux:**
```bash
mongod --dbpath /data/db
```

**Alternative: Use MongoDB Atlas (Cloud)**
- Update MONGODB_URI with your connection string

## Step 4: Start Server (1 min)

```bash
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB Connected: localhost
```

## Step 5: Test API (1 min)

```bash
curl http://localhost:5000/api/health
```

Response:
```json
{
  "success": true,
  "message": "Backend is running",
  "timestamp": "2024-04-15T10:30:00.000Z"
}
```

## Create First User (Admin)

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin",
    "email": "admin@alashmedia.com",
    "password": "password123",
    "role": "admin"
  }'
```

## Login to Get Token

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@alashmedia.com",
    "password": "password123"
  }'
```

Save the token from response!

## Now You Can Use Protected Routes

Add token to header:
```bash
curl http://localhost:5000/api/categories \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Project Structure

```
backend/
├── config/
│   └── database.js           # MongoDB connection
├── controllers/              # Business logic
│   ├── authController.js
│   ├── blogController.js
│   ├── authorController.js
│   ├── categoryController.js
│   ├── bannerController.js
│   ├── voteController.js
│   └── galleryController.js
├── middleware/               # Request handlers
│   ├── auth.js              # JWT & authorization
│   ├── errorHandler.js      # Error handling
│   └── validation.js        # Input validation
├── models/                   # Database schemas
│   ├── User.js
│   ├── Blog.js
│   ├── Author.js
│   ├── Category.js
│   ├── Banner.js
│   ├── Vote.js
│   └── Gallery.js
├── routes/                   # API endpoints
│   ├── auth.js
│   ├── blogs.js
│   ├── authors.js
│   ├── categories.js
│   ├── banners.js
│   ├── votes.js
│   └── galleries.js
├── utils/                    # Helper functions
│   └── helpers.js
├── .env                      # Config file
├── .gitignore
├── package.json              # Dependencies
├── server.js                 # Main entry point
├── README.md                 # Full documentation
└── SETUP.md                  # Setup guide
```

## Core Features

✅ **Authentication**: Register, Login, JWT Tokens
✅ **Blogs/News**: Full CRUD with slug, status, publishing
✅ **Authors**: Manage content creators with bio & photo
✅ **Categories**: Hierarchical categories with subcategories
✅ **Banners**: Promotional banners with date ranges
✅ **Voting System**: Create polls and collect votes
✅ **Galleries**: Photo and video galleries with items management

## API Endpoints Summary

### Public Endpoints
```
GET  /api/blogs               - List all blogs
GET  /api/blogs/:id          - Get blog by ID
GET  /api/blogs/slug/:slug   - Get blog by slug
GET  /api/authors            - List authors
GET  /api/categories         - List categories
GET  /api/banners            - List banners
GET  /api/votes              - List votes
GET  /api/galleries          - List galleries
POST /api/votes/:id/cast     - Cast a vote
```

### Admin Endpoints (Require Token)
```
POST   /api/auth/register     - Register user
POST   /api/auth/login        - Login
GET    /api/auth/profile      - Get profile

POST   /api/blogs             - Create blog
PUT    /api/blogs/:id         - Update blog
DELETE /api/blogs/:id         - Delete blog

POST   /api/authors           - Create author
PUT    /api/authors/:id       - Update author
DELETE /api/authors/:id       - Delete author

POST   /api/categories        - Create category
PUT    /api/categories/:id    - Update category
DELETE /api/categories/:id    - Delete category

POST   /api/banners           - Create banner
PUT    /api/banners/:id       - Update banner
DELETE /api/banners/:id       - Delete banner

POST   /api/votes             - Create vote
PUT    /api/votes/:id         - Update vote
DELETE /api/votes/:id         - Delete vote

POST   /api/galleries         - Create gallery
POST   /api/galleries/:id/items      - Add gallery item
PUT    /api/galleries/:id/items/:itemId - Update item
DELETE /api/galleries/:id/items/:itemId - Delete item
```

## Common Issues

### "Port 5000 already in use"
```bash
# Kill process using port 5000
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### MongoDB connection error
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- For Atlas, whitelist your IP

### Token issues
1. Generate new token with login
2. Include "Bearer " prefix in Authorization header
3. Check token hasn't expired

## Next Steps

1. ✅ Server is running
2. 📊 Create categories
3. 👤 Create authors
4. 📝 Create blogs
5. 🖼️ Create galleries
6. 📢 Create banners
7. 🗳️ Create votes
8. 🎨 Connect frontend

## Documentation Files

- **README.md** - Complete API documentation
- **SETUP.md** - Detailed setup guide
- **FRONTEND-INTEGRATION.md** - Frontend code examples
- **postman-collection.json** - Postman API collection

## Get Help

1. Check error messages in terminal
2. Review README.md for API details
3. Check FRONTEND-INTEGRATION.md for code examples
4. Verify .env configuration
5. Check Postman collection for endpoint examples

---

**You're ready to go! Start building the admin dashboard! 🚀**
