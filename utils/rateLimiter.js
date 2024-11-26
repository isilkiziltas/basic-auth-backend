const rateLimit = require("express-rate-limit");

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: "Çok fazla istek gönderildi, lütfen bir süre bekleyin.",
});

module.exports = rateLimiter;