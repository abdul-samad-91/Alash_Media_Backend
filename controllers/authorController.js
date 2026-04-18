import prisma from '../config/database.js';
import { generateSlug } from '../utils/helpers.js';

export const createAuthor = async (req, res, next) => {
  try {
    const { name, photo, shortBio, isActive } = req.body;

    const slug = generateSlug(name);

    // Check if slug already exists
    const existingAuthor = await prisma.author.findUnique({
      where: { slug },
    });
    if (existingAuthor) {
      return res.status(400).json({
        success: false,
        message: 'Author with this name already exists',
      });
    }

    const author = await prisma.author.create({
      data: {
        name,
        slug,
        photo,
        shortBio,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Author created successfully',
      data: author,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllAuthors = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, activeOnly = false } = req.query;

    const where = {};
    if (activeOnly === 'true') {
      where.isActive = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { shortBio: { contains: search } },
      ];
    }

    const pageNumber = parseInt(page);
    const pageLimit = parseInt(limit);
    const startIndex = (pageNumber - 1) * pageLimit;

    const total = await prisma.author.count({ where });
    const authors = await prisma.author.findMany({
      where,
      skip: startIndex,
      take: pageLimit,
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: authors,
      pagination: {
        total,
        pages: Math.ceil(total / pageLimit),
        currentPage: pageNumber,
        limit: pageLimit,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAuthorById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 5 } = req.query;

    const author = await prisma.author.findUnique({
      where: { id },
    });

    if (!author) {
      return res.status(404).json({
        success: false,
        message: 'Author not found',
      });
    }

    // Get related blogs with pagination
    const startIndex = (page - 1) * limit;
    const totalBlogs = await prisma.blog.count({
      where: { authorId: id },
    });
    const blogs = await prisma.blog.findMany({
      where: { authorId: id },
      skip: startIndex,
      take: parseInt(limit),
      orderBy: { publishedDate: 'desc' },
      include: {
        category: true,
      },
    });

    res.status(200).json({
      success: true,
      data: {
        ...author,
        blogs,
        blogPagination: {
          total: totalBlogs,
          pages: Math.ceil(totalBlogs / limit),
          currentPage: parseInt(page),
          limit: parseInt(limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAuthorBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { page = 1, limit = 5 } = req.query;

    const author = await prisma.author.findUnique({
      where: { slug },
    });

    if (!author) {
      return res.status(404).json({
        success: false,
        message: 'Author not found',
      });
    }

    // Get related blogs with pagination
    const startIndex = (page - 1) * limit;
    const totalBlogs = await prisma.blog.count({
      where: { authorId: author.id },
    });
    const blogs = await prisma.blog.findMany({
      where: { authorId: author.id },
      skip: startIndex,
      take: parseInt(limit),
      orderBy: { publishedDate: 'desc' },
      include: {
        category: true,
      },
    });

    res.status(200).json({
      success: true,
      data: {
        ...author,
        blogs,
        blogPagination: {
          total: totalBlogs,
          pages: Math.ceil(totalBlogs / limit),
          currentPage: parseInt(page),
          limit: parseInt(limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateAuthor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, photo, shortBio, isActive } = req.body;

    const author = await prisma.author.findUnique({
      where: { id },
    });

    if (!author) {
      return res.status(404).json({
        success: false,
        message: 'Author not found',
      });
    }

    const updateData = {};

    if (name && name !== author.name) {
      const newSlug = generateSlug(name);
      const existingAuthor = await prisma.author.findFirst({
        where: {
          slug: newSlug,
          NOT: { id },
        },
      });
      if (existingAuthor) {
        return res.status(400).json({
          success: false,
          message: 'Author with this name already exists',
        });
      }

      updateData.slug = newSlug;
      updateData.name = name;
    }

    if (photo !== undefined) updateData.photo = photo;
    if (shortBio !== undefined) updateData.shortBio = shortBio;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedAuthor = await prisma.author.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      message: 'Author updated successfully',
      data: updatedAuthor,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAuthor = async (req, res, next) => {
  try {
    const { id } = req.params;

    const author = await prisma.author.findUnique({
      where: { id },
    });

    if (!author) {
      return res.status(404).json({
        success: false,
        message: 'Author not found',
      });
    }

    const relatedBlogsCount = await prisma.blog.count({
      where: { authorId: id },
    });

    if (relatedBlogsCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete author with related blogs. Reassign or delete those blogs first.',
      });
    }

    await prisma.author.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Author deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
