const express = require('express');
const cors = require('cors');
const oracledb = require('oracledb');
const { initialize } = require('./db');
const router = require('./routes/jwtAuth');

const app = express();

const PORT = 5000;

//   MIDDLEWARE ****************************************************************************************************************************
app.use(cors()); //  helps diff domain apps to interact with each other (eg;- server running on 5000 and react app on localhost:3000)
app.use(express.json()); //   helps us to get access to req.body to get the data from client side

initialize();

// ROUTES **********************************************************************************************************************************
// ROUTE (register and login)
app.use('/auth', router);

//  ROUTE(dashboard)
app.use('/dashboard', require('./routes/dashboard'));

app.listen(PORT, () => {
    console.log(`Server is up and running on PORT:${PORT} OR http://localhost:${PORT}`);
});


























// app.get('/users', async (req, res) => {
//     try {
//         const connection = await oracledb.getConnection();
//         const result = await connection.execute('SELECT * FROM hpcl_users');
//         res.json(result.rows);
//         connection.close();
//     } catch (err) {
//         console.error('Error getting users:', err);
//         res.status(500).json({ error: 'An error occurred' });
//     }
// });

// app.post('/users', async (req, res) => {
//     try {
//         const { user_name, user_email, user_password } = req.body;

//         const connection = await oracledb.getConnection();
//         const result = await connection.execute(
//             'INSERT INTO hpcl_users (user_name, user_email, user_password) VALUES (:user_name, :user_email, :user_password)',
//             [user_name, user_email, user_password],
//             { autoCommit: true }
//         );
//         res.json({ message: 'User added successfully...' });
//         connection.close();
//     } catch (err) {
//         console.error('Error adding user:', err);
//         res.status(500).json({ error: 'An error occurred', message: err.message });
//     }
// });
