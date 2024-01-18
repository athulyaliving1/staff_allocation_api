var db = require("../db/connection.js").mysql_pool;

// API endpoint to fetch countries

const getcountries = (req, res) => {
  const query =
    "SELECT DISTINCT branch_country_id, branch_country FROM master_branches";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching countries:", err);
      res.status(500).send("An error occurred");
    } else {
      res.json(results);
    }
  });
};
/**
 *
 *
 * @param {*} req
 * @param {*} res
 * @return {*} 
 */
const getstates = (req, res) => {
  const { country_id } = req.query;

  // console.log("branch_country_id:", branch_country_id);

  if (!country_id) {
    return res.status(400).json({ error: "country_id is required" });
  } else {
    const query = `SELECT DISTINCT branch_state,branch_state_id FROM master_branches WHERE branch_country_id = ${branch_country_id}`;

    db.query(query, [branch_country_id], (err, results) => {
      if (err) {
        console.error("Error fetching states:", err);
        res.status(500).send("An error occurred");
      } else {
        res.json(results);
      }
    });
  }


};

// API endpoint to fetch cities based on the state

const getcities = (req, res) => {
  const { branch_state_id } = req.query;

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
};

const branchlocation = (req, res) => {
  const { branch_city_id } = req.query;

  if (!branch_city_id) {
    return res
      .status(400)
      .json({ error: "Both branch_city_id " });
  } else {
    const query = `SELECT DISTINCT id,branch_name FROM master_branches WHERE branch_city_id=${branch_city_id}`;

    db.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching location:", err);
        res.status(500).send("An error occurred");
      } else {
        res.json(results);
        // console.log(results);
      }
    });
  }


};

const getTower = (req, res) => {
  const { branch_id } = req.query;

  if (!branch_id) {
    return res.status(400).json({ error: "branch_id is required" });
  }
  else {

    const query = `SELECT DISTINCT mb.id,mfs.tower as towerno, mfs.branch_id,mb.branch_name, master_towers.tower FROM master_branches mb JOIN master_floor_section mfs ON mb.id = mfs.branch_id join master_towers on mfs.tower=master_towers.id WHERE mfs.branch_id = ${branch_id}; `;

    db.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching tower:", err);
        res.status(500).send("An error occurred");
      } else {
        res.json(results);
        console.log(results);
      }
    });
  }


};

const getmasterTower = (req, res) => {
  // const { tower_id } = req.query;

  const query = `SELECT * FROM master_towers`;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching tower:", err);
      res.status(500).send("An error occurred");
    } else {
      res.json(results);
      console.log(results);
    }
  });
};

const getFloor = (req, res) => {
  const { branch_id, tower_id } = req.query;
  console.log(branch_id, tower_id);

  // Validate that branch_id and tower_id are defined and not empty
  if (!branch_id || !tower_id) {
    return res
      .status(400)
      .json({ error: "Both branch_id and tower_id are required." });
  }
  console.log(branch_id);
  console.log(tower_id);

  // const query = `SELECT DISTINCT mb.id, mfs.branch_id,mb.branch_name,mfs.floor FROM master_branches mb JOIN master_floor_section mfs ON mb.id = mfs.branch_id WHERE mfs.branch_id = ${branch_id};`;
  const query = `SELECT DISTINCT  mb.id,mfs.tower, mfs.branch_id,mb.branch_name,mfs.floor FROM master_branches mb JOIN master_floor_section mfs ON mb.id = mfs.branch_id WHERE mfs.branch_id = ${branch_id} AND mfs.tower=${tower_id};`;
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching tower:", err);
      res.status(500).send("An error occurred");
    } else {
      res.json(results);
      console.log(results);
    }
  });
};

