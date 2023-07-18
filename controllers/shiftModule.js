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
        res.json(result[0]);
    });
};


const shiftRosterBranchesUpdate = (req, res) => {
    const Id = req.params.id;

    const query = `SELECT DISTINCT master_branches.branch_name, staff_allocation.branch_id 
                   FROM staff_allocation 
                   JOIN master_branches ON master_branches.id = staff_allocation.branch_id 
                   WHERE staff_allocation.id = ?`;

    db.query(query, [Id], (err, result) => {
        if (err) {
            console.error("Error Fetching Branch:", err);
            return res.status(500).json({ error: "Error fetching Branch" });
        }

        res.json(result);
        console.log(result);
    });
};


const shiftRosterDutyFetch = (req, res) => {
    const Id = req.params.id;

    const query = `SELECT DISTINCT staff_allocation.duty_type_id,staff_master_duty.id,staff_master_duty.duty_name FROM staff_allocation JOIN staff_master_duty ON staff_master_duty.id = staff_allocation.duty_type_id WHERE staff_allocation.id =${Id}; `

    db.query(query, [Id], (err, result) => {
        if (err) {
            console.error("Error Fetching Branch:", err);
            return res.status(500).json({ error: "Error fetching Branch" });
        }

        res.json(result);
        console.log(result);
    });



}


const shiftRosterShiftFetch = (req, res) => {
    const Id = req.params.id;
    const query = `SELECT DISTINCT staff_master_shift.shiftname, staff_master_shift.id FROM staff_allocation JOIN staff_master_shift ON staff_master_shift.id = staff_allocation.shift WHERE staff_allocation.shift = ${Id};`
    db.query(query, [Id], (err, result) => {
        if (err) {
            console.error("Error Fetching Branch:", err);
            return res.status(500).json({ error: "Error fetching Branch" });
        }

        res.json(result);
        console.log(result);
    });

}

const shiftRosterStaffsFetch = (req, res) => {
    const Id = req.params.id;
    const query = `SELECT DISTINCT staffs.employee_id, staffs.id FROM staffs JOIN staff_allocation ON staffs.id = staff_allocation.staff_id WHERE staff_allocation.staff_id= ${Id};`
    db.query(query, [Id], (err, result) => {
        if (err) {
            console.error("Error Fetching Branch:", err);
            return res.status(500).json({ error: "Error fetching Branch" });
        }

        res.json(result);
        console.log(result);
    });

}


const shiftRosterFloorsSectionFetch = (req, res) => {
    const Id = req.params.id;
    const query = `SELECT  master_floor_section.floor,master_floor_section.sectionname,master_floor_section.id FROM master_floor_section JOIN staff_allocation ON master_floor_section.id = staff_allocation.floor WHERE master_floor_section.id= ${Id};`
    db.query(query, [Id], (err, result) => {
        if (err) {
            console.error("Error Fetching Branch:", err);
            return res.status(500).json({ error: "Error fetching Branch" });
        }

        res.json(result);
        console.log(result);
    });

}



const shiftRosterBedFetch = (req, res) => {
    const Id = req.params.id;
    const query = `SELECT DISTINCT master_rooms.room_number,master_rooms.id FROM master_rooms JOIN staff_allocation ON master_rooms.id = staff_allocation.floor WHERE staff_allocation.floor=${Id};`
    db.query(query, [Id], (err, result) => {
        if (err) {
            console.error("Error Fetching Branch:", err);
            return res.status(500).json({ error: "Error fetching Branch" });
        }

        res.json(result);
        console.log(result);
    });

}


// const shiftRosterroomsBedFetch = (req, res) => {


// }






module.exports = { shiftSearch, shiftRoster, shiftRosterUpdate, shiftRosterGetbyId, shiftRosterBranchesUpdate, shiftRosterDutyFetch, shiftRosterShiftFetch, shiftRosterStaffsFetch, shiftRosterFloorsSectionFetch, shiftRosterBedFetch };