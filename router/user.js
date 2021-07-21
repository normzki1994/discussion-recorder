const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/user");

const router = express.Router();

router.post("/signup", (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
    
        user.save().then(result => {
            req.session.email = req.body.email;
            res.redirect("/");
        }).catch(error => {
            console.log(error);
            res.status(500).json({
                message: "Something went wrong",
                error: error
            });
        });
    });
});

router.post("/login", async (req, res, next) => {
    const fetchedUser = await User.findOne({ email: req.body.email });
    if(!fetchedUser) {
        return res.status(401).json({
            message: "Authentication failed",
            user: fetchedUser
        });
    }

    const isPasswordCorrect = await bcrypt.compare(req.body.password, fetchedUser.password);

    if(!isPasswordCorrect) {
        return res.status(401).json({
            message: "Authentication failed",
            isPasswordCorrect: isPasswordCorrect
        });
    }

    req.session.email = fetchedUser.email;
    req.session.userId = fetchedUser._id;
    res.redirect("/")
});

router.post("/logout", (req, res, next) => {
    req.session.destroy();
    res.redirect("/");
})

module.exports = router;