const getSection = (req, res) => {
  const { branch_id, floor } = req.params;
  console.log(floor); // Output the value of 'floor' to the console for debugging purposes
  console.log(branch_id); // Output the value of 'branch_id' to the console for debugging purposes

  const sql = `SELECT DISTINCT mb.id, mb.branch_name, mfs.id AS flrefId, mfs.branch_id, mfs.section FROM master_branches mb JOIN master_floor_section mfs ON mb.id = mfs.branch_id
                 WHERE mfs.branch_id ='${branch_id}' AND mfs.floor ="${floor}"`;

  // const sql = `SELECT DISTINCT mb.id, mb.branch_name, mfs.id AS flrefId, mfs.branch_id, mfs.section FROM master_branches mb JOIN master_floor_section mfs ON mb.id = mfs.branch_id
  //                WHERE mfs.branch_id ='${branch_id}' AND mfs.floor ="${floor}"`;

  // const sql =
  //   "SELECT DISTINCT mb.id, mb.branch_name, mfs.branch_id, mfs.section FROM master_branches mb JOIN master_floor_section mfs ON mb.id = mfs.branch_id WHERE mfs.branch_id ='${" +
  //   branch_id +
  //   "}' AND mfs.floor ='${" +
  //   floor +
  //   "}'";
  // sql = "select distinct id from master_branches";

  console.log("SQL Query:", sql);

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching section:", err);
      res.status(500).json({ error: "An error occurred" });
    } else {
      // res.status(200).json({ res: results });
      res.json(results);
      console.log(results);
      // res.send("Success");

      // Output the database query results to the console for debugging purposes
    }
  });
};

const getSection1 = (req, res) => {
  const { branch_id, floor } = req.params;
  console.log(floor); // Output the value of 'floor' to the console for debugging purposes
  console.log(branch_id); // Output the value of 'branch_id' to the console for debugging purposes

  const sql = `SELECT DISTINCT mb.id, mb.branch_name, mfs.id AS flrefId, mfs.branch_id, mfs.section FROM master_branches mb JOIN master_floor_section mfs ON mb.id = mfs.branch_id
                 WHERE mfs.branch_id ='${branch_id}' AND mfs.id ="${floor}"`;

  console.log("SQL Query:", sql);

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching section:", err);
      res.status(500).json({ error: "An error occurred" });
    } else {
      // res.status(200).json({ res: results });
      res.json(results);
      console.table(results);
      // res.send("Success");

      // Output the database query results to the console for debugging purposes
    }
  });
};

const staffSearch = (req, res) => {
  const query = "SELECT full_name, employee_id FROM staffs;";
  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching staffs:", err);
      res.status(500).send("Error fetching staffs");
    } else {
      res.json(result);
    }
  });
};

const getBeds = (req, res) => {
  const floorId = req.params.roomId;
  console.log("Requested floorId:", floorId);

  // Use parameterized query to prevent SQL injection
  // const query = "SELECT DISTINCT * FROM master_beds WHERE room_id = ?";
  const query =
    " SELECT master_beds.id,master_beds.bed_number, master_rooms.room_number FROM master_beds JOIN master_rooms ON master_beds.room_id = master_rooms.id WHERE master_beds.room_id = ?";

  console.log("Query:", query);
  // Execute the parameterized query with floorId as a parameter
  db.query(query, [floorId], (err, result) => {
    if (err) {
      console.error("Error fetching rooms:", err);
      // Send an error response with a 500 status code and a meaningful error message
      res.status(500).json({ error: "Error fetching rooms" });
    } else {
      // Send the query result as JSON data in the response
      res.json(result);
      console.log(result);
    }
  });
};

const getRooms = (req, res) => {
  const floorId = req.params.floorId; // Use req.params to get the value of floorId from the URL

  console.log(floorId);
  const query = `SELECT DISTINCT * FROM master_rooms WHERE floor=${floorId}`;
  console.log(query);
  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching rooms:", err);
      res.status(500).json({ error: "Error fetching rooms" });
    } else {
      res.json(result);
      console.log(result);
    }
  });
};


const getMasterFloor = (req, res) => {
  const masterFloorId = req.query.masterfloorid; // Access the query parameter

  console.log(masterFloorId);

  const query = `SELECT * FROM master_floors WHERE id=${masterFloorId}`;
  console.log(query);
  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching master floor:", err);
      res.status(500).json({ error: "Error fetching master floor" });
    } else {
      res.json(result);
      console.log(result);
    }
  });
};


