const auth = (req, res, next) => {
    const token = req.header('Authorization');
    if(!token) return res.status(404).json({ message: 'No token availabe, access denied!'});
};

module.exports = auth;