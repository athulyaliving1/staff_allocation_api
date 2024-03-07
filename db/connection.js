var mysql = require("mysql");
var config;



 config = {
  mysql_pool: mysql.createPool({
    host: "dbaas-db-10787912-do-user-15527658-0.c.db.ondigitalocean.com",
    user: "aaluser",
    password: "AVNS_fHFeMdTzckFxMa3MSZF",
    database: "theatgg6_sal_subscriber102", // replace with your actual database name
    port: 25060,
    multipleStatements: true,
    connectTimeout: 10000,
  }),








// config = {
//   mysql_pool: mysql.createPool({
//     host: "162.241.123.158",
//     user: "theatgg6_shg",
//     password: "r3pbWhs8psb5nitZjlpDvg",
//     database: "theatgg6_sal_subscriber102",
//     multipleStatements: true,
//   }),


  // mysql_pool : mysql.createPool({
  //     host     : '162.241.85.121',
  //     user     : 'athulslv_muthukumar',
  //     password : 'Athulya@123',
  //     database : 'athulslv_sal_subscriber102',
  //     multipleStatements: true
  // })
  // mysql_pool : mysql.createPool({
  //     host     : 'localhost',
  //     user     : 'root',
  //     password : 'root123',
  //     database : 'theatgg6_sal_subscriber102'
  // })
};





// Define the MySQL pool configuration
var mysqlPool = mysql.createPool({
  host: 'dbaas-db-10787912-do-user-15527658-0.c.db.ondigitalocean.com',
  user: 'aaluser',
  password: 'AVNS_fHFeMdTzckFxMa3MSZF',
  database: 'theatgg6_sal_subscriber102',
  port: 25060,
  multipleStatements: true,
  connectTimeout: 10000,
});

// Export the pool for use in other files
module.exports = mysqlPool;
module.exports = config;


