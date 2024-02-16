var db = require("../db/connection.js").mysql_pool;
var dbconnection = require("../db/dbconnection.js").mysql_pool;

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
    return res.status(400).json({ error: "Both branch_city_id " });
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
  } else {
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


const Mobile = [
  {
    "mobile_number": 1234567890,
  },
  {
    "mobile_number": 9876543210,
  },
  {
    "mobile_number": 9566420177,
  },
  {
    "mobile_number": 8667702265,
  },
  {
    "mobile_number": 8667633014,
  },
  {  
    "mobile_number" : 9578137837
  }
];

const getRoomNumbers = (req, res) => {
  const MobileNumber = parseInt(req.query.mobile_number, 10); // Ensure it's an integer

  // Check if the provided mobile number exists in the Mobile array
  const mobileExists = Mobile.some(mobile => mobile.mobile_number === MobileNumber);

  if (!mobileExists) {
    console.error("Invalid Mobile number:", MobileNumber);
    return res.status(400).json({ error: "Invalid Mobile number" });
  } else {
    const query = `SELECT master_beds.id, master_beds.bed_number, master_rooms.room_number FROM master_beds JOIN master_rooms ON master_beds.room_id = master_rooms.id WHERE master_rooms.branch_id = 1;`;

    console.log(query);
    // Assuming db.query is properly defined elsewhere in your code
    db.query(query, (err, result) => {
      if (err) {
        console.error("Error fetching branches:", err);
        return res.status(500).json({ error: "Error fetching branches" });
      } else {
        res.json(result);
        console.log(result);
      }
    });
  }
};


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
        leads.patient_id AS patient_id,
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

    db.query(query, ["PRG - " + room_Id], (err, result) => {
      if (err) {
        console.error("Error fetching patient details:", err);
        res.status(500).json({ error: "Error fetching patient details" });
      } else {
        res.json(result);
        console.log(result);
      }
    });
  }
};

