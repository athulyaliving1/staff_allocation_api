var db = require('../db/connection.js').mysql_pool;




// API endpoint to fetch countries

const getcountries = (req, res) => {
  const query = "SELECT DISTINCT branch_country_id, branch_country FROM master_branches";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching countries:", err);
      res.status(500).send("An error occurred");
    } else {
      res.json(results);
    }
  });
};

const getstates = (req, res) => {
  const { branch_country_id } = req.query;

  console.log('branch_country_id:', branch_country_id);

  const query = `SELECT DISTINCT branch_state,branch_state_id FROM master_branches WHERE branch_country_id = ${branch_country_id}`;

  db.query(query, [branch_country_id], (err, results) => {
    if (err) {
      console.error("Error fetching states:", err);
      res.status(500).send("An error occurred");
    } else {
      res.json(results);
    }
  });
};

// API endpoint to fetch cities based on the state

const getcities = (req, res) => {

  const {branch_state_id} = req.query;

  // Replace this with your database query to fetch cities based on the state
  const query = `SELECT DISTINCT branch_city,branch_city_id FROM master_branches WHERE branch_state_id =${branch_state_id}`;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching cities:", err);
      res.status(500).send("An error occurred");
    } else {
      res.json(results);
    }
  });

}



module.exports = { getcities, getstates, getcountries }