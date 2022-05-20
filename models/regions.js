const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const regionSchema = new Schema({
    id: Number,
    region: String,
});

module.exports = mongoose.model('regions', regionSchema);