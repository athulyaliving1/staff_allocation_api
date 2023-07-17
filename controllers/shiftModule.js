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


const shiftRoster = (req, res) => {
    // const query = "SELECT id,branch_id,user_id,room_no,bed_no,duty_type_id,floor,section_id,staff_id,staff_resource,shift_id,staff_source,shift,staff_payable,service_payable,schedule_date, FROM staff_allocation"

    const query = "SELECT * FROM staff_allocation"
    db.query(query, (err, result) => {
        if (err) {
            console.error("Error fetching staff:", err);
            res.status(500).send("Error fetching shift");
        } else {
            res.json(result);
        }
    });


}


const shiftRosterGetbyId = (req, res) => {
    const shiftId = req.params.id;

    const query = `SELECT * FROM staff_allocation WHERE id = "${shiftId}"`
    db.query(query, (err, result) => {
        if (err) {
            console.error("Error fetching staff:", err);
            res.status(500).send("Error fetching shift");
        }
        else {
            res.json(result);
            console.log(result);
        }
    });

}







const shiftRosterUpdate = (req, res) => {
    const shiftId = req.params.id;
    const {
        branch_id,
        user_id,
        room_no,
        bed_no,
        duty_type_id,
        floor,
        section_id,
        staff_id,
        staff_source,
        shift,
        staff_payable,
        service_payable
    } = req.body;

    const sql = `UPDATE staff_allocation SET branch_id = ?, user_id = ?, room_no = ?, bed_no = ?, duty_type_id = ?, floor = ?, section_id = ?, staff_id = ?, staff_source = ?, shift = ?, staff_payable = ?, service_payable = ? WHERE id = ?`;
    const values = [
        branch_id,
        user_id,
        room_no,
        bed_no,
        duty_type_id,
        floor,
        section_id,
        staff_id,
        staff_source,
        shift,
        staff_payable,
        service_payable,
        shiftId
    ];

    db.query(sql, values, (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // Shift successfully updated
        res.status(200).json({ status: 200, error: null, response: 'Shift updated' });
        res.json(result);
    });
};







module.exports = { shiftSearch, shiftRoster, shiftRosterUpdate, shiftRosterGetbyId };