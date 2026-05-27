'use strict';

const jwt = require('jsonwebtoken');

/**
 * Generates a JSON Web Token (JWT) based on the provided payload.
 * Utilizes environment variables for the secret key and expiration time.
 * 
 * @param {string|object|Buffer} payload - The data to encode in the token (e.g., { id: user._id, role: user.role })
 * @returns {string} The digitally signed JWT string
 */
const generateToken = (payload) => {
  const secret = process.env.JWT_SECRET || 'fallback_development_secret';
  // Expiration handling using environment variable
  const expiresIn = process.env.JWT_EXPIRES_IN || '30d';

  return jwt.sign(payload, secret, {
    expiresIn,
  });
};

/**
 * Verifies a JSON Web Token (JWT) and decodes its payload.
 * Automatically handles token expiration checks (throws error if expired).
 * 
 * @param {string} token - The JWT string to verify
 * @returns {object|string} The decoded token payload
 * @throws {jwt.JsonWebTokenError | jwt.TokenExpiredError} If token is invalid or expired
 */
const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET || 'fallback_development_secret';
  
  // jwt.verify automatically checks the signature and the expiration (exp claim)
  return jwt.verify(token, secret);
};

module.exports = {
  generateToken,
  verifyToken,
};
