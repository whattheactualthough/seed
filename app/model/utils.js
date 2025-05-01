const db = require("../../db/connection");

const checkColumnExists = async (table_name, column_name) => {
    const query = `SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = $1 
    AND column_name = $2 
    LIMIT 1;`;
  
    const result = await pool.query(query, [table_name, column_name]);
  
    if (result.rows.length === 0) {
      return Promise.reject({ 
        status: 400, 
        msg: "Bad request" });
    }
  
    return true;
  };




module.exports = {checkColumnExists}