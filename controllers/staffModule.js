var db = require('../db/connection.js').mysql_pool;



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


const staffRegister = (req, res) => {
  const staffData = {
    employee_id: req.body.employee_id,
    full_name: req.body.full_name,
    date_of_birth: req.body.date_of_birth,
    gender: req.body.gender,
    blood_group: req.body.blood_group,
    marital_status: req.body.marital_status,
    religion: req.body.religion,
    food_habits: req.body.food_habits,
    mobile_number: req.body.mobile_number,
    email: req.body.email,
    personal_email: req.body.personal_email,
    current_address: req.body.current_address,
    current_area: req.body.current_area,
    current_city: req.body.current_city,
    current_pin_code: req.body.current_pin_code,
    current_state: req.body.current_state,
    current_country: req.body.current_country,
    permanent_address: req.body.permanent_address,
    permanent_area: req.body.permanent_area,
    permanent_city: req.body.permanent_city,
    permanent_pin_code: req.body.permanent_pin_code,
    permanent_state: req.body.permanent_state,
    permanent_country: req.body.permanent_country
  };


  // Assuming you have a database connection pool instance named `pool`
  db.query('INSERT INTO staffs SET ?', staffData, (err, result) => {
    if (err) {
      console.error('Error inserting staff data:', err);
      res.status(500).send('Error inserting staff data');
    } else {
      res.status(201).json({ message: 'Staff data inserted successfully' });
    }
  });
};




const staffProfile = (req, res) => {
  const staffempid = req.params.id;
  console.log(staffempid);

  const query = `SELECT employee_id, full_name, date_of_birth, gender, blood_group, marital_status, mobile_number, email, personal_email, current_address, current_area, current_city, current_pin_code, current_state, current_country, permanent_address, permanent_area, permanent_city, permanent_pin_code, permanent_state, permanent_country FROM staffs WHERE employee_id="${staffempid}"`;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching staffs:", err);
      res.status(500).send("Error fetching staffs");
    } else {
      res.json(result);
    }
  });
};





module.exports = { staffSearch, staffRegister, staffProfile };