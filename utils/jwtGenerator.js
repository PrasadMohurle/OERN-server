const jwt = require('jsonwebtoken');
require('dotenv').config(); // this allows us to get access to all our env variables.

const jwtGenerator = (user_id) =>{
    const payload = { user: user_id };
    return jwt.sign(payload, process.env.jwtSecret, { expiresIn: '1hr' });
}

module.exports = jwtGenerator;
