var db = require("../db/connection.js").mysql_pool;
var express = require("express");
var app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  next();
});

const floorAllocation = (req, res) => {
  const body = req.body;
  console.log(body);
  const tower = req.body.tower;
  const date = req.body.date;
  const query =
    "SELECT master_rooms.branch_id,room_number,master_beds.id as bed_id,master_rooms.floor,master_sections.id as section_id,master_floor_section.tower as tower FROM master_floor_section join master_rooms on master_floor_section.id=master_rooms.floor join master_beds on master_beds.room_id=master_rooms.id join master_sections on master_floor_section.section=master_sections.abbr where master_floor_section.branch_id=" +
    req.body.branch_id +
    " and master_floor_section.floor='" +
    req.body.floor +
    "' and master_floor_section.tower=" +
    req.body.tower +
    " and master_sections.abbr='" +
    req.body.section +
    "' and master_floor_section.status='Active';";
  console.log("ttt" + query);
  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching staff:", err);
      res.status(500).send("Error fetching shift");
    } else {
      console.log(result);
      // result.forEach(function(obj)
      // {
      //  console.log(obj.room_number);
      // });
      const present = Array.isArray(result) && result.length;
      //console.log(t);
      if (present == 0) {
        res.status(500).json("Error in configuring rooms and beds..");
      } else {
        var today = date;
        // var dd = String(today.getDate()).padStart(2, "0");
        // var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        // var yyyy = today.getFullYear();
        // today = yyyy + "-" + mm + "-" + dd;
        const user_id = 123;
        const floor = req.body.floor;
        const floor_abbr = req.body.floor;
        // const tower=req.body.tower;
        const floor_map = new Map();
        floor_map.set("G", 0);
        floor_map.set("F1", 1);
        floor_map.set("F2", 2);
        floor_map.set("F3", 3);
        floor_map.set("F4", 4);
        floor_map.set("F5", 5);
        floor_map.set("F6", 6);
        floor_map.set("F7", 7);
        floor_map.set("F8", 8);
        floor_map.set("F9", 9);
        floor_map.set("F10", 10);
        floor_map.set("F11", 11);
        const master_floor = floor_map.get(floor_abbr);

        const branch_id = req.body.branch_id;
        const section_id =
          "select id from master_sections where abbr='" +
          req.body.section +
          "'";
        const staff_id =
          "select id,source from staffs where employee_id='" +
          req.body.emp_id +
          "';select id from master_sections where abbr='" +
          req.body.section +
          "';";
        const duty_id = req.body.duty;
        const shift = req.body.shift;
        const vendor_id = req.body.vendor;
        // const staff_payable =  vendor_id === "Athulya" ? 0 : req.body.staff_payable;
        const staff_payable = req.body.staff_payable;

        console.log(vendor_id);
        db.query(staff_id, (err, result1) => {
          if (err) {
            console.error("Error fetching staff:", err);
            res.status(500).send("Error fetching shift");
          } else {
            const data_to_insert = [];

            for (var j = 0; j < result.length; j++) {
              var tmp = {};
              tmp["branch_id"] = result[j].branch_id;
              tmp["user_id"] = user_id;
              tmp["tower"] = tower;
              tmp["master_floor"] = master_floor;
              tmp["room_number"] = result[j].room_number;
              tmp["bed_id"] = result[j].bed_id;
              tmp["duty_type_id"] = parseFloat(duty_id);
              tmp["floor"] = result[j].floor;
              tmp["section_id"] = result1[1][0].id;
              tmp["shift"] = parseFloat(shift);
              tmp["staff_id"] = result1[0][0].id;
              tmp["staff_source"] = result1[0][0].source;
              tmp["schedule_date"] = today;
              tmp["staff_payable"] = staff_payable;

              //const test="{ branch_id: "+branch_id+", user_id: "+user_id+", room_no: '"+room_number+"', bed_no: "+bed_id+", duty_type_id: "+duty_id+", floor: "+floor_id+", section_id: "+section_id1+", staff_id: "+staff_id1+", staff_source: '"+staff_source+"', shift: "+shift+", schedule: "+today+" }";
              data_to_insert.push(tmp);
            }
            console.log(data_to_insert);
            insertBulkData(
              data_to_insert,
              req.body.section,
              today,
              branch_id,
              floor,
              tower,
              shift,
              res // Pass the 'res' object as a parameter to the insertBulkData function
            )
              .then((result) => {
                if (result === "Record exists.") {
                  return res.status(400).json({ response: result });
                } else if (result === "Bulk insert successful.") {
                  return res.status(200).json({ response: result });
                } else {
                  return res.status(500).json({ response: result });
                }
              })
              .catch((error) => {
                console.error("Error:", error);
              });
          }
        });
      }
    }
  });
};

