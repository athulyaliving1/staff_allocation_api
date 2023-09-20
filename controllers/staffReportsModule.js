const { query } = require("express");

var db = require("../db/connection.js").mysql_pool;

const StaffBaseReport = async (req, res) => {
  // const query = "SELECT id, full_name, employee_id,vendor_id FROM staffs"
  console.log(req.query);
  var { from_date, to_date, branch_id, tower, floor, section } = req.query;
  floor = floor.substring(1);
  section = section.substring(1);
  console.log(floor);
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;
  console.log(today);
  const default_branches = await new Promise((resolve, reject) => {
    db.query("select distinct id from master_branches", (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });

  all_branches = default_branches.map((tt) => tt.id);
  const filter_branches = !branch_id ? all_branches : branch_id;
  from_date = !from_date ? today : from_date;
  to_date = !to_date ? today : to_date;

  const default_towers = await new Promise((resolve, reject) => {
    db.query("select distinct id from master_towers", (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
  all_towers = default_towers.map((tt) => tt.id);
  const filter_towers = !tower ? all_towers : tower;

  //sections
  const default_floors = await new Promise((resolve, reject) => {
    db.query("select distinct id from master_floors", (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
  all_floors = default_floors.map((tt) => tt.id);
  const filter_floors = !floor ? all_floors : floor;
  console.log(filter_floors);
  //query="select staffs.employee_id,staffs.full_name,master_branches.branch_name,staff_master_duty.duty_name,staff_nurse_allocation.floor from staff_nurse_allocation join staffs on staff_nurse_allocation.staff_id=staffs.id join master_branches on staff_nurse_allocation.branch_id=master_branches.id join staff_master_duty on staff_nurse_allocation.duty_type_id=staff_master_duty.id where schedule_date between ? and ? and branch_id in (?) and tower in (?) and floor in (?)" ;
  query =
    "select staffs.employee_id,staffs.full_name,master_branches.branch_name,staff_master_duty.duty_name,staff_allocation.tower,staff_allocation.master_floor,staff_allocation.section_id from staff_allocation join staffs on staff_allocation.staff_id=staffs.id join master_branches on staff_allocation.branch_id=master_branches.id join staff_master_duty on staff_allocation.duty_type_id=staff_master_duty.id where schedule_date between ? and ? and branch_id in (?) and tower in (?) and master_floor in (?) group by staff_allocation.duty_type_id,branch_id,tower,floor,section_id";

  const ans = await new Promise((resolve, reject) => {
    db.query(
      query,
      [from_date, to_date, filter_branches, filter_towers, filter_floors],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      }
    );
  });

  res.status(200).json({ Result: ans });
  console.log(ans);
};

const DutyWiseReport = async (req, res) => {
  // const query = "SELECT id, full_name, employee_id,vendor_id FROM staffs"
  console.log("req", req.query);

  //   console.log(req);
  console.log("Full Response:", req.from_date);

  var {
    from_date,
    to_date,
    branch_id,
    tower,
    floor,
    section,
    room_no,
    bed_no,
  } = req.query;
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;
  console.log(today);
  const default_branches = await new Promise((resolve, reject) => {
    db.query("select distinct id from master_branches", (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });

  all_branches = default_branches.map((tt) => tt.id);
  const filter_branches = !branch_id ? all_branches : branch_id;
  from_date = !from_date ? today : from_date;
  to_date = !to_date ? today : to_date;

  const default_towers = await new Promise((resolve, reject) => {
    db.query("select distinct id from master_towers", (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
  all_towers = default_towers.map((tt) => tt.id);
  const filter_towers = !tower ? all_towers : tower;

  //sections
  const default_floors = await new Promise((resolve, reject) => {
    db.query("select distinct id from master_floors", (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
  all_floors = default_floors.map((tt) => tt.id);
  const filter_floors = !floor ? all_floors : floor;
  console.log(filter_floors);
  //query="select staffs.employee_id,staffs.full_name,master_branches.branch_name,staff_master_duty.duty_name,staff_nurse_allocation.floor from staff_nurse_allocation join staffs on staff_nurse_allocation.staff_id=staffs.id join master_branches on staff_nurse_allocation.branch_id=master_branches.id join staff_master_duty on staff_nurse_allocation.duty_type_id=staff_master_duty.id where schedule_date between ? and ? and branch_id in (?) and tower in (?) and floor in (?)" ;
  query =
    "SELECT staff_allocation.schedule_date,staff_master_duty.duty_name,master_branches.branch_name,master_shifts.shift_name,count(staff_allocation.staff_id) as total_staff_deployed FROM `staff_allocation` join staff_master_duty on staff_allocation.duty_type_id=staff_master_duty.id join master_branches on staff_allocation.branch_id=master_branches.id join master_shifts on staff_allocation.shift=master_shifts.id where schedule_date between ? and ? and staff_allocation.branch_id in (?) and staff_allocation.tower in (?) group by staff_allocation.duty_type_id;";

  const ans = await new Promise((resolve, reject) => {
    db.query(
      query,
      [from_date, to_date, filter_branches, filter_towers, filter_floors],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      }
    );
  });

  res.status(200).json({ Result: ans });
  console.log(ans);
  console.table(ans);
};

const ShiftDetails = async (req, res) => {
  console.log(req.query);
  var { from_date, to_date, branch_id } = req.query;

  const default_branches = await new Promise((resolve, reject) => {
    db.query("select distinct id from master_branches", (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
  all_branches = default_branches.map((tt) => tt.id);
  const filter_branches = !branch_id ? all_branches : branch_id;
  from_date = !from_date ? today : from_date;
  to_date = !to_date ? today : to_date;

  Query =
    "select * from staff_nurse_allocation where schedule_date between ? and ? AND  branch_id = ?";

  const ans = await new Promise((resolve, reject) => {
    db.query(Query, [from_date, to_date, filter_branches], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });

  res.status(200).json({ Result: ans });
  console.log(ans);
};

module.exports = {
  StaffBaseReport,
  DutyWiseReport,
  ShiftDetails,
};
