import prisma from '../config/database.js';
import { generateSlug } from '../utils/helpers.js';

// Helper function to format blog response
const formatBlogResponse = (blog) => {
  const wordCount = blog.content ? blog.content.split(' ').length : 0;
  const readTime = blog.readTime || `${Math.ceil(wordCount / 200)} min read`;
  const viewsText = blog.views >= 1000 ? `${(blog.views / 1000).toFixed(1)}k views` : `${blog.views} views`;

  return {
    id: blog.id,
    title: blog.title,
    contentType: blog.contentType || 'blog',
    subtitle: blog.subtitle || '',
    author: blog.author?.name || '',
    authorId: blog.author?.id,
    date: blog.publishedDate ? blog.publishedDate.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }) : new Date().toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
    readTime,
    views: viewsText,
    image: blog.featuredImage,
    imageCaption: blog.imageCaption || '',
    mainContent: {
      contentOne: blog.mainContentOne,
      contentTwo: blog.mainContentTwo,
    },
    content: blog.contentBlocks || [],
    sections: blog.sections || [],
    shortDescription: blog.shortDescription,
    fullContent: blog.content,
    tags: blog.tags?.map(t => t.tag) || [],
    category: blog.category,
    status: blog.status,
    slug: blog.slug,
    createdAt: blog.createdAt,
    updatedAt: blog.updatedAt,
  };
};

const normalizeContentType = (value) => {
  const normalized = String(value || 'blog').toLowerCase();
  return normalized === 'news' ? 'news' : 'blog';
};

