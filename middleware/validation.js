// Blog validations
export const validateBlog = (req, res, next) => {
  const { title, shortDescription, content, featuredImage, author, category } = req.body;

  const errors = [];

  if (!title) errors.push('Title is required');
  if (!shortDescription) errors.push('Short description is required');
  if (!content) errors.push('Content is required');
  if (!featuredImage) errors.push('Featured image is required');
  if (!author) errors.push('Author is required');
  if (!category) errors.push('Category is required');

  if (shortDescription && shortDescription.length > 200) {
    errors.push('Short description must be less than 200 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

// Author validations
export const validateAuthor = (req, res, next) => {
  const { name, shortBio } = req.body;

  const errors = [];

  if (!name) errors.push('Name is required');
  if (!shortBio) errors.push('Short bio is required');

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

// Category validations
export const validateCategory = (req, res, next) => {
  const { name } = req.body;

  const errors = [];

  if (!name) errors.push('Name is required');

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

// Banner validations
export const validateBanner = (req, res, next) => {
  const { title, image } = req.body;

  const errors = [];

  if (!title) errors.push('Title is required');
  if (!image) errors.push('Image is required');

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

export const validateVote = (req, res, next) => {
  const { title, options } = req.body;

  const errors = [];

  if (!title) errors.push('Title is required');
  if (!options || !Array.isArray(options) || options.length < 2) {
    errors.push('Vote must have at least 2 options');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

// Login/Register validation
export const validateAuth = (req, res, next) => {
  const { email, password } = req.body;

  const errors = [];

  if (!email) errors.push('Email is required');
  if (!password) errors.push('Password is required');

  // Email validation
  if (email && !isValidEmail(email)) {
    errors.push('Invalid email format');
  }

  // Password validation
  if (password && password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

// Helper function to validate email
const isValidEmail = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};
