const express = require("express");
const multer = require("multer");

const Discussion = require("../models/discussion");
const User = require("../models/user");

const router = express.Router();

const MIME_TYPE = {
    "audio/webm": "webm",
    "audio/wav": "wav"
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "audio/")
    },
    filename: (req, file, callback) => {
        const ext = MIME_TYPE[file.mimetype];
        callback(null, Date.now() + "-" + file.originalname)
    }
});

const upload = multer({storage: storage});

router.post("", upload.single("file"), async (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    var audioPath = url + "/audio/" + req.file.filename;

    var colleagueEmail = req.body.colleague;

    var colleague = await User.findOne({ email: colleagueEmail });

    if(!colleague) {
        return res.status(500).json({ message: "Colleague not found" })
    }

    const discussion = new Discussion({
        observer: req.session.userId,
        location: req.body.location,
        colleague: colleague,
        subject: req.body.subject,
        outcome: req.body.outcome,
        audioPath: audioPath
    });

    discussion.save().then(result => {
        // res.status(200).json({
        //     message: "Discussion save successfully",
        //     result: result
        // })
        res.redirect("/discussion")
    }).catch(error => {
        res.status(500).json({
            message: "Something went wrong",
            error: error
        })
    })
});

// Get discussion by observer
// router.get("", (req, res, next) => {
//     Discussion.find({ observer: req.session.UserId })
//         .populate("colleague")
//         .then(discussions => {
//             res.status(200).send(discussions)
//         })
//         .catch(error => {
//             res.status(500).json({
//                 message: "Something went wrong",
//                 error: error
//             })
//         })
// })

module.exports = router;