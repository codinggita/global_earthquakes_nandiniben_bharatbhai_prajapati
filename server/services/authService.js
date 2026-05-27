'use strict';

const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { generateToken } = require('../utils/jwtUtils');

/**
 * Registers a new user in the system.
 * Validates unique email, uses the User model (which hashes the password),
 * generates a JWT token, and returns a secure payload without the password.
 * 
 * @param {object} userData - The user details from the request body
 * @returns {Promise<ApiResponse>} A 201 response containing the token and user data
 * @throws {ApiError} 400 if the email is already in use
 */
const registerUser = async (userData) => {
  const { name, email, password, role } = userData;

  // 1. Validate if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw ApiError.badRequest('A user with this email already exists.');
  }

  // 2. Create the user (Password hashing is securely handled by Mongoose pre-save middleware)
  const user = await User.create({
    name,
    email,
    password,
    role
  });

  // 3. Generate JWT token
  const token = generateToken({ id: user._id, role: user.role });

  // 4. Construct secure user response (omitting the password)
  const secureUser = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };

  return ApiResponse.created('User registered successfully.', {
    user: secureUser,
    token
  });
};

/**
 * Authenticates a user and returns a token.
 * Validates credentials, checks the bcrypt password hash,
 * and generates a JWT token on success.
 * 
 * @param {object} credentials - User email and password
 * @returns {Promise<ApiResponse>} 200 response with secure user object and token
 * @throws {ApiError} 401 if email or password is invalid
 */
const loginUser = async (credentials) => {
  const { email, password } = credentials;

  // 1. Basic validation
  if (!email || !password) {
    throw ApiError.badRequest('Please provide both email and password.');
  }

  // 2. Find the user by email
  // The password field is explicitly selected here because it has `select: false` in the schema
  const user = await User.findOne({ email }).select('+password');

  // 3. Verify user exists and password is correct using the schema method
  if (!user || !(await user.matchPassword(password))) {
    throw ApiError.unauthorized('Invalid email or password.');
  }

  // 4. Generate JWT token
  const token = generateToken({ id: user._id, role: user.role });

  // 5. Construct secure user response
  const secureUser = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };

  return ApiResponse.ok('User logged in successfully.', {
    user: secureUser,
    token
  });
};

module.exports = {
  registerUser,
  loginUser
};
