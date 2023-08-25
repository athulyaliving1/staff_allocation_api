var db = require("../db/connection.js").mysql_pool;

const floorAllocation = (req, res) => {
  const body = req.body;
  console.log(body);

  const query =
    "SELECT master_rooms.branch_id,room_number,master_beds.id as bed_id,master_rooms.floor,master_sections.id as section_id FROM master_floor_section join master_rooms on master_floor_section.id=master_rooms.floor join master_beds on master_beds.room_id=master_rooms.id join master_sections on master_floor_section.section=master_sections.abbr where master_floor_section.branch_id=" +
    req.body.branch_id +
    " and master_floor_section.floor='" +
    req.body.floor +
    "' and master_floor_section.tower=" +
    req.body.tower +
    " and master_sections.abbr='" +
    req.body.section +
    "' and master_floor_section.status='Active';";
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
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, "0");
        var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        var yyyy = today.getFullYear();
        today = yyyy + "-" + mm + "-" + dd;
        const user_id = 123;
        const floor = req.body.floor;
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
      "') and shift=" +
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
        "INSERT INTO staff_allocation (branch_id, user_id, room_no, bed_id, duty_type_id, floor, section_id, staff_id, staff_source, shift, staff_payable,schedule_date) VALUES ?";

      const values = data_to_insert.map((item) => [
        item.branch_id,
        item.user_id,
        item.room_number,
        item.bed_id,
        item.duty_type_id,
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

module.exports = {
  floorAllocation,
  floorAllocationUpdate,
  floorallocationbulkupdate,
};