async function insertBulkData(
  data_to_insert,
  section_id,
  todays,
  branch_id,
  floor,
  tower,
  shift
) {
  try {
    const recordexists =
      "select * from staff_allocation where schedule_date='" +
      todays +
      "' and section_id=(select distinct id from master_sections where abbr='" +
      section_id +
      "') and floor = (select distinct id from master_floor_section where floor='" +
      floor +
      "' and branch_id=" +
      branch_id +
      " and section='" +
      section_id +
      "' and master_floor_section.tower=" +
      tower +
      ") and shift=" +
      shift +
      "";
    console.log(recordexists);
    const exists = await new Promise((resolve, reject) => {
      db.query(recordexists, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
    if (exists.length > 0) {
      console.log("Record exists.");
      return "Record exists";
    } else {
      // Perform the bulk insert operation here
      // Your bulk insert code goes here

      const query =
        "INSERT INTO staff_allocation (branch_id, user_id, room_no, bed_id, duty_type_id,tower, master_floor,floor, section_id, staff_id, staff_source, shift, staff_payable,schedule_date) VALUES ?";

      const values = data_to_insert.map((item) => [
        item.branch_id,
        item.user_id,
        item.room_number,
        item.bed_id,
        item.duty_type_id,
        item.tower,
        item.master_floor,
        item.floor,
        item.section_id,
        item.staff_id,
        item.staff_source,
        item.shift,
        item.staff_payable,
        item.schedule_date,
      ]);
      var sql = "INSERT INTO staff_allocation (branch_id, room_no) VALUES ?";

      await db.query(query, [values], (err, result) => {
        if (err) {
          console.log(err);
        }
      });

      return "Bulk insert successful.";
      //console.log("Bulk insert successful.");
    }
  } catch (error) {
    console.error("Error performing bulk insert:", error);
  } finally {
  }
}

const floorAllocationUpdate = (req, res) => {
  const floorAllocationId = req.params.id;
  const { duty_type_id, staff_id, staff_payable, service_payable } = req.body;
  console.log(req.body);

  const sql = `UPDATE staff_allocation SET duty_type_id = ?, staff_id = ?, staff_payable = ?, service_payable = ? WHERE id = ?`;

  console.log(sql);

  db.query(
    sql,
    [duty_type_id, staff_id, staff_payable, service_payable, floorAllocationId],
    (error, result) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.status(200).json({ status: 200, error: null, response: "Success" });
      console.log(result);
      console.log(sql);
    }
  );
};

const floorallocationbulkupdate = (req, res) => {
  console.log(req.body);
  const floorAllocationUpdate = req.body;
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;

  const {
    branch_id,
    tower,
    floor,
    section,
    duty,
    emp_id,
    shift,
    vendor,
    staff_payable,
    staff_source,
  } = req.body;

  const section_query =
    "select id,source from staffs where employee_id='" +
    req.body.emp_id +
    "';select id from master_sections where abbr='" +
    req.body.section +
    "';select id FROM master_floor_section where floor='" +
    req.body.floor +
    "' and section='" +
    req.body.section +
    "' and branch_id=" +
    req.body.branch_id +
    " and tower=" +
    req.body.tower +
    ";";
  db.query(section_query, (err, result) => {
    if (err) {
      console.error("Error fetching staff:", err);
      res.status(500).send("Error fetching shift");
    } else {
      console.log(result);
      const floor = result[2][0].id;
      const branch_id = req.body.branch_id;
      const updated_staff_payable = req.body.staff_payable;
      const duty_type_id = req.body.duty;
      const updated_source = result[0][0].source;
      const updated_staff_id = result[0][0].id;
      const updated_section = result[1][0].id;
      console.log(
        updated_staff_id +
        "" +
        updated_section +
        "" +
        updated_source +
        "" +
        updated_staff_payable +
        "" +
        floor
      );

      const data_fetch =
        "select count(*) as total from staff_allocation where branch_id=? and schedule_date='" +
        today +
        "' and floor=? and section_id=? and duty_type_id=?";

      db.query(
        data_fetch,
        [branch_id, floor, updated_section, duty_type_id],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            console.log(result[0].total);
            const total = result[0].total;
            if (total > 0) {
              const update_query =
                "update staff_allocation set staff_id=?,staff_payable=? where floor=? and section_id=? and branch_id=? and schedule_date='" +
                today +
                "' and duty_type_id=?";

              db.query(
                update_query,
                [
                  updated_staff_id,
                  updated_staff_payable,
                  floor,
                  updated_section,
                  branch_id,
                  duty_type_id,
                ],
                (err, result) => {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log(update_query);
                    console.log(result);
                  }
                }
              );
              res.status(200).json({
                status: 200,
                error: null,
                response:
                  "Floor Data Updated for staff " +
                  req.body.emp_id +
                  " to floor " +
                  req.body.floor,
              });
            } else {
              res
                .status(200)
                .json({ response: "Data not present for given filter" });
            }
          }
        }
      );
    }
  });
};

