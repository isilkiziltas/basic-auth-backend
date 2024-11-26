const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendEmail } = require("../utils/emailservice");

// Token oluşturucu yardımcı fonksiyon
const generateToken = (id, secret, expiresIn) => {
  return jwt.sign({ id }, secret, { expiresIn });
};

// Kayıt olma
const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Şifre geçerlilik kontrolü
    if (!password || password.length < 8 || !/[A-Z]/.test(password) || !/\d/.test(password)) {
      return res.status(400).json({ message: "Şifre en az 8 karakter, bir büyük harf ve bir rakam içermelidir." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Bu e-posta adresi zaten kayıtlı." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      isVerified: false,
    });

    await user.save();

    // E-posta doğrulama bağlantısı gönder
    const emailToken = generateToken(user._id, process.env.EMAIL_SECRET, "1d");
    const verifyLink = `${process.env.CLIENT_URL}/verify_email?token=${emailToken}`;
    await sendEmail(email, "E-posta Doğrulama", `E-posta doğrulama bağlantınız: ${verifyLink}`);

    res.status(201).json({ message: "Kayıt başarılı, lütfen e-posta adresinizi doğrulayın." });
  } catch (error) {
    next(error);
  }
};

// Giriş yapma
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı." });

    if (!user.isVerified) return res.status(401).json({ message: "E-posta adresinizi doğrulayın." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Geçersiz şifre." });

    // Access ve Refresh Token oluşturma
    const accessToken = generateToken(user._id, process.env.JWT_SECRET, "15m");
    const refreshToken = generateToken(user._id, process.env.REFRESH_SECRET, "7d");

    res.json({ accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
};

// Refresh token ile yeni Access token oluşturma
const refreshToken = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) return res.status(400).json({ message: "Refresh token gereklidir." });

    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);
    const newAccessToken = generateToken(decoded.id, process.env.JWT_SECRET, "15m");

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ message: "Geçersiz veya süresi dolmuş refresh token." });
  }
};

// E-posta doğrulama
const verifyEmail = async (req, res, next) => {
  try {
    console.log("Verifying email..."); 
    const { token } = req.query;

    if (!token) return res.status(400).json({ message: "Token gereklidir." });

    const decoded = jwt.verify(token, process.env.EMAIL_SECRET);

    await User.findByIdAndUpdate(decoded.id, { isVerified: true });
    res.json({ message: "E-posta başarıyla doğrulandı." });
  } catch (error) {
    console.error("Error in verifyEmail:", error); 
    next(error);
  }
};

// Şifre sıfırlama talebi
const resetPasswordRequest = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "E-posta gereklidir." });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı." });

    const resetToken = generateToken(user._id, process.env.JWT_SECRET, "1h");
    const resetLink = `${process.env.CLIENT_URL}/reset_password?token=${resetToken}`;

    await sendEmail(email, "Şifre Sıfırlama Talebi", `Şifre sıfırlama bağlantınız: ${resetLink}`);
    res.json({ message: "Şifre sıfırlama bağlantısı gönderildi." });
  } catch (error) {
    next(error);
  }
};

// Şifre sıfırlama
const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token ve yeni şifre gereklidir." });
    }

    if (newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/\d/.test(newPassword)) {
      return res.status(400).json({ message: "Şifre en az 8 karakter, bir büyük harf ve bir rakam içermelidir." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });

    res.json({ message: "Şifre başarıyla sıfırlandı." });
  } catch (error) {
    next(error);
  }
};
const logout = (req, res) => {
    res.clearCookie('accessToken');  // Erişim token'ını temizle
    res.clearCookie('refreshToken'); // Refresh token'ını temizle
    res.json({ message: 'Başarıyla çıkış yapıldı.' });
  };
  // authController.js
const privateRoute = (req, res) => {
    res.json({ message: "Bu rota yalnızca giriş yapmış kullanıcılar için geçerlidir." });
  };
  
module.exports = {
  signup,
  login,
  refreshToken,
  verifyEmail,
  resetPasswordRequest,
  resetPassword,
  logout,
  privateRoute,
  
};