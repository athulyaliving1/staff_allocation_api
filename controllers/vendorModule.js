// newregister function for post login route

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



  const getVendor = async (req, res) => {
    try {
      const sql = "SELECT * FROM staff_vendor_details";
      
      db.query(sql, (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        
        res.status(200).json({ status: 200, error: null, response: result });
        console.log(result);
        
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  




module.exports = {newvendorregister,getVendor};
