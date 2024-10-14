// const redis = require('redis');
// const mongoose = require('mongoose');   //imporing redis package

// const redisClient = redis.createClient();  // Creating client

// redisClient.on('connect', () => {    // Connect client to redis
//     console.log('Connected to redis...');
// });


// const cacheData = (key, value, expiration = 3600) => {     // function for data caching takes three parameters
//     redisClient.setEx(key, expiration, JSON.stringify(value), (err, data) => {    // convert JS object into string format
//         if (err) {
//             console.error('Error caching data...', err);
//         } else {
//             console.log('Data cached successfully...', data);
//         }
//     });
// };


// const getCachedData = (key, callback) => {     // function for retrieving cached data with callback
//     redisClient.get(key, (err, data) => {      // use get method to obtained cached data associated with specific key
//         if (err) {
//             console.error('Error retreiving cached data...', err);
//             callback(err, null);
//         } else {

//            if (data) {
//             console.log('Data retrieved from cached successfully...', data);
//             callback(null, JSON.parse(data));
//            } else {
//             console.error('No data found in cache for key...', err);
//             callback(null, null);
//            }

//         }
//     });

// }




            // Task related to caching:
            
// You are working on a User Management System in a MERN stack project where frequent queries are made to the database to retrieve user information with it's email. These repeated database queries result in increased latency and load on the MongoDB server.

// Your task is to implement caching using Redis to reduce the number of database queries and improve the system's performance. Specifically, you need to cache the user data after it is retrieved from MongoDB, and use the cached data for subsequent requests if available.

// const redis = require('redis');
// const mongoose = require('mongoose');

// const redisClient = redis.createClient();

// redisClient.on('connect', () => {
//     console.log('Successfully connected to redis...');
// });

// const getUserDataFromCache = async (email) => {
//     try {
//         // check if user data exists in cache
//         const cachedUser = await redisClient.get({ email });
//         if (cachedUser) {
//             console.log('User successfully fetched from cache: ', JSON.parse(cachedUser));
//             return res.JSON({ cachedUser });
//         }

//         // check if user is not exist in cache, then fetch it from mongodb
//         const user = await user.findOne({ email });
//         if (user) {
//             const redisUser = await redisClient.set(email, JSON.stringify(user));   // stores fetched user from mongodb into redis (cache)
//             console.log('User successfully fetched from mongoDB: ', redisUser);
//             return user;
//         }

//         return null;
//     } catch (err) {
//         console.error(err.message);
//     }
// }

// getUserDataFromCache('shaban123@gmail.com');





// const mongoose = require('mongoose');
// const redis = require('redis');

// const redisClient = redis.createClient();

// redisClient.on('connect', () => console.log('Successfully connected to redis...'));

// const getUserDataFromCache = async(email) => {
//     try {
//         const cachedUser = await redisClient.get(email);
//         if(cachedUser) {
//             console.log('User successfully fetched from redis: ', JSON.parse(cachedUser));
//             return res.JSON({cachedUser});
//         }

//         const user = await user.findOne({email});
//         if(user) {
//             const redisUser = await redisClient.set(email, JSON.stringify(user));
//             console.log('User successfully fetched from mongodb: ', redisUser);
//             return redisUser;
//         }
//     } catch (error) {
//         console.error(error.message);
//     }
// }

// getUserDataFromCache('helo12@gmail.com');