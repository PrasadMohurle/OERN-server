// This code checks if token is present or not, if there, then it verifies the token.

const jwt = require('jsonwebtoken');
require('dotenv').config();

const authorization = async (req, res, next) => {
    //1. Get token from header after a fetch request
    const jwtToken = req.header('token');

    //2. Check if token is present
    if (!jwtToken) {
        return res.status(403).json('No Token, Authorization Denied');
    } else {
        try {
            //3. Verify token
            const payload = jwt.verify(jwtToken, process.env.jwtSecret);
            req.user = payload.user;
            next();
        } catch (err) {
            console.error(err.message);
            return res.status(403).json('Token is not Valid');
        }
    }
};
module.exports = authorization;
