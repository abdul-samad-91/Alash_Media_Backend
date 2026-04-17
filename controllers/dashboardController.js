import prisma from '../config/database.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalBlogs,
      publishedBlogs,
      draftBlogs,
      totalAuthors,
      totalCategories,
      activeBanners,
      totalVotes,
      totalGalleries,
      photoGalleries,
      videoGalleries,
    ] = await Promise.all([
      prisma.blog.count(),
      prisma.blog.count({ where: { status: 'published' } }),
      prisma.blog.count({ where: { status: 'draft' } }),
      prisma.author.count(),
      prisma.category.count(),
      prisma.banner.count({ where: { isActive: true } }),
      prisma.vote.count({ where: { isActive: true } }),
      prisma.gallery.count(),
      prisma.gallery.count({ where: { type: 'photo' } }),
      prisma.gallery.count({ where: { type: 'video' } }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalBlogs,
        publishedBlogs,
        draftBlogs,
        totalAuthors,
        totalCategories,
        activeBanners,
        totalVotes,
        totalGalleries,
        photoGalleries,
        videoGalleries,
      },
    });
  } catch (error) {
    next(error);
  }
};