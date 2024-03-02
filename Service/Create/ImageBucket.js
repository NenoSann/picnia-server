const COS = require('cos-nodejs-sdk-v5');
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
 * @description store multiple images into Tencent©️ ObjectStoreService, return a Promise.all
 * @param {[*]} datas 
 * @param {string} key 
 * @returns {Promise}
 */
async function storeMultipleImage(datas, keys) {
    const promiseArr = [];
    datas.forEach((data, index) => promiseArr.push(storeImageBucket(data, keys[index])));
    return Promise.all(promiseArr);
}

/**
 * @NenoSann
 * @description Store user's avatar, can use to replace existing avatar or add initial avatar,  
 *              every user has a folder in cos service that store all previous used avatars.  
 *              will return the new uri if success.
 * @param {ReadableStream} avatarData
 * @param {String} userId 
 * @param {Number} version
 * @param {String} imgType
 * @returns {Promise} promise that resolve cos response or err 
 */
async function storeAvatar(avatarData, userId, version, imgType) {
    return new Promise(async (resolve, reject) => {
        try {
            cos.putObject({
                Bucket,
                Region,
                // like: /picnia/avatar/27942178jf1da/2.jpg
                Key: `${baseKey}/avatar/${userId}/${version}.${imgType}`,
                StorageClass: "STANDARD",
                Body: avatarData
            }).then((response) => {
                resolve(response);
            }).catch((err) => {
                throw err;
            })
        } catch (err) {
            console.error('cos fail at storing avatar!');
            reject(err);
        }
    })
}
module.exports = { storeImageBucket, storeAvatar, storeMultipleImage };