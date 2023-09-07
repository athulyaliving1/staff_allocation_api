var db = require("../db/connection.js").mysql_pool;

const shiftSearch = (req, res) => {
  const query = "SELECT * FROM master_shifts;";
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

  const query = "SELECT * FROM staff_allocation";
  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching staff:", err);
      res.status(500).send("Error fetching shift");
    } else {
      res.json(result);
    }
  });
};

const staffnurseshiftRoster = (req, res) => {
  // const query = "SELECT id,branch_id,user_id,room_no,bed_no,duty_type_id,floor,section_id,staff_id,staff_resource,shift_id,staff_source,shift,staff_payable,service_payable,schedule_date, FROM staff_allocation"

  const query = "SELECT * FROM staff_nurse_allocation";
  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching staff:", err);
      res.status(500).send("Error fetching shift");
    } else {
      res.json(result);
    }
  });
};

const shiftRosterGetbyId = (req, res) => {
  const shiftId = req.params.id;

  const query = `SELECT * FROM staff_allocation WHERE id = "${shiftId}"`;
  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching staff:", err);
      res.status(500).send("Error fetching shift");
    } else {
      res.json(result);
      // console.log(result);
    }
  });
};

const shiftRosterUpdate = (req, res) => {
  const shiftId = req.params.id;
  const {
    branch_id,
    user_id,
    room_no,
    bed_id,
    duty_type_id,
    floor,
    section_id,
    staff_id,
    staff_source,
    shift,
    staff_payable,
    service_payable,
  } = req.body;

  const sql = `UPDATE staff_allocation SET branch_id = ?, user_id = ?, room_no = ?,bed_id = ?, duty_type_id = ?, floor = ?, section_id = ?, staff_id = ?, staff_source = ?, shift = ?, staff_payable = ?, service_payable = ? WHERE id = ?`;
  const values = [
    branch_id,
    user_id,
    room_no,
    bed_id,
    duty_type_id,
    floor,
    section_id,
    staff_id,
    staff_source,
    shift,
    staff_payable,
    service_payable,
    shiftId,
  ];

  db.query(sql, values, (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Shift successfully updated
    res
      .status(200)
      .json({ status: 200, error: null, response: "Shift updated" });
    res.json(result[0]);
  });
};

const shiftRosterBranchesUpdate = (req, res) => {
  const Id = req.params.id;

  // const query = `SELECT DISTINCT master_branches.branch_name, staff_allocation.branch_id
  //                  FROM staff_allocation
  //                  JOIN master_branches ON master_branches.id = staff_allocation.branch_id
  //                  WHERE staff_allocation.id = ${Id}`;

  const query = `SELECT * FROM master_branches WHERE id=${Id}`;

  db.query(query, [Id], (err, result) => {
    if (err) {
      console.error("Error Fetching Branch:", err);
      return res.status(500).json({ error: "Error fetching Branch" });
    }

    res.json(result);
    // console.log(result);
  });
};

const shiftRosterDutyFetch = (req, res) => {
  const Id = req.params.id;

  // const query = `SELECT DISTINCT staff_allocation.duty_type_id,staff_master_duty.id,staff_master_duty.duty_name FROM staff_allocation JOIN staff_master_duty ON staff_master_duty.id = staff_allocation.duty_type_id WHERE staff_allocation.id =${Id}; `;

  const query = `SELECT * FROM staff_master_duty WHERE id =${Id}`;

  db.query(query, [Id], (err, result) => {
    if (err) {
      console.error("Error Fetching Branch:", err);
      return res.status(500).json({ error: "Error fetching Branch" });
    }

    res.json(result);
    // console.log(result);
  });
};

const shiftRosterShiftFetch = (req, res) => {
  const Id = req.params.id;
  const query = `SELECT DISTINCT master_shifts.shift_name As shiftname ,master_shifts.id FROM master_shifts JOIN staff_allocation ON master_shifts.id = staff_allocation.shift WHERE staff_allocation.shift = ${Id};`;
  db.query(query, [Id], (err, result) => {
    if (err) {
      console.error("Error Fetching Branch:", err);
      return res.status(500).json({ error: "Error fetching Branch" });
    }

    res.json(result);
    console.log(result);
  });
};

const shiftRosterStaffsFetch = (req, res) => {
  const Id = req.params.id;
  const query = `SELECT DISTINCT staffs.employee_id, staffs.id FROM staffs JOIN staff_allocation ON staffs.id = staff_allocation.staff_id WHERE staff_allocation.staff_id= ${Id};`;
  db.query(query, [Id], (err, result) => {
    if (err) {
      console.error("Error Fetching Branch:", err);
      return res.status(500).json({ error: "Error fetching Branch" });
    }

    res.json(result);
    // console.log(result);
  });
};