const StaffNurseAllocation = (req, res) => {
  const body = req.body;
  console.log(body);

  const query =
    "select id,source from staffs where employee_id='" + req.body.emp_id + "'";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching staff:", err);
      res.status(500).send("Error fetching shift");
    } else {
      console.log(result[0].id);
      user_id = 123;
      branch_id = req.body.branch_id;
      duty_type_id = req.body.duty;
      tower = req.body.tower;
      floor_abbr = req.body.floor;
      const floor_map = new Map();
      floor_map.set('G', 0);
      floor_map.set('F1', 1);
      floor_map.set('F2', 2);
      floor_map.set('F3', 3);
      floor_map.set('F4', 4);
      floor_map.set('F5', 5);
      floor_map.set('F6', 6);
      floor_map.set('F7', 7);
      floor_map.set('F8', 8);
      floor_map.set('F9', 9);
      floor_map.set('F10', 10);
      floor_map.set('F11', 11);
      floor = floor_map.get(floor_abbr);

      staff_id = result[0].id;
      staff_source = result[0].source;
      staff_nurse_shift = req.body.shift;
      staff_payable = req.body.staff_payable;
      service_payable = (req.body.service_payable != "") ? req.body.service_payable : 0;

      console.log(staff_id);
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, "0");
      var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = today.getFullYear();
      today = yyyy + "-" + mm + "-" + dd;
      schedule_date = today;
      status_1 = 1;
      const query_1 =
        "SELECT count(*) as total FROM `staff_nurse_allocation` where schedule_date='" +
        today +
        "' and branch_id=" +
        req.body.branch_id +
        " and tower=" +
        req.body.tower +
        " and floor='" +
        req.body.floor +
        "' and duty_type_id=" +
        req.body.duty +
        " and staff_nurse_shift=" +
        req.body.shift;
      //const query_1 ="SELECT count(*) as total FROM `staff_nurse_allocation` where schedule_date='"+today+"' and branch_id="+req.body.branch_id+" and floor='"+req.body.floor+"' and duty_type_id="+req.body.duty+" and staff_nurse_shift="+req.body.shift;

      db.query(query_1, (err, result) => {
        if (err) {
          console.error("Error fetching staff_nurse_allocation:", err);
          res.status(500).send("Error fetching staff_nurse_allocation");
        } else {
          console.log(result[0].total);
          const present = result[0].total;
          if (present > 0) {
            res
              .status(500)
              .send(
                "Already Staff Nurse is allocated to that Floor for that shift"
              );
          } else {
            const query =
              "INSERT INTO `staff_nurse_allocation`(`branch_id`, `tower`,`user_id`, `duty_type_id`, `floor`, `staff_id`, `staff_source`, `staff_nurse_shift`, `staff_payable`, `service_payable`, `schedule_date`, `status`) VALUES (" +
              branch_id +
              "," +
              tower +
              "," +
              user_id +
              "," +
              duty_type_id +
              "," +
              floor +
              "," +
              staff_id +
              ",'" +
              staff_source +
              "'," +
              staff_nurse_shift +
              "," +
              staff_payable +
              "," +
              service_payable +
              ",'" +
              schedule_date +
              "'," +
              status_1 +
              ")";
            console.log(query);
            db.query(query, (err, result) => {
              if (err) {
                console.error("Error fetching staff_nurse_allocation:", err);
                res
                  .status(500)
                  .send("Error in inserting staff nurse allocation");
              } else {
                res
                  .status(200)
                  .send("Staff Nurse Allocated for the floor " + floor);
              }
            });
          }
        }
      });
    }
  });
};


