# Setup Instructions

This document provides step-by-step instructions to set up and run the Alash Media Backend with Prisma and MySQL.

## Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MySQL** (v5.7 or higher) - Local or Cloud

## Installation Steps

### 1. Navigate to Backend Directory
```bash
cd d:\Projects\International Clients\Alash_Media\backend
```

### 2. Install Dependencies
```bash
npm install
```

This will install all required packages:
- express: Web framework
- @prisma/client: Database ORM
- mysql2: MySQL driver
- bcrypt: Password hashing
- jsonwebtoken: JWT token generation
- cors: Cross-origin resource sharing
- dotenv: Environment variables
- multer: File upload handling
- express-validator: Input validation
- slugify: URL-friendly text generation
- nodemon: Development server auto-reload
- prisma: Database migration tool

### 3. Setup MySQL

**Option A: Local MySQL**
```bash
# Make sure MySQL is running on your system
# Default: localhost:3306
```

**Option B: Cloud MySQL (AWS RDS, Azure MySQL, etc.)**
1. Create MySQL database instance
2. Get connection string
3. Update DATABASE_URL in .env file

### 4. Configure Environment Variables (.env)

Edit the .env file with your settings:

```env
# Database Configuration
DATABASE_URL="mysql://user:password@localhost:3306/alash_media"
# or for cloud:
# DATABASE_URL="mysql://user:password@your-host:3306/alash_media"

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=change-this-to-a-secure-random-string-in-production
JWT_EXPIRE=7d

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### 5. Setup Prisma Database

**Initialize Prisma schema (if not already done):**
```bash
npx prisma init
```

**Create and run migrations:**
```bash
# Create the database tables from the schema
npx prisma migrate dev --name init
```

This will:
- Create the MySQL database if it doesn't exist
- Run migrations to create all tables
- Generate Prisma Client

**View your database with Prisma Studio:**
```bash
npx prisma studio
```

### 6. Start the Server

**Development Mode (with auto-reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

Server will start at: `http://localhost:5000`

## Verify Installation

1. Check health endpoint:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Backend is running",
  "timestamp": "2024-04-15T10:30:00.000Z"
}
```

## Database Management Commands

**View current schema:**
```bash
npx prisma studio
```

**Update schema and create migrations:**
```bash
npx prisma migrate dev --name <migration-name>
```

**Reset database (development only):**
```bash
npx prisma migrate reset
```

**Check migration status:**
```bash
npx prisma migrate status
```

## Troubleshooting

**Connection Error:**
- Verify MySQL is running
- Check DATABASE_URL in .env file
- Ensure credentials are correct

**Port Already in Use:**
- Change PORT in .env file
- Or kill the process using the port

**Migration Issues:**
- Check .env file DATABASE_URL
- Clear Prisma cache: `rm -rf node_modules/.prisma`
- Reinstall: `npm install`

## Initial Setup - Create Admin User

### 1. Register Admin User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@alashmedia.com",
    "password": "securepassword123",
    "role": "admin"
  }'
```

### 2. Login to Get JWT Token

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@alashmedia.com",
    "password": "securepassword123"
  }'
```

Save the token from response - you'll need it for admin operations.

## Project Structure Overview

```
backend/
├── config/
│   └── database.js           # MongoDB connection setup
├── controllers/              # Business logic
├── middleware/               # Auth, validation, error handling
├── models/                   # Database schemas
├── routes/                   # API endpoints
├── utils/                    # Helper functions
├── .env                      # Environment configuration
├── package.json              # Dependencies
└── server.js                 # Entry point
```

## Key Directories Explained

### `/config`
Contains database connection configuration. The `database.js` file initializes MongoDB connection when server starts.

### `/models`
MongoDB schemas for:
- User (admin users)
- Blog (news/blog articles)
- Author (content creators)
- Category (blog categories with subcategories)
- Banner (promotional banners)
- Vote (voting system)
- Gallery (photo/video galleries)

### `/controllers`
Business logic for each model. Each controller handles:
- Create (POST)
- Read (GET)
- Update (PUT)
- Delete (DELETE)

### `/routes`
API endpoint definitions that connect controllers to URLs. Routes include:
- `/api/auth` - Authentication
- `/api/blogs` - Blog articles
- `/api/authors` - Content authors
- `/api/categories` - Blog categories
- `/api/banners` - Promotional banners
- `/api/votes` - Voting system
- `/api/galleries` - Photo/video galleries

### `/middleware`
- `auth.js` - JWT token verification and role authorization
- `errorHandler.js` - Global error handling
- `validation.js` - Input data validation

## Common Commands

### Development
```bash
npm run dev                  # Start with auto-reload
```

### Production
```bash
npm start                   # Start server
```

### Stop Server
```bash
# Press Ctrl + C in terminal
```

## Testing API Endpoints

### Using cURL

**Get all blogs:**
```bash
curl http://localhost:5000/api/blogs
```

**Create a blog (requires token):**
```bash
curl -X POST http://localhost:5000/api/blogs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "My First Blog",
    "slug": "my-first-blog",
    "shortDescription": "A short description",
    "content": "Full blog content here",
    "featuredImage": "https://example.com/image.jpg",
    "author": "AUTHOR_ID",
    "category": "CATEGORY_ID",
    "status": "published"
  }'
```

### Using Postman

1. Create new collection: "Alash Media API"
2. Add requests for each endpoint
3. Set Authorization header:
   - Type: Bearer Token
   - Token: Your JWT token
4. Use examples from README.md

## Connection Issues

### MongoDB Connection Failed

1. Check MongoDB is running
2. Verify MONGODB_URI in .env
3. For MongoDB Atlas, ensure IP is whitelisted
4. Check internet connection

### Port Already in Use

Change PORT in .env or kill process using port 5000:

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

## Production Deployment

### Before Deploying

1. Change NODE_ENV to "production"
2. Generate secure JWT_SECRET
3. Use MongoDB Atlas for database
4. Set up HTTPS
5. Configure CORS with frontend URL

### Deploy to Services

- **Heroku**: Create Procfile, set environment variables
- **Render**: Push to Git, connect repository
- **DigitalOcean**: Use PM2 for process management
- **AWS**: Deploy to EC2 or Elastic Beanstalk

## Monitoring & Logging

### Check Server Logs
The terminal where server is running shows all logs.

### Common Log Messages
```
Server running on port 5000
MongoDB Connected: localhost

Error messages will show in red
```

## Database Backup

### MongoDB Local
```bash
mongodump --db alash-media --out /backup/
```

### MongoDB Atlas
Use Atlas UI: Database > Backup

## Next Steps

1. Install MongoDB locally or use MongoDB Atlas
2. Start the backend server
3. Test endpoints using Postman or cURL
4. Connect frontend to this backend
5. Deploy to production server

## Support & Troubleshooting

### Check Logs
Look at terminal output for error messages

### Common Issues

**"EADDRINUSE: address already in use"**
- Another process is using port 5000
- Change PORT in .env or kill the process

**"MongoNetworkError: connect ECONNREFUSED"**
- MongoDB is not running
- Check MONGODB_URI in .env

**"jwt malformed"**
- Token is invalid or expired
- Generate new token with login

**"ValidationError"**
- Missing required fields
- Check request body against schema

For more help, check the README.md file or contact the development team.
