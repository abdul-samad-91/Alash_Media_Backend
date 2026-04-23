import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// FIX for __dirname in ES Modules

// Import routes
import authRoutes from './routes/auth.js';
import blogRoutes from './routes/blogs.js';
import authorRoutes from './routes/authors.js';
import categoryRoutes from './routes/categories.js';
import bannerRoutes from './routes/banners.js';
import voteRoutes from './routes/votes.js';
import galleryRoutes from './routes/galleries.js';
import uploadRoutes from './routes/upload.js';
import dashboardRoutes from './routes/dashboard.js';

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// Connect to database
await connectDB();

// Middleware
app.use(cors({
  origin: [
    "https://alash-media-admin.vercel.app",
    "alash-media-five.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true
}));
app.options("*", cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


// Basic route
app.get('/', (req , res) => {
  res.json({
    success: true,
    message: 'Backend is running',
    timestamp: new Date(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/galleries', galleryRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejection
process.on('unhandledRejection', (err) => {
  console.error(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
