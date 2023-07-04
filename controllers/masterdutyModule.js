var db = require('../db/connection.js').mysql_pool;



const getmasterduty = (req, res) => {
    const query = "SELECT * FROM staff_master_duty";

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching duty:", err);
            res.status(500).send("Error fetching duty");
        } else {
            res.json(results);
        }
    });
};

















module.exports = { getmasterduty };