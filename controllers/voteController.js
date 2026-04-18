import prisma from '../config/database.js';

export const createVote = async (req, res, next) => {
  try {
    const { title, description, image, options, startDate, endDate } = req.body;

    if (!options || options.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Vote must have at least 2 options',
      });
    }

    const vote = await prisma.vote.create({
      data: {
        title,
        description,
        image,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
        options: {
          create: options.map((opt) => ({
            text: opt,
            votes: 0,
          })),
        },
      },
      include: {
        options: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Vote created successfully',
      data: vote,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllVotes = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, activeOnly = false } = req.query;

    let where = {};

    if (activeOnly === 'true') {
      const now = new Date();
      where = {
        isActive: true,
        startDate: { lte: now },
        isExpired: false,
      };
    }

    const startIndex = (page - 1) * limit;

    const total = await prisma.vote.count({ where });
    const votes = await prisma.vote.findMany({
      where,
      skip: startIndex,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        options: true,
      },
    });

    res.status(200).json({
      success: true,
      data: votes,
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

export const getVoteById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const vote = await prisma.vote.findUnique({
      where: { id },
      include: {
        options: true,
      },
    });

    if (!vote) {
      return res.status(404).json({
        success: false,
        message: 'Vote not found',
      });
    }

    res.status(200).json({
      success: true,
      data: vote,
    });
  } catch (error) {
    next(error);
  }
};

export const updateVote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, image, isActive, endDate, isExpired, options } = req.body;

    let vote = await prisma.vote.findUnique({
      where: { id },
    });

    if (!vote) {
      return res.status(404).json({
        success: false,
        message: 'Vote not found',
      });
    }

    const updateData = {
      ...(title && { title }),
      ...(description !== undefined && { description }),
      ...(image && { image }),
      ...(isActive !== undefined && { isActive }),
      ...(endDate && { endDate: new Date(endDate) }),
      ...(isExpired !== undefined && { isExpired }),
    };

    if (options !== undefined) {
      if (!Array.isArray(options) || options.length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Vote must have at least 2 options',
        });
      }

      updateData.options = {
        deleteMany: {},
        create: options.map((opt) => ({
          text: typeof opt === 'string' ? opt : opt.text,
          votes: 0,
        })),
      };
    }

    const updatedVote = await prisma.vote.update({
      where: { id },
      data: updateData,
      include: {
        options: true,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Vote updated successfully',
      data: updatedVote,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteVote = async (req, res, next) => {
  try {
    const { id } = req.params;

    const vote = await prisma.vote.delete({
      where: { id },
    });

    if (!vote) {
      return res.status(404).json({
        success: false,
        message: 'Vote not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Vote deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const castVote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { optionId } = req.body;

    const vote = await prisma.vote.findUnique({
      where: { id },
      include: {
        options: true,
      },
    });

    if (!vote) {
      return res.status(404).json({
        success: false,
        message: 'Vote not found',
      });
    }

    if (vote.isExpired) {
      return res.status(400).json({
        success: false,
        message: 'This vote has expired',
      });
    }

    if (!vote.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This vote is inactive',
      });
    }

    const option = vote.options.find(opt => opt.id === optionId);
    if (!option) {
      return res.status(400).json({
        success: false,
        message: 'Invalid option',
      });
    }

    const updatedOption = await prisma.voteOption.update({
      where: { id: optionId },
      data: { votes: { increment: 1 } },
    });

    const updatedVote = await prisma.vote.findUnique({
      where: { id },
      include: {
        options: true,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Vote cast successfully',
      data: updatedVote,
    });
  } catch (error) {
    next(error);
  }
};
