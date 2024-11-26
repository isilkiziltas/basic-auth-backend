const express = require("express");
const path = require('path');
const dotenv = require("dotenv");
dotenv.config();
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const rateLimiter = require("./utils/rateLimiter");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorMiddleware");
dotenv.config();
connectDB();

const app = express();
function configureSecurity() {
app.use(bodyParser.json());
app.use(cors());
app.use(helmet()); 
app.use(bodyParser.json()); // JSON body parsing middleware
app.use(bodyParser.urlencoded({ extended: true })); // URL encoded parsing middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS.split(","),
    methods: ["GET", "POST", "DELETE"],
  })
); }// CORS ayarları
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet()); 
app.use(rateLimiter); 
// Routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes); // /api/auth altında auth işlemleri

// Hata Yönetimi
app.use(errorHandler); // Hata middleware'ini son olarak ekleyin
app.get("/", (req, res) => {
    res.send("API is running...");  // Basit bir mesaj dönüyoruz
  });
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})