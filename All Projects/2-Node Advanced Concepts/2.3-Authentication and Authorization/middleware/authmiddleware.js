const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    if(!token) return res.status(400).json({message: 'Access denied, No token availabe!'});
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded.id;
        next();
    } catch (err) {
        console.error(err.message);
        res.status(500).json({message: 'Server Error', Error: err.message});
    }
}   

module.exports = verifyToken;