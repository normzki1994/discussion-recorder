const jwt = require("jsonwebtoken");
const http = require("http");

module.exports = (req, res, next) => {
    try {
        const token = req.header("token");
        console.log("token is " + token)
        const decodedToken = jwt.verify(token, "jwt_private_key");
        req.userData = { userId: decodedToken.userId, email: decodedToken.email };
        next();
    } catch(error) {
        res.redirect("/login")
        // res.status(401).json({ message: "Authentication failed" })
    }
}