const { Image } = require('../../MongoDB/Model/Image');
const COS = require('cos-nodejs-sdk-v5');
const fs = require('fs');
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

/**
 * @NenoSann
 * @description store the image into the tencent©️ ObjectStoreService, return a Promise.
 */
const Bucket = 'imagebucket-1322308688';
const Region = 'ap-tokyo';

async function storeImageBucket(SecretId, SecretKey) {
    const cos = new COS({
        SecretKey,
        SecretId
    });
    cos.putObject({
        Bucket,
        Region,
        Key: '/avatar/miku.jpg',
        StorageClass: 'STANDARD',
        Body: fs.createReadStream('uploads/miku.jpg'),
        onProgress: function (progressData) {
            console.log(JSON.stringify(progressData));
        }
    }, function (err, data) {
        if (err) {
            console.error('error at store COS', err);
        } else {
            console.log('success store cos', data);
            return data.Location;
        }
    })
}
module.exports = { createImage, storeImageBucket };