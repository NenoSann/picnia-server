const { Image } = require('../MongoDB/Model/Image')

/**
 * @NenoSann
 * @param {{
 *      name:String,
 *      buffer:ArrayBuffer
 * }} image
 * @description: 接受一个对象，分别表示name和buffer，并将其存入mongoDB中
 */
function createImage(image) {
    const { name, buffer } = image;
    const newImage = Image({
        name: name,
        data: buffer,
    })
        .save()
        .then((saved) => {
            console.log('New image saved');
        })
        .catch((error) => {
            throw error;
        })

}

module.exports = createImage;