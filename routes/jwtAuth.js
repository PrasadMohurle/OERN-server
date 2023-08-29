const router = require('express').Router();
const oracledb = require('oracledb');
const { hash, compare } = require('bcrypt');
const jwtGenerator = require('../utils/jwtGenerator');
const validInfo = require('../middleware/validInfo');
const authorization = require('../middleware/authorization');

function closeConnection(connection) {
    connection.release(function (err) {
        if (err) {
            console.log(err.message);
        }
    });
}

// route for register
router.post('/register', validInfo, async (req, res) => {
    try {
        console.log('regiter api');
        // 1. destructure the req.body (user_name, user_email, user_password)
        const { user_name, user_email, user_password, role } = req.body;
        console.log(role);

        // 2. check if user exists, if true then throw corresponding error
        const connection = await oracledb.getConnection();
        const user = await connection.execute(
            'SELECT * FROM hpcl_users WHERE user_email = :user_email',
            [user_email],
            { autoCommit: true }
        );

        if (user.rows.length > 0) {
            console.log(user.rows);
            return res.status(401).send('User Allready Exists.');
        }

        // 3. if user does not exist, bcrypt the user_password
        const hashedPassword = await hash(user_password, 10);
        console.log(hashedPassword);
        // 4. enter the new user inside our database
        await connection.execute(
            'INSERT INTO hpcl_users (user_name, user_email, user_password, user_role) VALUES (:user_name, :user_email, :hashedPassword, :role)',
            [user_name, user_email, hashedPassword, role],
            { autoCommit: true }
        );
        // 5. retrieve the newly inserted user
        const new_user = await connection.execute(
            'SELECT * FROM hpcl_users WHERE user_email = :user_email',
            [user_email],
            { autoCommit: true }
        );

        // 6. generate the JWT Token
        const token = jwtGenerator(new_user.rows[0].user_id);
        const user_role = 'watcher';
        res.json({ token, user_role });
        closeConnection(connection);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
        closeConnection(connection);
    }
});

// route for login
router.post('/login', validInfo, async (req, res) => {
    try {
        // 1. Destructure the inconing data from req.body (user_email, user_password)
        const { user_email, user_password } = req.body;

        // 2. Check if user does not exist, then throw the corresponding error
        const connection = await oracledb.getConnection();
        const user = await connection.execute(
            'SELECT * FROM hpcl_users WHERE user_email = :user_email',
            [user_email],
            { autoCommit: true }
        );

        if (user.rows.length === 0) {
            return res.status(401).send({message:'Email is Invalid.'});
        }

        // 3. if user exist then check if the incomming password is same as tre password saved in database.
        // Convert the array to a JSON object
        const userJson = user.rows[0].reduce((acc, val, index) => {
            const key = user.metaData[index].name.toLowerCase();
            acc[key] = val;
            return acc;
        }, {});

        const validPassword = await compare(
            user_password,
            userJson.user_password
        ); // this gives a boolean
        if (!validPassword) {
            return res.status(401).send({message: 'Password is Invalid'});
        }

        // 4. give the user the jwt token
        const token = jwtGenerator(userJson.user_id);
        res.json({ token, user_role: userJson.user_role });
        closeConnection(connection);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
        closeConnection(connection);
    }
});

//route for verify the jwtToken
router.get('/verify', authorization, async (req, res) => {
    try {
        res.json(true);
        
        closeConnection(connection);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error');
        closeConnection(connection);
    }
});

module.exports = router;
