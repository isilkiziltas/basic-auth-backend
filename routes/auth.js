const express = require("express");
const { 
  signup, 
  login, 
  logout, 
  refreshToken,
  verifyEmail, 
  resetPasswordRequest, 
  resetPassword, 
  privateRoute 
} = require('../controllers/authcontroller.js');

const authMiddleware = require("../middleware/authmiddleware.js"); 
const router = express.Router(); 
router.post("/signup", signup);
router.post("/login", login); 
router.delete("/logout", logout); 
router.post("/refresh", refreshToken);
router.get("/verify_email", verifyEmail); 
router.post("/reset_password_request", resetPasswordRequest); 
router.post("/reset_password", resetPassword); 
router.get("/private", authMiddleware, privateRoute); 
router.get("/", (req, res) => {
    res.send("Auth API is working!");
  });
module.exports = router; 