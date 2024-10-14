const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    console.log(token);
    if(!token) return res.status(400).json({message: 'Access denied, No token availabe!'});
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id, role: decoded.role };
        next();
    } catch (err) {
        console.error(err.message);
        res.status(500).json({message: 'Server Error', Error: err.message});
    }
}   



const isAdmin = (req, res, next) => {
    const { role } = req.user;
    if(role === 'admin') next();

    return res.status(403).json({message: 'You are not allowed to permit the role'});
}

module.exports = verifyToken;