const getBranches = (req, res) => {
  const query = `SELECT DISTINCT  id,branch_name,branch_code FROM master_branches`;
  console.log(query);
  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching branches:", err);
      res.status(500).json({ error: "Error fetching branches" });
    } else {
      res.json(result);
      console.log(result);
    }
  });
};


const getRoomNumbers = (req, res) => {

  const query = `SELECT master_beds.id,master_beds.bed_number, master_rooms.room_number FROM master_beds JOIN master_rooms ON master_beds.room_id = master_rooms.id WHERE master_rooms.branch_id = 1;`;

  console.log(query);
  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching branches:", err);
      res.status(500).json({ error: "Error fetching branches" });
    } else {
      res.json(result);
      console.log(result);
    }
  });
}


const getPatientDetails = (req, res) => {
  const room_Id = req.query.roomId;

  if (!room_Id) {
    console.error("Invalid room ID:", room_Id);
    return res.status(400).json({ error: "Invalid room ID" });
  } else {
    console.log("Valid room ID:", room_Id);
/** @type {*} */
const query = `
      SELECT 
        
        master_branches.branch_name,
        master_rooms.room_number,
        patients.patient_id,
        CONCAT(patients.first_name, patients.middle_name, patients.last_name) AS full_name,
        patients.mobile_number,
        master_beds.bed_number,
        leads.id AS lead_id,
        patient_schedules.id AS patients_schedules_id,
        patients.enquirer_name,
        patients.relationship_with_patient
      FROM   
        leads
        JOIN patients ON leads.patient_id = patients.id
        LEFT JOIN master_branches ON patients.branch_id = master_branches.id
        LEFT JOIN patient_schedules ON patients.id = patient_schedules.patient_id
        LEFT JOIN master_beds ON patient_schedules.bed_id = master_beds.id
        LEFT JOIN master_rooms ON master_beds.room_id = master_rooms.id
      WHERE 
        leads.status = 'Ongoing' AND master_branches.id = '1' AND master_rooms.room_number LIKE ? || '%'
      GROUP BY 
        patients.patient_id;`;

    console.log("Query:", query);

    console.log("Before query execution - room_Id:", room_Id);

    db.query(query, ['PRG - ' + room_Id], (err, result) => {
      if (err) {
        console.error("Error fetching patient details:", err);
        res.status(500).json({ error: "Error fetching patient details" });
      } else {
        res.json(result);
        console.log(result);
      }
    });
  }
}



const postPatientVitals = (req, res) => {
  const query = `
    INSERT INTO patient_activity_vitals (
      patient_id,
      lead_id,
      schedule_id,
      marked_by,
      schedule_date,
      activity_timing,
      activity_bp_systole,
      activity_bp_diastole,
      activity_temp,
      activity_pulse,
      activity_resp,
      activity_pain_score,
      activity_pain_location_description,
      activity_spo,
      activity_solid_intake,
      activity_sugar_check,
      cbg_result,
      cbg_sign,
      fbs_result,
      fbs_sign,
      ppbs_result,

      ppbs_sign,
      activity_urine_output,
      activity_motion,
      activity_intake,
      activity_output
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;

  const values = Object.values(req.query);

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error inserting data into patient_activity_vitals:", err);
      res.status(500).json({ error: "Error inserting data into patient_activity_vitals" });
    } else {
      res.json({ success: true, message: "Data inserted successfully" });
    }
  });
};

getPatientVitals = (req, res) => {
  console.log(typeof res); // Debug statement
  const query = "SELECT * FROM patient_activity_vitals where patient_activity_vitals.schedule_date =CURRENT_DATE";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching patient vitals:", err);
      res.status(500).send("An error occurred");
    } else {
      res.json(results);
      console.table(results);
    }
  });
};










module.exports = {
  getcities,
  getstates,
  getcountries,
  staffSearch,
  branchlocation,
  getTower,
  getFloor,
  getSection,
  getBeds,
  getRooms,
  getBranches,
  getmasterTower,
  getSection1,
  getMasterFloor,
  getRoomNumbers,
  getPatientDetails,
  postPatientVitals,
  getPatientVitals


};
