const { User } = require('../../MongoDB/Model/Users');
const { QueryCommentsById } = require('./QueryComments');
const { UserPostQuery } = require('./QueryPost');
/**
 * @description Query user's profile by its userId, using in  
 *              picnia/Profile/:user
 * @param {string} userId 
 * @returns {Promise}
 */
async function QueryUserProfileById(userId) {
    return new Promise(async (resolve, reject) => {
        try {
            if (!userId) {
                throw new Error('userid not provided');
            }
            const user = await User.findById(userId)?.lean();
            if (!user) {
                throw new Error('User not existed');
            }
            const { userName, email, avatar, userBrief = null, posts, _id, likePosts, savedPosts } = user;
            const userProfile = {
                userId: _id,
                userName,
                email,
                avatar: avatar ? `https://${avatar}` : 'null',
                userBrief: userBrief || null,
                posts: posts || [],
                likePosts: likePosts || [],
                savedPosts: savedPosts || []
            }
            resolve(userProfile);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    })
}

async function QueryUserProfileByUsername(userName) {
    return new Promise(async (resolve, reject) => {
        try {
            const userId = await QueryUserIdByUsername(userName);
            const user = await QueryUserProfileById(userId);
            resolve(user);
        } catch (err) {
            reject(err);
            console.error(err);
        }
    })
}

/**
 * @description Query a user by username in mongodb
 * @param {string} userName 
 * @returns {Promise<string | null>} user's mongodb id
 */
async function QueryUserIdByUsername(userName) {
    return new Promise(async (resolve, reject) => {
        try {
            if (userName) {
                const user = await User.findOne({ userName: userName }).exec();
                const userId = user?._id;
                if (userId) {
                    resolve(userId)
                } else {
                    resolve(null);
                }
            } else {
                throw new Error('userName not provided');
            }
        } catch (error) {
            reject(error);
            console.log(error);
        }
    })
}

/**
 * Query a user by its email, return a user model or null, depends on 
 * query result, reject if error occur.
 * @param {string} userEmail 
 * @returns {Promise<User | null>}
 */
async function QueryUserByEmail(userEmail) {
    return new Promise(async (resolve, reject) => {
        try {
            if (userEmail) {
                const user = await User.findOne({ email: userEmail }).exec();
                user ? resolve(user) : resolve(null);
            } else {
                resolve(null);
            }
        } catch (error) {
            reject(error);
            console.error(error);
        }
    })
}
module.exports = { QueryUserProfileById, QueryUserIdByUsername, QueryUserProfileByUsername, QueryUserByEmail }