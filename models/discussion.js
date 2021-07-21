const mongoose = require("mongoose");

const discussionSchema = new mongoose.Schema({
    observer: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    date: { type: Date, default: Date.now() },
    location: { type: String, required: true },
    colleague: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    subject: { type: String, required: true },
    outcome: { type: String, required: true },
    audioPath: { type: String, required: true }
});

const Discussion = mongoose.model("Discussion", discussionSchema);

module.exports = Discussion;