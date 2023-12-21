const COS = require('cos-nodejs-sdk-v5');
const fs = require('fs');
const baseKey = '/picnia/'
const Bucket = 'imagebucket-1322308688';
const Region = 'ap-tokyo';
const cos = new COS({
    SecretKey: '5zznQsk6FCwcT9cv77tQs9HDzfASWWO5',
    SecretId: 'AKIDNdkdIpCMI1bz9597sRCHEzVluthHsPkw'
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

/**
 * @NenoSann
 * @description Store user's avatar, can use to replace existing avatar or add initial avatar,
 *              every user has a folder in cos service that store all previous used avatars.
 *              will return the new uri if success.
 * @param {ReadableStream} avatarData
 * @param {String} userId 
 */
async function storeAvatar(avatarData, userId) {

}
module.exports = { storeImageBucket };