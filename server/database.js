const { Pool } = require('pg');

// const pool = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'postgres',
//     password: 'postgres',
//     port: 5432,
// });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

//Function to read data
// const readData = (request, response) => {
//     pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
//         if (error) {
//             throw error;
//         }
//         response.status(200).json(results.rows);
//     })
// }

// Function to read data
const readData = async (queryText, params) => {
    const { rows } = await pool.query(queryText, params);
    return rows;
  };
  
  // Function to insert data
  const insertData = async (queryText, params) => {
    const { rows } = await pool.query(queryText, params);
    return rows;
  };
  
  // Function to update data
  const updateData = async (queryText, params) => {
    const { rows } = await pool.query(queryText, params);
    return rows;
  };
  
  // Function to delete data
  const deleteData = async (queryText, params) => {
    const { rowCount } = await pool.query(queryText, params);
    return rowCount; // Number of rows affected by the DELETE operation
  };
  
  module.exports = {
    readData,
    insertData,
    updateData,
    deleteData,
  };


