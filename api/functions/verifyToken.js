require("dotenv").config();
const jwt = require("jsonwebtoken");
const secretKey  = process.env.SECRET_KEY;

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ msg: 'No se proporcionó el token' });
    }
    // Verify the token
    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ msg: 'Token inválido o expirado' });
        }
        req.user = user;
        next();
    });
};

module.exports = { verifyToken };
