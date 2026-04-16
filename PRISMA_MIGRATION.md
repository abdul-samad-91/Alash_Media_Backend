# Prisma Migration Guide

## Overview
This project has been successfully migrated from MongoDB with Mongoose to MySQL with Prisma ORM.

## What Has Changed

### 1. Database Layer
- **FROM**: MongoDB with Mongoose ODM
- **TO**: MySQL with Prisma ORM
- **Benefits**: Better type safety, automated migrations, powerful query builder

### 2. Dependencies Updated
**Removed:**
- `mongoose`: MongoDB ODM

**Added:**
- `@prisma/client`: Prisma Client
- `mysql2`: MySQL driver
- `prisma`: Prisma CLI (dev dependency)

### 3. Project Structure Changes

**Models** (Removed)
- Models are now defined in: `prisma/schema.prisma`
- No more individual model files needed

**Database Config**
- `config/database.js`: Now uses Prisma instead of Mongoose

**Controllers** (Updated)
- All controllers updated to use Prisma queries
- Import changes: `prisma` instance instead of model classes
- Query method changes (see examples below)

### 4. Key Implementation Changes

#### Database Connection
**Old (Mongoose):**
```javascript
import mongoose from 'mongoose';
const conn = await mongoose.connect(process.env.MONGODB_URI);
```

**New (Prisma):**
```javascript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
await prisma.$connect();
```

#### Creating Records
**Old:**
```javascript
const blog = await Blog.create({ title, content });
```

**New:**
```javascript
const blog = await prisma.blog.create({
  data: { title, content }
});
```

#### Finding Records
**Old:**
```javascript
const blog = await Blog.findById(id);
const blogs = await Blog.find({ status: 'published' });
```

**New:**
```javascript
const blog = await prisma.blog.findUnique({ where: { id: parseInt(id) } });
const blogs = await prisma.blog.findMany({ where: { status: 'published' } });
```

#### Updating Records
**Old:**
```javascript
const blog = await Blog.findByIdAndUpdate(id, updateData, { new: true });
```

**New:**
```javascript
const blog = await prisma.blog.update({
  where: { id: parseInt(id) },
  data: updateData
});
```

#### Relationships
**Old:**
```javascript
const blog = await Blog.findById(id).populate('author category');
```

**New:**
```javascript
const blog = await prisma.blog.findUnique({
  where: { id: parseInt(id) },
  include: { author: true, category: true }
});
```

### 5. Nested Data Handling

**MongoDB (Stored as arrays in documents):**
- Blog.contentBlocks: Array of objects
- Vote.options: Array of objects
- Gallery.items: Array of objects

**MySQL (Normalized tables):**
- Blog → BlogContentBlock (Junction table)
- Vote → VoteOption (Junction table)
- Gallery → GalleryItem (Junction table)

### 6. Important Notes on IDs
- MongoDB: String ObjectIds (e.g., "507f1f77bcf86cd799439011")
- MySQL/Prisma: Integer IDs (e.g., 1, 2, 3)
- All ID parsing: Convert to `parseInt()` when from strings

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Database URL
Edit `.env` file:
```env
DATABASE_URL="mysql://user:password@localhost:3306/alash_media"
```

### 3. Create Database and Run Migrations
```bash
npx prisma migrate dev --name init
```

### 4. Generate Prisma Client (if needed)
```bash
npx prisma generate
```

### 5. Verify Database
```bash
npx prisma studio
```

## Testing

### Test the API
```bash
curl http://localhost:5000/api/health
```

### Seed Database (Optional)
Create a `prisma/seed.js` file to populate test data:
```javascript
import prisma from '../config/database.js';

async function main() {
  await prisma.category.create({
    data: {
      name: 'Technology',
      slug: 'technology',
      description: 'Tech articles'
    }
  });
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(e => { console.error(e); process.exit(1); });
```

Run seeds:
```bash
node prisma/seed.js
```

## Common Prisma Commands

```bash
# Run migrations
npx prisma migrate dev --name <name>

# View schema in UI
npx prisma studio

# Check migration status
npx prisma migrate status

# Reset database (dev only!)
npx prisma migrate reset

# Generate types from schema
npx prisma generate

# Format schema
npx prisma format
```

## Troubleshooting

### Connection Issues
1. Verify MySQL is running
2. Check DATABASE_URL format
3. Verify user credentials
4. Ensure database exists

### Type Errors in Controllers
- Check that IDs are parsed with `parseInt()`
- Ensure you're using correct field names from Prisma schema

### Migration Conflicts
```bash
# If migrations are out of sync
npx prisma migrate resolve --rolled-back <migration-name>
```

## File Changes Summary

### Updated Files
- `package.json` - Dependencies updated
- `config/database.js` - Now uses Prisma
- `server.js` - Async database initialization
- `SETUP.md` - New MySQL + Prisma setup instructions
- `controllers/authController.js` - Prisma queries
- `controllers/blogController.js` - Prisma queries
- `controllers/authorController.js` - Prisma queries
- `controllers/categoryController.js` - Prisma queries
- `controllers/bannerController.js` - Prisma queries
- `controllers/galleryController.js` - Prisma queries
- `controllers/voteController.js` - Prisma queries

### New Files
- `prisma/schema.prisma` - Database schema definition
- `.env.example` - Environment variables template
- `PRISMA_MIGRATION.md` - This file

### Removed Files (No Longer Needed)
- `models/Blog.js`
- `models/Author.js`
- `models/Category.js`
- `models/Banner.js`
- `models/Gallery.js`
- `models/Vote.js`
- `models/User.js`

## Next Steps

1. Install dependencies: `npm install`
2. Setup MySQL database
3. Configure DATABASE_URL in .env
4. Run migrations: `npx prisma migrate dev --name init`
5. Start server: `npm run dev`
6. Test API endpoints
7. Update frontend if needed to handle new response structures

## Support Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Prisma MySQL Guide](https://www.prisma.io/docs/reference/database-reference/connection-urls#mysql)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
