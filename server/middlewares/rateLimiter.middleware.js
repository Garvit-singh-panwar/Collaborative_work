import rateLimit from 'express-rate-limit';

// This limiter is for sensitive routes like Login/Signup
// limit reqs  max req 5 
export const authLimiter = rateLimit({
  windowMs: 3 * 60 * 1000, // 3 minutes lockout
  max: 5, // Allow 3 requests per window
  message: {
    success: false,
    message: "Too many attempts. Please try again after 3 minutes."
  },
  standardHeaders: true, // Returns info in headers
  legacyHeaders: false,
  // Skip check for you while developing
  skip: (req, res) => process.env.NODE_ENV !== 'production' 
});



// This is a general limiter for all other API calls
// limit req max req 15
export const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 15, // Allow 15 requests per minute
  message: {
    success: false,
    message: "High traffic detected. Please slow down."
  }
});
