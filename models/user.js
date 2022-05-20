const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname: String,
    lastname: String,
    email: String,
    phone: String,
    region: String,
});

module.exports = mongoose.model('users', userSchema);