const logger = (req, res, next) => {
    console.log(`${req.method} requests for ${req.url}`);

    
    next();
}

module.exports = logger;