const postPatientVitals = (req, res) => {
  // Corrected SQL query with `INSERT INTO` statement
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
      activity_output,
      created_at,
      updated_at,
      deleted_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), NULL);
  `;

  // Assuming you're receiving data as JSON in the POST request body
  const values = [
    req.query.patient_id,
    req.query.lead_id,
    req.query.schedule_id,
    req.query.marked_by,
    req.query.schedule_date,
    req.query.activity_timing,
    req.query.activity_bp_systole,
    req.query.activity_bp_diastole,
    req.query.activity_temp,
    req.query.activity_pulse,
    req.query.activity_resp,
    req.query.activity_pain_score,
    req.query.activity_pain_location_description,
    req.query.activity_spo,
    req.query.activity_solid_intake,
    req.query.activity_sugar_check,
    req.query.cbg_result,
    req.query.cbg_sign,
    req.query.fbs_result,
    req.query.fbs_sign,
    req.query.ppbs_result,
    req.query.ppbs_sign,
    req.query.activity_urine_output,
    req.query.activity_motion,
    req.query.activity_intake,
    req.query.activity_output,
    // created_at and updated_at will be automatically set to the current time, and deleted_at to NULL
  ];

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
  const query =
    "SELECT * FROM patient_activity_vitals where patient_activity_vitals.schedule_date =CURRENT_DATE";

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

getPatientMedicines = (req, res) => {
  const patient_id = req.query.patient_id;
  const timeSlots = req.query.title.split(','); // Expecting slots to be a comma-separated string like "morning,afternoon"




  const query = `
    SELECT DISTINCT
      leads.id AS leads_id,
      patient_medicines.patient_id,
      master_medicine_inventory.medicine_name AS  title,
      patient_medicines.master_medicine_inventory_id,
      patient_medicines.dosage,
      patient_medicines.unit_of_dosage,
      patient_medicines.frequency,
      patient_medicines.meal,
      patient_medicines.note,
      patient_medicines.medicine_time 
    FROM patient_medicines
    JOIN master_medicine_inventory ON patient_medicines.master_medicine_inventory_id = master_medicine_inventory.id
    JOIN leads ON patient_medicines.patient_id = leads.patient_id
    WHERE patient_medicines.patient_id = ?`;

  db.query(query, [patient_id], (err, results) => {
    if (err) {
      console.error("Error fetching patient medicines:", err);
      return res.status(500).send("An error occurred");
    }
    if (results.length === 0) {
      return res.status(404).send("No medicines found for the given patient ID.");
    }

    
    const slotRanges = {
    breakfast: { start: 5*60, end: 11*59 }, // 05:00 - 11:59
      lunch: { start: 12*60, end: 16*59 }, // 12:00 - 16:59
      dinner: { start: 20*60, end: 23*59 } // 20:00 - 23:59
    };

    // Filter function to check if a time is within the requested slots
    const filterByTimeSlot = (medicine) => {
      const times = medicine.medicine_time.split(',');
      return times.some(time => {
        const [hours, minutes] = time.split(':').map(n => parseInt(n, 10));
        const timeInMinutes = hours * 60 + minutes;
        return timeSlots.some(slot => {
          const range = slotRanges[slot];
          return timeInMinutes >= range.start && timeInMinutes <= range.end;
        });
      });
    };

    const filteredResults = results.filter(filterByTimeSlot).map((item, index) => ({
      id: index + 1, // Adding a serial number starting from 1
      ...item
    }));

    // Check if filtered results are empty and return a specific response
    if (filteredResults.length === 0) {
      return res.status(404).send("No data found in the requested time slots.");
    }

    res.json(filteredResults);
  });
};




const getPatientMedicineSchedule = async (req, res) => {
  const { start_date,end_date } = req.query;
  console.log(start_date, end_date);
   
  // Validate start_date and end_date parameters
  if (!start_date || !end_date) {
    return res.status(400).json({ error: 'Missing required parameters start_date or end_date.' });
  }

  // Use parameterized queries to prevent SQL injection
  const query = `SELECT * FROM patient_activity_medicines WHERE schedule_date BETWEEN ? AND ?;`;

  db.query(query, [start_date, end_date], (err, results) => { // Note: Use 'results' here for consistency
    if (err) {
      console.error("Error fetching patient activity medicines:", err);
      return res.status(500).json({ error: "An error occurred" }); // Use JSON for consistent response format
    } else {      
      // res.json(results); // 'results' is the correct variable name
      const filteredResults = results.map((item, index) => ({
        id: index + 1, // Adding a serial number starting from 1
        ...item
      }));
  
        res.json(filteredResults);
      console.log("Fetching patient activity medicines successful");
    }
  });
};












async function postPatientMedicines(req, res) {
  const medicineEntries = req.body; // Assuming this is your JSON array

  // console.log(medicineEntries);

  let connection;

  try {
    connection = await dbconnection.getConnection();

    // console.log(connection);

    await connection.beginTransaction();

    const currentDate = new Date().toISOString().slice(0, 10); // Gets current date in YYYY-MM-DD format
    const currentTime = new Date().toTimeString().slice(0, 8); // Gets current time in HH:MM:SS format
    


    const query = `
    INSERT INTO patient_activity_medicines(
      patient_id, lead_id, schedule_id, marked_by, master_medicine_inventory_id,
      dosage, unit_of_dosage, frequency, meal, sort_position, schedule_date,
      activity_timing, activity_comment, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
  `;
  
  for (const entry of medicineEntries) {
    await connection.execute(query, [
      entry.patient_id, entry.lead_id, entry.schedule_id, entry.marked_by, entry.master_medicine_inventory_id,
      entry.dosage, entry.unit_of_dosage, entry.frequency, entry.meal, entry.sort_position, currentDate,
      currentTime, entry.activity_comment
    ]);
  }
  
    await connection.commit();
    res.json({ success: true, message: "All data inserted successfully" });
  } catch (err) {
    if (connection) await connection.rollback();
    console.error("Failed to insert medicine entries:", err);
    res.status(500).json({ error: "Failed to insert medicine entries" });
  } finally {
    if (connection) await connection.release();
  }
}
















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
  getPatientVitals,
  getPatientMedicines,
  postPatientMedicines,
  getPatientMedicineSchedule
};
