const oracledb = require('oracledb');

const dbConfig = {
    user: 'c##prasad',
    password: 'prasad',
    connectString: 'localhost:1521/xe',
};

async function initialize() {
    try {
        await oracledb.createPool(dbConfig);
        console.log('OracleDB connection, pool created.');
    } catch (err) {
        console.error('Error creating OracleDB connection pool:', err);
    }
}

module.exports = {
    initialize, // Export the initialize function
  };