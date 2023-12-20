const COS = require('cos-nodejs-sdk-v5');
const fs = require('fs');
const baseKey = '/picnia/'
const Bucket = 'imagebucket-1322308688';
const Region = 'ap-tokyo';
const cos = new COS({
    SecretKey,
    SecretId
});
/**
 * @NenoSann
 * @description store the image into the tencent©️ ObjectStoreService, return a Promise.
 */
async function storeImageBucket(data, key) {
    return new Promise((resolve, reject) => {
        try {
            cos.putObject({
                Bucket,
                Region,
                Key: baseKey + key,
                StorageClass: 'STANDARD',
                Body: data,
            }).then((response) => {
                resolve(response)
            }).catch((err) => {
                throw err;
            })
        } catch {
            console.log('error at store image bucket!');
            reject('ERROR');
        }
    })
}
module.exports = { storeImageBucket };