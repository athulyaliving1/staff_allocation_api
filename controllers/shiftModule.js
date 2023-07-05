var db = require('../db/connection.js').mysql_pool;


const shiftSearch = (req, res) => {
    const query = "SELECT id,shift_name FROM master_shifts;";
    db.query(query, (err, result) => {
        if (err) {
            console.error("Error fetching staff:", err);
            res.status(500).send("Error fetching shift");
        } else {
            res.json(result);
        }
    });
};










module.exports = { shiftSearch };