const StaffNurseOTAllocation = (req, res) => {
  const body = req.body;
  const id = req.params.id;
  console.log("params" + id);
  console.log(body);
  user_id = 123;
  ot_type = req.body.ot_type;
  emp_id = req.body.emp_id;
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;
  schedule_date = today;

  var staff_nurse_allocation_id = id;
  var query =
    "select * from staff_nurse_allocation where status=1 and id=" +
    staff_nurse_allocation_id;
  console.log(ot_type + " " + emp_id + " ");
  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).send("Error fetching data");
    } else {
      console.log(result);
      duplicate = result[0];
      var present = result.length;
      var query =
        "select id,source from staffs where employee_id='" +
        req.body.emp_id +
        "'";

      db.query(query, (err, result) => {
        if (err) {
          console.error("Error fetching staff:", err);
          res.status(500).send("Error fetching shift");
        } else {
          //console.log(result[0].id);
          staff_id = result[0].id;
          staff_source = result[0].source;

          if (present > 0) {
            if (ot_type == "Extended") {
              // insert operation in staff_nurse_allocation,staff_leav

              data = result[0];

              staff_payable = req.body.staff_payable;
              service_payable = req.body.service_payable;

              var insert_query =
                "insert into staff_nurse_allocation (branch_id,tower, user_id, duty_type_id, floor, staff_payable,  schedule_date, ot_type, ot_hrs_shift,status,staff_nurse_shift,staff_id,staff_source) values(?,?,?,?,?,?,?,?,?,?,?,?,?); update staff_nurse_allocation set status=0,ot_type=null where id=" +
                staff_nurse_allocation_id +
                ";";
              //var insert_query="insert into staff_nurse_allocation (branch_id, user_id) values(?,?)";
              console.log(insert_query);

              //Fetch staff payable based on previous shift
              // fetch_staff_payable="select distinct staff_payable from staff_nurse_allocation where staff_id="+staff_id+" and schedule_date='"+today+"'";

              // db.query(fetch_staff_payable,(err,result1)=>{
              //   if(err)
              //   {
              //     console.log(err)
              //   }else{
              //     console.log(result1[0].staff_payable);
              //     staff_payable=result1[0].staff_payable;

              //     db.query(insert_query,[duplicate.branch_id,user_id,duplicate.duty_type_id,duplicate.floor,staff_payable,duplicate.schedule_date,req.body.ot_type,req.body.ot_hrs_shift,1,req.body.ot_shift,data.id,data.source],(err,result)=>{

              //     if (err) {
              //       console.error("Error fetching data:", err);
              //       res.status(500).send("Error fetching data");
              //     }else{
              //       res.status(200).json({ response: "OT Allocated to 3 hrs for "+req.body.emp_id });
              //     }

              //   });

              //   }
              //   //console.log(fetch_staff_payable);

              // });

              db.query(
                insert_query,
                [
                  duplicate.branch_id,
                  duplicate.tower,
                  user_id,
                  duplicate.duty_type_id,
                  duplicate.floor,
                  staff_payable,
                  duplicate.schedule_date,
                  req.body.ot_type,
                  req.body.ot_hrs_shift,
                  1,
                  req.body.ot_shift,
                  data.id,
                  data.source,
                ],
                (err, result) => {
                  if (err) {
                    console.error("Error fetching data:", err);
                    res.status(500).send("Error fetching data");
                  } else {
                    res.status(200).json({
                      response: "OT Allocated to 3 hrs for " + req.body.emp_id,
                    });
                  }
                }
              );
              console.log(duplicate.branch_id);
            } else if (ot_type == "Shift") {
              // update operation in staff_nurse_allocation
              query =
                "update staff_nurse_allocation set staff_id=?,staff_source=?,ot_type='" +
                req.body.ot_type +
                "',staff_payable=?,service_payable=?,ot_hrs_shift=? where id=" +
                staff_nurse_allocation_id;
              staff_query =
                "select id,source from staffs where employee_id='" +
                req.body.emp_id +
                "'";
              db.query(staff_query, (err, result) => {
                if (err) {
                  console.error("Error fetching staff:", err);
                  res.status(500).send("Error fetching shift");
                } else {
                  staff_id = result[0].id;
                  staff_source = result[0].source;
                  db.query(
                    query,
                    [
                      staff_id,
                      staff_source,
                      req.body.staff_payable,
                      req.body.service_payable,
                      req.body.ot_hrs_shift,
                    ],
                    (err, result) => {
                      res.status(200).json({
                        response: "Shift Updated for " + req.body.emp_id,
                      });
                    }
                  );
                }
              });
            }
          } else {
            res.status(200).json({ response: "Data not present" });
          }
        }
      });
    }
  });
};
// const   StaffNurseOTAllocation = async (req, res) => {
//   try {
//     console.log(req.body);
//     console.log(req.id);
//     const staffId = 2;
//     console.log(staffId);
//     const {
//       ot_type,
//       emp_id,
//       staff_payable,
//       service_payable,
//       ot_hrs_shift,
//       ot_shift,
//     } = req.body;

