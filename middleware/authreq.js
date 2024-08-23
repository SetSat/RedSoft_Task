const jwt = require('jsonwebtoken')

const jwtsecretkey = process.env.JWTTOKEN

module.exports = (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader) return res.status(401).json({ message: "Access Denied" });

    const token = authHeader.replace('Bearer ', '');

    try {
        const verified = jwt.verify(token, jwtsecretkey);
        req.user = verified;
        console.log("verified", verified)
        next();
    } catch (error) {
        console.log("Token verification error:", error.message);
        res.status(400).json({ message: "Invalid Token" });
    }
}