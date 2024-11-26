const rateLimit = require("express-rate-limit");

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100, // Her IP için 100 istek limiti
  message: "Çok fazla istek gönderildi, lütfen bir süre bekleyin.",
});

module.exports = rateLimiter;