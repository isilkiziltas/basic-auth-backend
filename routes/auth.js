const express = require("express");
const { 
  signup, 
  login, 
  logout, 
  refreshToken,
  verifyEmail, 
  resetPasswordRequest, 
  resetPassword, 
  privateRoute // privateRoute fonksiyonunu doğrudan import edin
} = require('../controllers/authcontroller.js');

const authMiddleware = require("../middleware/authmiddleware.js"); // Middleware doğru şekilde dahil ediliyor

const router = express.Router(); // Router oluşturuluyor

// Kullanıcı işlemleri için rotalar
router.post("/signup", signup); // Kayıt olma
router.post("/login", login); // Giriş yapma
router.delete("/logout", logout); // Çıkış yapma
router.post("/refresh", refreshToken); // Token yenileme

// E-posta doğrulama ve şifre sıfırlama işlemleri için rotalar
router.get("/verify_email", verifyEmail); // E-posta doğrulama
router.post("/reset_password_request", resetPasswordRequest); // Şifre sıfırlama isteği
router.post("/reset_password", resetPassword); // Şifre sıfırlama

// Özel (yetkilendirilmiş) bir rota
router.get("/private", authMiddleware, privateRoute); // Middleware korumalı özel rota
router.get("/", (req, res) => {
    res.send("Auth API is working!");
  });
module.exports = router; // Router dışa aktarılıyor