const mongoose = require('mongoose')

const ImageSchema = mongoose.Schema({
    name: mongoose.Schema.Types.String,
    data: mongoose.Schema.Types.Buffer,
})

const Image = mongoose.model('Image', ImageSchema);

module.exports = { ImageSchema, Image }; 