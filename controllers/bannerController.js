import prisma from '../config/database.js';

export const createBanner = async (req, res, next) => {
  try {
    const { title, description, image, link, position, startDate, endDate } = req.body;

    const banner = await prisma.banner.create({
      data: {
        title,
        description,
        image,
        link,
        position: position || 0,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Banner created successfully',
      data: banner,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllBanners = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, activeOnly = false } = req.query;

    let where = {};

    if (activeOnly === 'true') {
      const now = new Date();
      where = {
        isActive: true,
        startDate: { lte: now },
        OR: [
          { endDate: null },
          { endDate: { gte: now } },
        ],
      };
    }

    const startIndex = (page - 1) * limit;

    const total = await prisma.banner.count({ where });
    const banners = await prisma.banner.findMany({
      where,
      skip: startIndex,
      take: parseInt(limit),
      orderBy: [{ position: 'asc' }, { createdAt: 'desc' }],
    });

    res.status(200).json({
      success: true,
      data: banners,
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

export const getBannerById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const banner = await prisma.banner.findUnique({
      where: { id },
    });

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found',
      });
    }

    res.status(200).json({
      success: true,
      data: banner,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBanner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, image, link, position, isActive, startDate, endDate } = req.body;

    let banner = await prisma.banner.findUnique({
      where: { id },
    });

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found',
      });
    }

    const updateData = {
      ...(title && { title }),
      ...(description !== undefined && { description }),
      ...(image && { image }),
      ...(link !== undefined && { link }),
      ...(position !== undefined && { position }),
      ...(isActive !== undefined && { isActive }),
      ...(startDate && { startDate: new Date(startDate) }),
      ...(endDate && { endDate: new Date(endDate) }),
    };

    const updatedBanner = await prisma.banner.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      message: 'Banner updated successfully',
      data: updatedBanner,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBanner = async (req, res, next) => {
  try {
    const { id } = req.params;

    const banner = await prisma.banner.delete({
      where: { id },
    });

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Banner deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
