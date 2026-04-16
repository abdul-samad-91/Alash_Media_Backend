import prisma from '../config/database.js';
import { generateSlug } from '../utils/helpers.js';

export const createCategory = async (req, res, next) => {
  try {
    const { name, description, parentCategory } = req.body;

    const slug = generateSlug(name);

    // Check if slug already exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists',
      });
    }

    // If parentCategory is provided, verify it exists
    if (parentCategory) {
      const parent = await prisma.category.findUnique({
        where: { id: parseInt(parentCategory) },
      });
      if (!parent) {
        return res.status(400).json({
          success: false,
          message: 'Parent category not found',
        });
      }
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        parentCategoryId: parentCategory ? parseInt(parentCategory) : null,
      },
      include: {
        parentCategory: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCategories = async (req, res, next) => {
  try {
    const { parentOnly = false } = req.query;

    const where = parentOnly === 'true' ? { parentCategoryId: null } : {};

    const categories = await prisma.category.findMany({
      where,
      include: {
        parentCategory: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
      include: {
        parentCategory: true,
      },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // Get subcategories
    const subcategories = await prisma.category.findMany({
      where: { parentCategoryId: parseInt(id) },
    });

    res.status(200).json({
      success: true,
      data: {
        ...category,
        subcategories,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, parentCategory } = req.body;

    let category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    if (name && name !== category.name) {
      const newSlug = generateSlug(name);
      const existingCategory = await prisma.category.findFirst({
        where: {
          slug: newSlug,
          NOT: {
            id: parseInt(id),
          },
        },
      });
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: 'Category with this name already exists',
        });
      }
    }

    if (parentCategory !== undefined) {
      if (parentCategory) {
        const parent = await prisma.category.findUnique({
          where: { id: parseInt(parentCategory) },
        });
        if (!parent) {
          return res.status(400).json({
            success: false,
            message: 'Parent category not found',
          });
        }
      }
    }

    const updateData = {
      ...(name && { name, slug: generateSlug(name) }),
      ...(description && { description }),
      ...(parentCategory !== undefined && {
        parentCategoryId: parentCategory ? parseInt(parentCategory) : null,
      }),
    };

    const updatedCategory = await prisma.category.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        parentCategory: true,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if category has subcategories
    const hasSubcategories = await prisma.category.findFirst({
      where: { parentCategoryId: parseInt(id) },
    });
    if (hasSubcategories) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with subcategories',
      });
    }

    const category = await prisma.category.delete({
      where: { id: parseInt(id) },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
