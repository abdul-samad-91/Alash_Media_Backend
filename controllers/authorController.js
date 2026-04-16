import prisma from '../config/database.js';
import { generateSlug } from '../utils/helpers.js';

export const createAuthor = async (req, res, next) => {
  try {
    const { name, photo, shortBio } = req.body;

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
    const { page = 1, limit = 10, search } = req.query;

    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { shortBio: { contains: search } },
      ];
    }

    const startIndex = (page - 1) * limit;

    const total = await prisma.author.count({ where });
    const authors = await prisma.author.findMany({
      where,
      skip: startIndex,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: authors,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        limit: parseInt(limit),
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
      where: { id: parseInt(id) },
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
      where: { authorId: parseInt(id) },
    });
    const blogs = await prisma.blog.findMany({
      where: { authorId: parseInt(id) },
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
    const { name, photo, shortBio } = req.body;

    let author = await Author.findById(id);

    if (!author) {
      return res.status(404).json({
        success: false,
        message: 'Author not found',
      });
    }

    if (name && name !== author.name) {
      const newSlug = generateSlug(name);
      const existingAuthor = await Author.findOne({ slug: newSlug, _id: { $ne: id } });
      if (existingAuthor) {
        return res.status(400).json({
          success: false,
          message: 'Author with this name already exists',
        });
      }
      author.slug = newSlug;
      author.name = name;
    }

    if (photo) author.photo = photo;
    if (shortBio) author.shortBio = shortBio;

    await author.save();

    res.status(200).json({
      success: true,
      message: 'Author updated successfully',
      data: author,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAuthor = async (req, res, next) => {
  try {
    const { id } = req.params;

    const author = await Author.findByIdAndDelete(id);

    if (!author) {
      return res.status(404).json({
        success: false,
        message: 'Author not found',
      });
    }

    // Optionally: Clear author reference from blogs or delete associated blogs
    await Blog.updateMany({ author: id }, { author: null });

    res.status(200).json({
      success: true,
      message: 'Author deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