//     const today = new Date().toISOString().split("T")[0];

//     const result = await new Promise((resolve, reject) => {
//       db.query(
//         "SELECT * FROM staff_nurse_allocation WHERE status = 1 AND id = ?",
//         [staffId],
//         (err, result) => {
//           if (err) {
//             console.error("Error fetching data:", err);
//             reject(err);
//           } else {
//             resolve(result);
//           }
//         }
//       );
//     });

//     console.log(result);
//     const present = result.length;
//     if (present === 0) {
//       return res.status(204).json({ response: "Data not present" });
//     }

//     const duplicate = result[0];

//     const staffResult = await new Promise((resolve, reject) => {
//       db.query(
//         "SELECT id, source FROM staffs WHERE employee_id = ?",
//         [emp_id],
//         (err, staffResult) => {
//           if (err) {
//             console.error("Error fetching staff:", err);
//             reject(err);
//           } else {
//             resolve(staffResult);
//           }
//         }
//       );
//     });

//     const data = staffResult[0];
//     const staff_id = data.id;
//     const staff_source = data.source;

//     const insertQuery =
//       "INSERT INTO staff_nurse_allocation (branch_id, user_id, duty_type_id, floor, staff_payable, schedule_date, ot_type, ot_hrs_shift, status, staff_nurse_shift, staff_id, staff_source) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?); UPDATE staff_nurse_allocation SET status = 0, ot_type = NULL WHERE id = ?";

//     const fetchStaffPayable =
//       "SELECT DISTINCT staff_payable FROM staff_nurse_allocation WHERE staff_id = ? AND schedule_date = ?";

//     const fetched_staff_payable_result = await new Promise(
//       (resolve, reject) => {
//         db.query(fetchStaffPayable, [staff_id, today], (err, result1) => {
//           if (err) {
//             console.log(err);
//             reject(err);
//           } else {
//             resolve(result1);
//           }
//         });
//       }
//     );
//     console.log(req.body);
//     // const fetched_staff_payable = fetched_staff_payable_result[0].staff_payable;
//     const fetched_staff_payable = 1;

