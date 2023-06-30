// newregister function for post login route

const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
var db=require('../db/connection.js').mysql_pool;

const newvendorregister = async (req, res) => {
    try {
        const { name, address, email, abbr, contact } = req.body;
        const registerSql = 'INSERT INTO staff_vendor_details (`name`, `address`, `email`, `abbr`,`contact`) VALUES (?, ?, ?, ?,?)';
        const registerValues = [name, address, email, abbr,contact];
  
          db.query(registerSql, registerValues, (registerErr, result) => {
            if (registerErr) {
              console.error('Error executing the query:', registerErr);
              return res.status(500).json({ error: 'Internal Server Error' });
            }
  
            return res.json({ status: 'success',ans: result });
          });

        
    } catch (error) {
      
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };

module.exports = {newvendorregister};
