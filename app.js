var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const routes = require("./routes/allroutes");
var bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cron = require('node-cron');
var dbPool = require('./db/connection').mysql_pool;
const he = require("he");
const axios = require('axios');

// Requiring in-built https for creating
// https server
const https = require("https");
const fs = require("fs");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/", routes);

var db = require("./db/connection").mysql_pool;
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

const options = {
  key: fs.readFileSync("athulyahomecare.org.key"),
  cert: fs.readFileSync("athulyahomecare.org.cert"),
};

const PORT = process.env.PORT || 4040;

// const server = https.createServer(options, app);

// server.listen(PORT, function () {
//   var datetime = new Date();
//   console.log(datetime.toISOString().slice(0, 10));
//   console.log(`Server is running on port ${PORT}.`);
// });


const contactEmail = nodemailer.createTransport({
  host: "mail.athulyahomecare.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "noreply@athulyaseniorcare.com", // generated ethereal user
    pass: "Athulya@123", // generated ethereal password
  },
});

contactEmail.verify((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Node Cron Server Ready to Send");
  }
});

const gmtCronSchedule9 = "20 16 * * *";



cron.schedule(gmtCronSchedule9, () => {

  newComplaint();
},{
  scheduled:true,
  timezone:"Asia/Kolkata"
});


const From = "noreply@athulyaseniorcare.com";
const tomaillist = "muthukumar@athulyaliving.com";


const newComplaint = () => {
  const nowIST = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
  const currentDateIST = new Date(nowIST);
  const formattedDate = currentDateIST.toISOString().split('T')[0];
  console.log(`Current Date in Asia/Kolkata timezone: ${formattedDate}`);
  
  const sql = `SELECT * FROM patient_activity_vitals 
  join patients on patient_activity_vitals.patient_id = patients.id
  join master_branches on patients.branch_id = master_branches.id
  where patient_activity_vitals.schedule_date =CURRENT_DATE`;

  console.log(sql);

  // Execute the database query
  dbPool.query(sql, (err, result) => {
if (err) {
  console.error("Database query error:", err);
  return;
}

console.log("Database query result:", result);
let mailOptions;
if (result.length === 0) {
  mailOptions = {
    from: From,
    to: tomaillist,
    subject: `Vitals List "${formattedDate }"`,
    html: `<p>Vitals List</p>
    <p>No data available "${formattedDate }"</p>
    `,
  };
} else {
  mailOptions = {
    from: From,
    to:tomaillist ,
    subject: `Vitals  "${formattedDate }"`,
    html: `
    <html>
    <head>
    <style>
    table {
      border: 1px solid #333;
      border-collapse: collapse;
      width: 100%;
      box-shadow: 0px 0px 20px rgba(114, 114, 113, 0.5);                 
      background-color: white;
      border-radius: 15px;
      -moz-border-radius: 15px;
      
    }
    th, td {
      border: 1px solid #333;
      padding: 8px;
      text-align: left;
    }
    th {
      background-color: #176291;
      color: #fff;
  
    }
    tr:nth-child(even) {background-color: #f2f2f2;}
  </style>
    </head>
    <body>
  <h1>Patient Vitals Update - ${formattedDate}</h1>
  <table>
    <thead>
      <tr>
        <th>S.NO</th>
        <th>Patient ID</th>
        <th>Full Name</th>
        <th>Branch Name</th>
        <th>Date & Time</th>
        <th>Blood Pressure (Systolic/Diastolic)</th>
        <th>Pulse</th>
        <th>Respiratory Rate</th>
        <th>Body Temperature</th>
        <th>Oxygen Saturation (SpO2)</th>              
        <th>Pain Score</th>              
        <th>Pain Location</th>              
        <th>Solid Intake</th>              
        <th>Sugar Check</th>              
        <th>Motion</th>              
        <th>Output</th>              
        <th>Urine Output</th>              
      </tr>
    </thead>
    <tbody>
      ${result.map((row, index) => {
        const createdAtDate = new Date(row.created_at);

        // Format the date to YYYY-MM-DD HH:MM:SS format
        const formattedCreatedAt = createdAtDate.getFullYear() + "-" +
            ("0" + (createdAtDate.getMonth() + 1)).slice(-2) + "-" +
            ("0" + createdAtDate.getDate()).slice(-2) + " " +
            ("0" + createdAtDate.getHours()).slice(-2) + ":" +
            ("0" + createdAtDate.getMinutes()).slice(-2) + ":" +
            ("0" + createdAtDate.getSeconds()).slice(-2);
        return `
                <tr>
                  <td>${index + 1}</td>
                  <td>${row.patient_id}</td>
                  <td> ${row.last_name} .${row.first_name} ${row.last_name} </td>
                  <td>${row.branch_name}</td>
                  <td>${row.formattedCreatedAt}</td>
                  <td>${row.activity_bp_systole}/${row.activity_bp_diastole}</td>               
                  <td>${row.activity_pulse} bpm</td>
                  <td>${row.activity_temp}°F</td>
                  <td>${row.activity_resp} breaths/min</td>
                  <td>${row.activity_spo}%</td>
                  <td>${row.activity_pain_score}</td>
                  <td>${row.activity_pain_location_description}</td>
                  <td>${row.activity_solid_intake}</td>
                  <td>${row.activity_sugar_check}</td>
                  <td>${row.activity_motion}</td>
                  <td>${row.activity_output}</td>
                  <td>${row.activity_urine_output} mL</td>
                </tr>
              `;
      }).join('')}
    </tbody>
  </table>
</body>
  </html>
`
  };
}

// Send the email
contactEmail.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error("Send mail error:", error);
  } else {
    console.log("Email sent:", info.response);
  }
});
});

}