//     const insertionResult = await new Promise((resolve, reject) => {
//       db.query(
//         insertQuery,
//         [
//           duplicate.branch_id,
//           123, // user_id (you might want to fetch this dynamically)
//           duplicate.duty_type_id,
//           duplicate.floor,
//           fetched_staff_payable,
//           duplicate.schedule_date,
//           ot_type,
//           ot_hrs_shift,
//           1,
//           ot_shift,
//           data.id,
//           data.source,
//           1,
//         ],
//         (err, result) => {
//           if (err) {
//             console.error("Error inserting data:", err);
//             reject(err);
//           } else {
//             resolve(result);
//           }
//         }
//       );
//     });

//     res.status(200).json({
//       response: `OT Allocated to ${ot_hrs_shift} hrs for ${emp_id}`,
//     });
//   } catch (error) {
//     console.error("Error updating shift:", error);
//     Swal.fire("Error!", "Failed to update shift.", "error");

//     // Show specific error message if available
//     if (error.response && error.response.data) {
//       Swal.fire("Error!", error.response.data, "error");
//     } else {
//       Swal.fire("Error!", "Internal Server Error", "error");
//     }
//     // ... handle error, e.g., show error message to the user
//   }
// };

// const StaffNurseOTAllocation = (req, res) => {
//   const body = req.body;
//   const staffId = req.params.id;
//   console.log(body);
//   console.log("Testing hit rate");
//   user_id = 123;
//   ot_type = req.body.ot_type;
//   emp_id = req.body.emp_id;
//   var today = new Date();
//   var dd = String(today.getDate()).padStart(2, "0");
//   var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
//   var yyyy = today.getFullYear();
//   today = yyyy + "-" + mm + "-" + dd;
//   schedule_date = today;

//   var staff_nurse_allocation_id = staffId;
//   var query =
//     "select * from staff_nurse_allocation where status=1 and id=" +
//     staff_nurse_allocation_id;
//   console.log("ID:" + query);
//   db.query(query, (err, result) => {
//     if (err) {
//       console.error("Error fetching data:", err);
//       res.status(500).send("Error fetching data");
//     } else {
//       console.log(result);
//       console.log("Testing for result..");
//       duplicate = result[0];
//       var present = result.length;
//       var query =
//         "select id,source from staffs where employee_id='" +
//         req.body.emp_id +
//         "'";

//       db.query(query, (err, result) => {
//         if (err) {
//           console.error("Error fetching staff:", err);
//           res.status(500).send("Error fetching shift");
//         } else {
//           //console.log(result[0].id);
//           staff_id = result[0].id;
//           staff_source = result[0].source;

//           if (present > 0) {
//             if (ot_type == "OTHours") {
//               // insert operation in staff_nurse_allocation,staff_leav

//               data = result[0];

//               staff_payable = req.body.staff_payable;
//               service_payable = req.body.service_payable;

//               var insert_query =
//                 "insert into staff_nurse_allocation (branch_id, user_id, duty_type_id, floor, staff_payable,  schedule_date, ot_type, ot_hrs_shift,status,staff_nurse_shift,staff_id,staff_source) values(?,?,?,?,?,?,?,?,?,?,?,?); update staff_nurse_allocation set status=0,ot_type=null where id=" +
//                 staff_nurse_allocation_id +
//                 ";";
//               //var insert_query="insert into staff_nurse_allocation (branch_id, user_id) values(?,?)";
//               console.log(insert_query);

//               //Fetch staff payable based on previous shift
//               fetch_staff_payable =
//                 "select distinct staff_payable from staff_nurse_allocation where staff_id=" +
//                 staff_id +
//                 " and schedule_date='" +
//                 today +
//                 "'";

//               db.query(fetch_staff_payable, (err, result1) => {
//                 if (err) {
//                   console.log(err);
//                 } else {
//                   console.log(result1[0].staff_payable);
//                   // staff_payable = result1[0].staff_payable;
//                   staff_payable = 2;