const shiftRosterFloorsSectionFetch = (req, res) => {
  console.log(req.params);
  const Id = req.params.id;
  const query = `SELECT  master_floor_section.floor,master_floor_section.sectionname,master_floor_section.id FROM master_floor_section JOIN staff_allocation ON master_floor_section.id = staff_allocation.floor WHERE master_floor_section.id= ${Id};`;
  db.query(query, [Id], (err, result) => {
    if (err) {
      console.error("Error Fetching Branch:", err);
      return res.status(500).json({ error: "Error fetching Branch" });
    }

    res.json(result);
    console.log(result);
  });
};

const shiftRosterBedFetch = (req, res) => {
  const Id = req.params.id;
  const query = `SELECT DISTINCT master_beds.room_id,master_beds.id as bed_id,master_beds.bed_number, staff_allocation.room_no FROM master_beds JOIN staff_allocation ON master_beds.id = staff_allocation.bed_id WHERE master_beds.id='${Id}'`;
  db.query(query, [Id], (err, result) => {
    if (err) {
      console.error("Error Fetching Branch:", err);
      return res.status(500).json({ error: "Error fetching Branch" });
    }

    res.json(result);

    // console.log(result);
  });
};

const shiftRosterroomsFetch = (req, res) => {
  const Id = req.params.id;
  const query = `SELECT DISTINCT master_rooms.room_number,master_rooms.id FROM master_rooms JOIN staff_allocation ON master_rooms.room_number = staff_allocation.room_no WHERE staff_allocation.room_no='${Id}';`;
  db.query(query, [Id], (err, result) => {
    if (err) {
      console.error("Error Fetching Branch:", err);
      return res.status(500).json({ error: "Error fetching Branch" });
    }

    res.json(result);
    // console.log(result);
  });
};

const shiftMasterBranchFetch = (req, res) => {
  const query = `SELECT * FROM master_branches`;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error Fetching Branch:", err);
      return res.status(500).json({ error: "Error fetching Branch" });
    }
    res.json(result);
    // console.log(result);
  });
};

const shiftMasterFloorFetch = (req, res) => {
  const query = `SELECT * FROM master_floor_section`;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error Fetching Section:", err);
      return res.status(500).json({ error: "Error fetching Section" });
    }
    res.json(result);
    // console.log(result);
  });
};

const shiftMasterSectionFetch = (req, res) => {
  const query = `SELECT * FROM master_sections`;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error Fetching Section:", err);
      return res.status(500).json({ error: "Error fetching Section" });
    }
    res.json(result);
    // console.log(result);
  });
};

const shiftMasterbedFetch = (req, res) => {
  const query = `SELECT id, bed_number FROM master_beds`;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error Fetching Section:", err);
      return res.status(500).json({ error: "Error fetching Section" });
    }
    res.json(result);
    // console.log(result);
  });
};

const shiftVendorsearch = (req, res) => {
  const Id = req.params.id;

  const query = `SELECT DISTINCT staff_vendor_details.name,staff_vendor_details.id FROM staff_vendor_details INNER JOIN staffs ON staffs.vendor_id =staff_vendor_details.id WHERE staff_vendor_details.id=${Id};`;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error Fetching Vendor:", err);
      return res.status(500).json({ error: "Error fetching vendor" });
    }
    res.json(result);
    // console.log(result);
  });
};

const shiftrosterdelete = (req, res) => {
  const ShiftId = req.params.id;

  const sql = `DELETE FROM staff_allocation WHERE id = "${ShiftId}"`;

  db.query(sql, (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Vendor successfully deleted
    res
      .status(200)
      .json({ status: 200, error: null, response: "Shift deleted" });
  });
};

const staffShiftRosterDelete = (req, res) => {
  const ShiftId = req.params.id;

  const sql = `DELETE FROM staff_nurse_allocation WHERE id = "${ShiftId}"`;

  db.query(sql, (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Vendor successfully deleted
    res
      .status(200)
      .json({ status: 200, error: null, response: "Shift deleted" });
  });
};

module.exports = {
  shiftSearch,
  shiftRoster,
  staffnurseshiftRoster,
  shiftRosterUpdate,
  shiftRosterGetbyId,
  shiftRosterBranchesUpdate,
  shiftRosterDutyFetch,
  shiftRosterShiftFetch,
  shiftRosterStaffsFetch,
  shiftRosterFloorsSectionFetch,
  shiftRosterBedFetch,
  shiftRosterroomsFetch,
  shiftMasterBranchFetch,
  shiftMasterFloorFetch,
  shiftMasterbedFetch,
  shiftMasterSectionFetch,
  shiftVendorsearch,
  shiftrosterdelete,
  staffShiftRosterDelete,
};
