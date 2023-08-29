const router = require('express').Router();
const oracledb = require('oracledb');
const authorization = require('../middleware/authorization');

function closeConnection(connection) {
    connection.release(function (err) {
        if (err) {
            console.log(err.message);
        }
    });
}

router.get('/', authorization, async (req, res) => {
    try {
        const connection = await oracledb.getConnection();
        const user = await connection.execute(
            'SELECT user_name, user_email ,user_role FROM hpcl_users WHERE user_id = :user_id',
            [req.user], // after authorization middleware is succefully done, we get access to req.user which has the payload
            { autoCommit: true }
        );
        res.json(user.rows[0]);
        closeConnection(connection);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error');
        closeConnection(connection);
    }
});

function getEnabledLinks(rowData, metaData) {
    const enabledLinks = [];
    for (let i = 1; i < metaData.length; i++) {
        const columnName = metaData[i].name;
        const columnValue = rowData[i];
        if (columnValue === 1) {
            enabledLinks.push(columnName);
        }
    }
    return enabledLinks;
}

// route to display the side bar links based on the role of user
router.get('/role/:role', async (req, res) => {
    try {
        const role = req.params.role;
        const connection = await oracledb.getConnection();
        const user = await connection.execute(
            `SELECT * FROM hpcl_user_access_matrix WHERE user_role = '${role}'`
        );

        const formattedData = getEnabledLinks(user.rows[0], user.metaData);
        res.json(formattedData);
        closeConnection(connection);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error 123');
        closeConnection(connection);
    }
});

//route to display the user data to admin
router.get('/users', async (req, res) => {
    try {
        const connection = await oracledb.getConnection();
        const user = await connection.execute(
            `SELECT user_name, user_email ,user_role, created_on FROM hpcl_users ORDER BY user_name ASC`,
        );
        res.json(user);
        closeConnection(connection);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error 123');
        closeConnection(connection);
    }
});


// route to delete a user
router.delete('/users/:email', async (req, res) => {
    const userEmail = req.params.email;

    try {
        const connection = await oracledb.getConnection();
        
        // Delete the user based on the provided email
        await connection.execute(
            `DELETE FROM hpcl_users WHERE user_email = :email`,
            [userEmail],
            { autoCommit: true }
        );

        res.json({ message: 'User deleted successfully' });
        closeConnection(connection);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error');
        closeConnection(connection);
    }
});

// route to update a user's role
router.put('/updateRole/:email', async (req, res) => {
    const userEmail = req.params.email;
    const { role } = req.body;

    try {
        const connection = await oracledb.getConnection();
        
        // Update the user's role based on the provided email
        await connection.execute(
            `UPDATE hpcl_users SET user_role = :role WHERE user_email = :email`,
            [role, userEmail],
            { autoCommit: true }
        );

        res.json({ message: 'User role updated successfully' });
        closeConnection(connection);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error');
        closeConnection(connection);
    }
});

module.exports = router;
