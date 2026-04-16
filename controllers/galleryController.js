import prisma from '../config/database.js';

export const createGallery = async (req, res, next) => {
  try {
    const { title, description, type, items, category } = req.body;

    if (!['photo', 'video'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Type must be either "photo" or "video"',
      });
    }

    const gallery = await prisma.gallery.create({
      data: {
        title,
        description,
        type,
        category: category || 'general',
        items: {
          create: items?.map((item, index) => ({
            title: item.title,
            url: item.url,
            thumbnail: item.thumbnail,
            description: item.description,
            displayOrder: item.displayOrder || index,
          })) || [],
        },
      },
      include: {
        items: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Gallery created successfully',
      data: gallery,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllGalleries = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, type, category } = req.query;

    let where = {};
    if (type) where.type = type;
    if (category) where.category = category;

    const startIndex = (page - 1) * limit;

    const total = await prisma.gallery.count({ where });
    const galleries = await prisma.gallery.findMany({
      where,
      skip: startIndex,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: galleries,
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

export const getGalleryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const gallery = await prisma.gallery.findUnique({
      where: { id: parseInt(id) },
      include: {
        items: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: 'Gallery not found',
      });
    }

    res.status(200).json({
      success: true,
      data: gallery,
    });
  } catch (error) {
    next(error);
  }
};

export const updateGallery = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, items, category, isActive } = req.body;

    let gallery = await prisma.gallery.findUnique({
      where: { id: parseInt(id) },
    });

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: 'Gallery not found',
      });
    }

    // Delete old items if updating
    if (items) {
      await prisma.galleryItem.deleteMany({
        where: { galleryId: parseInt(id) },
      });
    }

    const updateData = {
      ...(title && { title }),
      ...(description !== undefined && { description }),
      ...(category && { category }),
      ...(isActive !== undefined && { isActive }),
    };

    if (items) {
      updateData.items = {
        create: items.map((item, index) => ({
          title: item.title,
          url: item.url,
          thumbnail: item.thumbnail,
          description: item.description,
          displayOrder: item.displayOrder || index,
        })),
      };
    }

    const updatedGallery = await prisma.gallery.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        items: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Gallery updated successfully',
      data: updatedGallery,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteGallery = async (req, res, next) => {
  try {
    const { id } = req.params;

    const gallery = await prisma.gallery.delete({
      where: { id: parseInt(id) },
    });

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: 'Gallery not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Gallery deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const addGalleryItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, url, thumbnail, description } = req.body;

    const gallery = await prisma.gallery.findUnique({
      where: { id: parseInt(id) },
      include: { items: true },
    });

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: 'Gallery not found',
      });
    }

    const newItem = await prisma.galleryItem.create({
      data: {
        title,
        url,
        thumbnail,
        description,
        displayOrder: gallery.items.length,
        galleryId: parseInt(id),
      },
    });

    const updatedGallery = await prisma.gallery.findUnique({
      where: { id: parseInt(id) },
      include: {
        items: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Item added to gallery',
      data: updatedGallery,
    });
  } catch (error) {
    next(error);
  }
};

export const removeGalleryItem = async (req, res, next) => {
  try {
    const { id, itemId } = req.params;

    const gallery = await prisma.gallery.findUnique({
      where: { id: parseInt(id) },
    });

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: 'Gallery not found',
      });
    }

    await prisma.galleryItem.delete({
      where: { id: parseInt(itemId) },
    });

    const updatedGallery = await prisma.gallery.findUnique({
      where: { id: parseInt(id) },
      include: {
        items: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Item removed from gallery',
      data: updatedGallery,
    });
  } catch (error) {
    next(error);
  }
};

export const updateGalleryItem = async (req, res, next) => {
  try {
    const { id, itemId } = req.params;
    const { title, url, thumbnail, description, displayOrder } = req.body;

    const gallery = await prisma.gallery.findUnique({
      where: { id: parseInt(id) },
    });

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: 'Gallery not found',
      });
    }

    const item = await prisma.galleryItem.findUnique({
      where: { id: parseInt(itemId) },
    });

    if (!item || item.galleryId !== parseInt(id)) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    const updateData = {
      ...(title && { title }),
      ...(url && { url }),
      ...(thumbnail && { thumbnail }),
      ...(description !== undefined && { description }),
      ...(displayOrder !== undefined && { displayOrder }),
    };

    await prisma.galleryItem.update({
      where: { id: parseInt(itemId) },
      data: updateData,
    });

    const updatedGallery = await prisma.gallery.findUnique({
      where: { id: parseInt(id) },
      include: {
        items: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Item updated',
      data: updatedGallery,
    });
  } catch (error) {
    next(error);
  }
};
