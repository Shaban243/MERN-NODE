// We can improve our response time of our data retrieval operations when we want to fetch data from database. 
// This can be done through query optimization techniques. 
// Query is optimized through using mongoDB operators and avoiding un-necessary queries. 


                                        // Best Practices: //

// Use projections to return only the fields you need.
// Limit the number of documents returned with .limit().
// Use sorting on indexed fields.
// Avoid using $where, which can be slow.


// Write a function that fetch userdata through projection and limit

const getUserData = async () => {
    try {
        const users = await users.find( {}, 'name email')
        .sort({ age: 1 })
        .limit(10);
        
        console.log('The users fetch data is: ', users);
    } catch (error) {
        console.error(error.message);
    }
}
            getUserData();