cron.schedule('0 */2 * * *', () => {
  console.log('Running a task every 2 minutes');
  
  const patient_daily_vitals = `
    SELECT * FROM patient_activity_vitals 
    JOIN patients ON patient_activity_vitals.patient_id = patients.id
    JOIN master_branches ON patients.branch_id = master_branches.id
    WHERE patient_activity_vitals.schedule_date = CURRENT_DATE AND patients.id = '27165'
  `;

  dbPool.query(patient_daily_vitals, (err, results) => {
    if (err) throw err;

    if (results.length === 0) {
      console.log('No data found for the current date');
      return;
    }
    const phoneNumbers = ["919566420177", "919578127837", "917667338723"];
    results.forEach((row) => {
      // Call sendMessage for each phoneNumber
      phoneNumbers.forEach((phoneNumber) => {
        sendMessage(row, phoneNumber);
      });
    });
    console.log(results);
  });
});

const sendMessage = (patientData,phoneNumber) => {
  const apiUrl = 'https://api.bizmagnets.ai/dev/message/mCbGWzCH/sendMessage';
  const apiKey = 'c92ab7885f2f31bda9621436d28dc74e'; // Consider moving sensitive data like API keys to environment variables

  const textOrNA = (text) => text ? text.toString() : "N/A"; 

  // Prepare your message data here based on `patientData`
  const messageData = {
    to: phoneNumber, // This should be dynamic based on `patientData`
    type: "template",
    messaging_product: "whatsapp",
    template: {
      name: "vitals_response",
      language: {
        policy: "deterministic",
        code: "en"
      },
      components: [
        {
          type: "body",
          parameters: [
            // Fill in the parameters based on `patientData`
            { type: "text", text: textOrNA(patientData.patient_id) },
            { type: "text", text: textOrNA(patientData.first_name) },
            { type: "text", text: textOrNA(patientData.created_at) },
            { type: "text", text: textOrNA(patientData.activity_bp_systole) },
            { type: "text", text: textOrNA(patientData.activity_bp_diastole) },
            { type: "text", text: textOrNA(patientData.activity_pulse) },
            { type: "text", text: textOrNA(patientData.activity_resp) },
            { type: "text", text: textOrNA(patientData.activity_temp) },
            { type: "text", text: textOrNA(patientData.activity_spo) },
            { type: "text", text: textOrNA(patientData.activity_pain_score) },
            { type: "text", text: textOrNA(patientData.activity_pain_location_description) },
            { type: "text", text: textOrNA(patientData.activity_solid_intake) },
            { type: "text", text: textOrNA(patientData.activity_sugar_check) },
            { type: "text", text: textOrNA(patientData.activity_motion) },
            { type: "text", text: textOrNA(patientData.activity_output) },
            { type: "text", text: textOrNA(patientData.activity_urine_output) },
           
            // Add more parameters as needed
          ]
        }
      ]
    }
  };

  axios.post(apiUrl, messageData, {
    headers: {
      'X-API-KEY': apiKey,
      'Content-Type': 'application/json'
    }
  })
  .then((response) => {
    console.log('Message sent:', response.data);
  })
  .catch((error) => {
    console.error('Error sending message:', error);
  });
};



app.listen(PORT, () => {
  var datetime = new Date();
  console.log(datetime.toISOString().slice(0, 10));
  console.log(`Server is running on port ${PORT}.`);
});

module.exports = app;
