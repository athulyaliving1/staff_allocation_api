const { shiftRosterGetbyId } = require("./shiftModule.js");

var db = require("../db/connection.js").mysql_pool;

const StaffReportsModule = async (req, res) => {
  // const query = "SELECT id, full_name, employee_id,vendor_id FROM staffs"
  console.log(req.query);
  var { from_date, to_date, branch_id, tower, floor, section } = req.query;
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

  all_branches = default_branches.map(tt => tt.id);
  const filter_branches = !(branch_id) ? all_branches : branch_id;
  from_date = !(from_date) ? today : from_date;
  to_date = !(to_date) ? today : to_date;

  const default_towers = await new Promise((resolve, reject) => {

    db.query("select distinct id from master_towers", (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
  all_towers = default_towers.map(tt => tt.id);
  const filter_towers = !(tower) ? all_towers : tower;

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
  all_floors = default_floors.map(tt => tt.id);
  const filter_floors = !(floor) ? all_floors : floor;
  console.log(filter_floors);
  //query="select staffs.employee_id,staffs.full_name,master_branches.branch_name,staff_master_duty.duty_name,staff_nurse_allocation.floor from staff_nurse_allocation join staffs on staff_nurse_allocation.staff_id=staffs.id join master_branches on staff_nurse_allocation.branch_id=master_branches.id join staff_master_duty on staff_nurse_allocation.duty_type_id=staff_master_duty.id where schedule_date between ? and ? and branch_id in (?) and tower in (?) and floor in (?)" ;
  //query = "select staffs.employee_id,staffs.full_name,master_branches.branch_name,staff_master_duty.duty_name,staff_allocation.tower,staff_allocation.master_floor,staff_allocation.section_id,staff_allocation.schedule_date from staff_allocation join staffs on staff_allocation.staff_id=staffs.id join master_branches on staff_allocation.branch_id=master_branches.id join staff_master_duty on staff_allocation.duty_type_id=staff_master_duty.id where schedule_date between ? and ? and branch_id in (?) and tower in (?) and master_floor in (?) group by staff_allocation.duty_type_id,branch_id,tower,floor,section_id";

  query = "select staffs.employee_id,staffs.full_name,master_branches.branch_name,staff_master_duty.duty_name,staff_allocation.tower,master_floors.floor_name,staff_allocation.section_id,staff_allocation.schedule_date from staff_allocation join staffs on staff_allocation.staff_id=staffs.id join master_branches on staff_allocation.branch_id=master_branches.id join staff_master_duty on staff_allocation.duty_type_id=staff_master_duty.id join master_floors on staff_allocation.master_floor=master_floors.id where schedule_date between ? and ? and branch_id in (?) and tower in (?) and master_floor in (?) group by staff_allocation.duty_type_id,branch_id,tower,floor,section_id";



  const ans = await new Promise((resolve, reject) => {

    db.query(query, [from_date, to_date, filter_branches, filter_towers, filter_floors], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }

    });

  });

  // Add index to each item in the response
  const ansWithIndex = ans.map((item, index) => ({ index: index + 1, ...item }));

  res.status(200).json({ Result: ansWithIndex });
  console.log(ansWithIndex);


};

const DutyWiseReport = async (req, res) => {
  // const query = "SELECT id, full_name, employee_id,vendor_id FROM staffs"
  console.log(req.query);
  var { from_date, to_date, branch_id, tower, floor, section, room_no, bed_no } = req.query;
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

  all_branches = default_branches.map(tt => tt.id);
  const filter_branches = !(branch_id) ? all_branches : branch_id;
  from_date = !(from_date) ? today : from_date;
  to_date = !(to_date) ? today : to_date;

  const default_towers = await new Promise((resolve, reject) => {

    db.query("select distinct id from master_towers", (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
  all_towers = default_towers.map(tt => tt.id);
  const filter_towers = !(tower) ? all_towers : tower;

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
  all_floors = default_floors.map(tt => tt.id);
  const filter_floors = !(floor) ? all_floors : floor;
  console.log(filter_floors);
  //query="select staffs.employee_id,staffs.full_name,master_branches.branch_name,staff_master_duty.duty_name,staff_nurse_allocation.floor from staff_nurse_allocation join staffs on staff_nurse_allocation.staff_id=staffs.id join master_branches on staff_nurse_allocation.branch_id=master_branches.id join staff_master_duty on staff_nurse_allocation.duty_type_id=staff_master_duty.id where schedule_date between ? and ? and branch_id in (?) and tower in (?) and floor in (?)" ;
  query = "SELECT staff_allocation.schedule_date,staff_master_duty.duty_name,master_branches.branch_name,master_shifts.shift_name,count(staff_allocation.staff_id) as total_staff_deployed FROM `staff_allocation` join staff_master_duty on staff_allocation.duty_type_id=staff_master_duty.id join master_branches on staff_allocation.branch_id=master_branches.id join master_shifts on staff_allocation.shift=master_shifts.id where schedule_date between ? and ? and staff_allocation.branch_id in (?) and staff_allocation.tower in (?) group by staff_allocation.schedule_date,staff_allocation.duty_type_id,staff_allocation.shift";

  const staff_allocation_ans = await new Promise((resolve, reject) => {

    db.query(query, [from_date, to_date, filter_branches, filter_towers, filter_floors], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }

    });

  });

  staff_nurse_query = "SELECT date_format(staff_nurse_allocation.schedule_date,'%Y-%m-%d') as schedule_date,staff_master_duty.duty_name,master_branches.branch_name,master_shifts.shift_name,count(staff_nurse_allocation.staff_id) as total_staff_deployed FROM `staff_nurse_allocation` join staff_master_duty on staff_nurse_allocation.duty_type_id=staff_master_duty.id join master_branches on staff_nurse_allocation.branch_id=master_branches.id join master_shifts on staff_nurse_allocation.staff_nurse_shift=master_shifts.id where schedule_date between ? and ? and staff_nurse_allocation.branch_id in (?) and staff_nurse_allocation.tower in (?) and staff_nurse_allocation.status=1 group by staff_nurse_allocation.schedule_date, staff_nurse_allocation.staff_nurse_shift";

  const staff_nurse_ans = await new Promise((resolve, reject) => {

    db.query(staff_nurse_query, [from_date, to_date, filter_branches, filter_towers], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }

    });

  });

  var total_ans = staff_allocation_ans.concat(staff_nurse_ans);

  total_ans.forEach((item, index) => {
    item.index = index + 1; // Index starts from 1
  });
  res.status(200).json({ 'Result': total_ans });

};

const StaffNurseReport = async (req, res) => {
  // const query = "SELECT id, full_name, employee_id,vendor_id FROM staffs"
  console.log(req.query);
  var { from_date, to_date, branch_id, staff_id } = req.query;
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

  all_branches = default_branches.map(tt => tt.id);
  const filter_branches = !(branch_id) ? all_branches : branch_id;
  from_date = !(from_date) ? today : from_date;
  to_date = !(to_date) ? today : to_date;


  //test=from_date+" "+to_date+" "+all_branches+" "+staff_id;

  query = "SELECT staff_nurse_allocation.schedule_date as schedule_date,staffs.full_name as full_name,staffs.employee_id as employee_id,master_branches.branch_name as branch_name,staff_vendor_details.name as resource,if(staff_vendor_details.name='Athulya','In-House','Out-source') as staff_type,staff_master_duty.duty_name as staff_category,staff_nurse_allocation.ot_type as ot_type,staff_nurse_allocation.status as ot_status,staff_nurse_allocation.staff_payable as staff_payable,staff_nurse_allocation.ot_hrs_shift as ot_hrs_shift FROM `staff_nurse_allocation` join master_branches on staff_nurse_allocation.branch_id=master_branches.id join staffs on staff_nurse_allocation.staff_id=staffs.id join staff_vendor_details on staffs.vendor_id=staff_vendor_details.id join staff_master_duty on staff_nurse_allocation.duty_type_id=staff_master_duty.id where staff_nurse_allocation.branch_id in (?) and staff_nurse_allocation.schedule_date between ? and ? and staff_nurse_allocation.staff_id in (?)";
  db.query(query, [branch_id, from_date, to_date, staff_id], (err, results) => {

    console.log(results);
    var staff_nurse_report = {};
    var extended = 0;
    var shift = 0;
    var leave = 0;
    var total_payable = 0;
    var worked = 0;

    results.forEach((item, index) => {

      if (item.ot_status == 1) {
        worked = worked + 1;
        if (item.ot_type == 'Extended') {
          extended = extended + item.ot_hrs_shift;

        } else if (item.ot_type == 'Shift') {
          shift = shift + item.ot_hrs_shift;
        }
        total_payable = total_payable + item.staff_payable;

      } else if (item.ot_status == 0) {
        leave = leave + 1;
        total_payable = total_payable - item.staff_payable;
      }

    });

    staff_nurse_report["full_name"] = results[0].full_name;
    staff_nurse_report["employee_id"] = results[0].employee_id;
    staff_nurse_report["branch_name"] = results[0].branch_name;
    staff_nurse_report["resource"] = results[0].resource;
    staff_nurse_report["staff_type"] = results[0].staff_type;
    staff_nurse_report["staff_category"] = results[0].staff_category;
    staff_nurse_report['worked'] = worked;
    staff_nurse_report['shift'] = shift;
    staff_nurse_report['OT_Hours'] = extended;
    staff_nurse_report['leave'] = leave;
    staff_nurse_report['total_payable'] = total_payable;
    testing = worked + " " + extended + " " + shift + " " + leave + " " + total_payable;


    res.status(200).json({ 'Result': staff_nurse_report });
    console.log(staff_nurse_report);

  });


};

const AllStaffNurseReport = async (req, res) => {
  // const query = "SELECT id, full_name, employee_id,vendor_id FROM staffs"
  console.log(req.query);
  var { from_date, to_date, branch_id } = req.query;
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

  all_branches = default_branches.map(tt => tt.id);
  const filter_branches = !(branch_id) ? all_branches : branch_id;
  from_date = !(from_date) ? today : from_date;
  to_date = !(to_date) ? today : to_date;


  //test=from_date+" "+to_date+" "+all_branches+" "+staff_id;

  query = "SELECT date_format(staff_nurse_allocation.schedule_date,'%Y-%m-%d') as schedule_date,staffs.full_name as full_name,staffs.employee_id as employee_id,master_branches.branch_name as branch_name,staff_vendor_details.name as resource,if(staff_vendor_details.name='Athulya','In-House','Out-source') as staff_type,staff_master_duty.duty_name as staff_category,master_shifts.shift_name,staff_nurse_allocation.ot_type as ot_type,staff_nurse_allocation.ot_hrs_shift as ot_hrs_shift FROM `staff_nurse_allocation` join master_branches on staff_nurse_allocation.branch_id=master_branches.id join staffs on staff_nurse_allocation.staff_id=staffs.id join staff_vendor_details on staffs.vendor_id=staff_vendor_details.id join staff_master_duty on staff_nurse_allocation.duty_type_id=staff_master_duty.id join master_shifts on staff_nurse_allocation.staff_nurse_shift=master_shifts.id where staff_nurse_allocation.branch_id in (?) and staff_nurse_allocation.schedule_date between ? and ? ;";
  db.query(query, [branch_id, from_date, to_date], (err, results) => {

    res.status(200).json({ 'Result': results });
  });


};

module.exports = {
  StaffReportsModule,
  DutyWiseReport,
  StaffNurseReport,
  AllStaffNurseReport
};