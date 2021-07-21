const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, email: true, unique: true },
    password: { type: String, required: true, min: 8, max: 100 }
});

const User = mongoose.model("User", userSchema);

module.exports = User;