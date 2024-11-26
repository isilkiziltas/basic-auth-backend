const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const configureSecurity = (app) => {

  app.use(helmet());

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: "Too many requests from this IP, please try again later"
  });

  
  app.use(cors({
    origin: process.env.ALLOWED_ORIGINS.split(",") 
  }));

  
  app.use(limiter);


};

module.exports = configureSecurity;