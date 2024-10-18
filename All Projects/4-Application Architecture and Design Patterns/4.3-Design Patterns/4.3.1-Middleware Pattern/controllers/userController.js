const getProfile = (req, res) => {
    console.log('User Profile Data: ', data);
    res.json({ message: 'User profile data'});
};

module.exports = getProfile;

