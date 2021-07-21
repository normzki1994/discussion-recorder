const express = require("express");
const session = require('express-session');
const mongoose = require("mongoose")

const path = require("path");

const app = express();

app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/audio", express.static(path.join("audio")));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Request-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    next();
});

app.set('trust proxy', 1);

app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
}));

const Discussion = require("./models/discussion");

const userRoutes = require("./router/user");
const discussionRoutes = require("./router/discussion");

const authMiddleware = require("./middleware/auth");

app.get("/", (req, res, next) => {
    if(!req.session.email) {
        return res.redirect("/login");
    }
    res.render("index", { email: req.session.email});
});

app.get("/signup", (req, res, next) => {
    res.render("signup", { email: req.session.email})
})

app.get("/login", (req, res, next) => {
    if(req.session.email) {
        return res.redirect("/");
    }
    res.render("login")
});

app.get("/discussion", (req, res, next) => {
    if(!req.session.email) {
        return res.redirect("/login");
    }

    // Get discussion by observer
    Discussion.find({ observer: req.session.userId })
        .populate("colleague")
        .then(discussions => {
            // res.status(200).send(discussions)
            res.render("discussion", { discussions: discussions, email: req.session.email })
        })
        .catch(error => {
            res.status(500).json({
                message: "Something went wrong",
                error: error
            });
        })
});

app.get("/discussion/:id", async (req, res, next) => {
    if(!req.session.email) {
        return res.redirect("/login");
    }

    const discussionId = req.params.id;

    if(!discussionId) {
        return res.status(500).json({
            message: "No discussion selected"
        });
    }

    const discussion = await Discussion.findOne({ _id: discussionId, observer: req.session.userId }).populate("colleague");

    if(!discussion) {
        return res.status(404).json({
            message: "No discussion found"
        });
    }

    res.render("discussion-item", { discussion: discussion, email: req.session.email })
})

app.use("/api/users", userRoutes);
app.use("/api/discussion", discussionRoutes);

mongoose.connect("mongodb+srv://norman:normans@cluster0.rt5ll.mongodb.net/discussion-recorder?retryWrites=true&w=majority",
{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => {
        console.log("Connected to database");
    })
    .catch(() => {
        console.log("Database connection failed");
    });

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("Listening on port " + port)
});