//                   db.query(
//                     insert_query,
//                     [
//                       duplicate.branch_id,
//                       user_id,
//                       duplicate.duty_type_id,
//                       duplicate.floor,
//                       staff_payable,
//                       duplicate.schedule_date,
//                       req.body.ot_type,
//                       req.body.ot_hrs_shift,
//                       1,
//                       req.body.ot_shift,
//                       data.id,
//                       data.source,
//                     ],
//                     (err, result) => {
//                       if (err) {
//                         console.error("Error fetching data:", err);
//                         res.status(500).send("Error fetching data");
//                       } else {
//                         res.status(200).json({
//                           response:
//                             "OT Allocated to 3 hrs for " + req.body.emp_id,
//                         });
//                       }
//                     }
//                   );
//                 }
//                 //console.log(fetch_staff_payable);
//               });

//               db.query(
//                 insert_query,
//                 [
//                   duplicate.branch_id,
//                   user_id,
//                   duplicate.duty_type_id,
//                   duplicate.floor,
//                   staff_payable,
//                   duplicate.schedule_date,
//                   req.body.ot_type,
//                   req.body.ot_hrs_shift,
//                   1,
//                   req.body.ot_shift,
//                   data.id,
//                   data.source,
//                 ],
//                 (err, result) => {
//                   if (err) {
//                     console.error("Error fetching data:", err);
//                     res.status(500).send("Error fetching data");
//                   } else {
//                     res.status(200).json({
//                       response: "OT Allocated to 3 hrs for " + req.body.emp_id,
//                     });
//                   }
//                 }
//               );
//               console.log(duplicate.branch_id);
//             } else if (ot_type == "OTShift") {
//               // update operation in staff_nurse_allocation
//               query =
//                 "update staff_nurse_allocation set staff_id=?,staff_source=?,ot_type='" +
//                 req.body.ot_type +
//                 "',staff_payable=?,service_payable=?,ot_hrs_shift=? where id=" +
//                 staff_nurse_allocation_id;
//               staff_query =
//                 "select id,source from staffs where employee_id='" +
//                 req.body.emp_id +
//                 "'";
//               db.query(staff_query, (err, result) => {
//                 if (err) {
//                   console.error("Error fetching staff:", err);
//                   res.status(500).send("Error fetching shift");
//                 } else {
//                   staff_id = result[0].id;
//                   staff_source = result[0].source;
//                   db.query(
//                     query,
//                     [
//                       staff_id,
//                       staff_source,
//                       req.body.staff_payable,
//                       req.body.service_payable,
//                       req.body.ot_hrs_shift,
//                     ],
//                     (err, result) => {
//                       res.status(200).json({
//                         response: "Shift Updated for " + req.body.emp_id,
//                       });
//                     }
//                   );
//                 }
//               });
//             }
//           } else {
//             res.status(200).json({ response: "Data not present" });
//           }
//         }
//       });
//     }
//   });
// };

// const StaffNurseOTAllocation1 = (req, res) => {
//   const data = req.body;

//   console.log(data);
//   // Construct the SQL query
//   const query = `
//     INSERT INTO staff_nurse_allocation_demo
//     (ot_shift, leave_reason, ot_type, ot_hrs_shift, emp_id, staff_payable)
//     VALUES (?, ?, ?, ?, ?, ?)
//   `;

//   // Prepare and execute the query
//   db.query(
//     query,
//     [
//       data.ot_shift,
//       data.leave_reason,
//       data.ot_type,
//       data.ot_hrs_shift,
//       data.emp_id,
//       data.staff_payable,
//     ],
//     (err, result) => {
//       if (err) {
//         console.error("Error inserting data:", err);
//         res.status(500).json({ error: "Error inserting data" });
//         return;
//       }
//       console.log("Data inserted successfully");
//       res.json({ message: "Data inserted successfully" });
//     }
//   );
// };

const StaffNurseOTAllocationGetByUser = (req, res) => {
  const shiftId = req.params.id;

  const query = `SELECT * FROM staff_nurse_allocation WHERE id = "${shiftId}"`;
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

module.exports = {
  floorAllocation,
  floorAllocationUpdate,
  floorallocationbulkupdate,
  StaffNurseAllocation,
  StaffNurseOTAllocation,
  StaffNurseOTAllocationGetByUser,
};
