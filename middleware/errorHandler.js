export const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Prisma validation errors
  if (err.name === 'PrismaClientValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid request payload',
    });
  }

  // Prisma unique constraint
  if (err.code === 'P2002') {
    const fields = err.meta?.target || [];
    return res.status(400).json({
      success: false,
      message: `${fields.join(', ') || 'Field'} already exists`,
    });
  }

  // Prisma not found
  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      message: 'Resource not found',
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors,
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      success: false,
      message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
    });
  }

  // Default error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Error',
  });
};

export const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
};