export const createBlog = async (req, res, next) => {
  try {
    const {
      title,
      contentType,
      subtitle,
      shortDescription,
      content,
      featuredImage,
      imageCaption,
      mainContent,
      contentBlocks,
      sections,
      tags,
      author,
      category,
      status,
      readTime,
    } = req.body;

    // console.log('Creating blog with data:', req.body);

    // Generate slug
    const slug = generateSlug(title);

    // Check if slug already exists
    const existingBlog = await prisma.blog.findUnique({
      where: { slug },
    });
    if (existingBlog) {
      return res.status(400).json({
        success: false,
        message: 'Blog with this title already exists',
      });
    }

    // Create blog with related data
    const blog = await prisma.blog.create({
      data: {
        title,
        subtitle,
        slug,
        contentType: normalizeContentType(contentType),
        shortDescription,
        content,
        featuredImage,
        imageCaption,
        mainContentOne: mainContent?.contentOne,
        mainContentTwo: mainContent?.contentTwo,
        status,
        readTime,
        publishedDate: status === 'published' ? new Date() : null,
        authorId: author,
        categoryId: category,
        createdById: req.user?.id ? String(req.user.id) : null,
        tags: {
          create: tags?.map(tag => ({ tag })) || [],
        },
        contentBlocks: {
          create: contentBlocks?.map((block) => ({
            heading: block.heading,
            text: block.text,
          })) || [],
        },
        sections: {
          create: sections?.map((section) => ({
            heading: section.heading,
            text: section.text,
          })) || [],
        },
      },
      include: {
        author: true,
        category: true,
        tags: true,
        contentBlocks: true,
        sections: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: formatBlogResponse(blog),
    });
  } catch (error) {
    next(error);
  }
};

export const getAllBlogs = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      type,
      contentType,
      category,
      author,
      search,
      activeOnly = false,
      sort = 'createdAt',
      order = 'desc',
    } = req.query;

    const where = {};
    if (status) where.status = status;
    if (type || contentType) where.contentType = normalizeContentType(contentType || type);
    if (category) where.categoryId = category;
    if (author) where.authorId = author;
    if (activeOnly === 'true') where.isActive = true;

    const pageNumber = parseInt(page);
    const pageLimit = parseInt(limit);
    const startIndex = (pageNumber - 1) * pageLimit;

    // Handle search - for MySQL, we need to use a different approach
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
      ];
    }

    let orderBy = { createdAt: 'desc' };
    const sortOrder = order === 'asc' ? 'asc' : 'desc';
    if (sort === 'publishedDate') {
      orderBy = { publishedDate: sortOrder };
    } else if (sort === 'views') {
      orderBy = { views: sortOrder };
    } else if (sort === 'title') {
      orderBy = { title: sortOrder };
    }

    const total = await prisma.blog.count({ where });
    const blogs = await prisma.blog.findMany({
      where,
      include: {
        author: true,
        category: true,
        tags: true,
        contentBlocks: true,
        sections: true,
      },
      skip: startIndex,
      take: pageLimit,
      orderBy,
    });

    res.status(200).json({
      success: true,
      data: blogs.map(formatBlogResponse),
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

export const getBlogById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const blog = await prisma.blog.findUnique({
      where: { id },
      include: {
        author: true,
        category: true,
        tags: true,
        contentBlocks: true,
        sections: true,
      },
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    await prisma.blog.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    res.status(200).json({
      success: true,
      data: formatBlogResponse({ ...blog, views: blog.views + 1 }),
    });
  } catch (error) {
    next(error);
  }
};

export const getBlogBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const blog = await prisma.blog.findUnique({
      where: { slug },
      include: {
        author: true,
        category: true,
        tags: true,
        contentBlocks: true,
        sections: true,
      },
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    await prisma.blog.update({
      where: { slug },
      data: { views: { increment: 1 } },
    });

    res.status(200).json({
      success: true,
      data: formatBlogResponse({ ...blog, views: blog.views + 1 }),
    });
  } catch (error) {
    next(error);
  }
};

export const updateBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      contentType,
      subtitle,
      shortDescription,
      content,
      featuredImage,
      imageCaption,
      mainContent,
      contentBlocks,
      sections,
      tags,
      author,
      category,
      status,
      readTime,
    } = req.body;

    let blog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    // Check slug if title changed
    if (title && title !== blog.title) {
      const newSlug = generateSlug(title);
      const existingBlog = await prisma.blog.findUnique({
        where: { slug: newSlug },
      });
      if (existingBlog && existingBlog.id !== id) {
        return res.status(400).json({
          success: false,
          message: 'Blog with this title already exists',
        });
      }
    }

    // Delete old relationships if updating
    if (tags) {
      await prisma.blogTag.deleteMany({
        where: { blogId: id },
      });
    }

    if (contentBlocks) {
      await prisma.blogContentBlock.deleteMany({
        where: { blogId: id },
      });
    }

    if (sections) {
      await prisma.blogSection.deleteMany({
        where: { blogId: id },
      });
    }

    // Update blog
    const updateData = {
      ...(title && { title, slug: generateSlug(title) }),
      ...(contentType && { contentType: normalizeContentType(contentType) }),
      ...(subtitle !== undefined && { subtitle }),
      ...(shortDescription && { shortDescription }),
      ...(content && { content }),
      ...(featuredImage && { featuredImage }),
      ...(imageCaption !== undefined && { imageCaption }),
      ...(mainContent && {
        mainContentOne: mainContent.contentOne,
        mainContentTwo: mainContent.contentTwo,
      }),
      ...(readTime && { readTime }),
      ...(status && {
        status,
        publishedDate: status === 'published' && !blog.publishedDate ? new Date() : blog.publishedDate,
      }),
      ...(author && { authorId: author }),
      ...(category && { categoryId: category }),
    };

    // Handle new relationships
    if (tags) {
      updateData.tags = {
        create: tags.map(tag => ({ tag })),
      };
    }

    if (contentBlocks) {
      updateData.contentBlocks = {
        create: contentBlocks.map((block) => ({
          heading: block.heading,
          text: block.text,
        })),
      };
    }

    if (sections) {
      updateData.sections = {
        create: sections.map((section) => ({
          heading: section.heading,
          text: section.text,
        })),
      };
    }

    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: updateData,
      include: {
        author: true,
        category: true,
        tags: true,
        contentBlocks: true,
        sections: true,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Blog updated successfully',
      data: formatBlogResponse(updatedBlog),
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBlog = async (req, res, next) => {
  try {
    const { id } = req.params;

    const blog = await prisma.blog.delete({
      where: { id },
    })

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
