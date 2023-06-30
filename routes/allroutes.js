const app = require('express'); //import express
const router  = app.Router(); 

const registervendorController = require('../controllers/registervendor');

//Register Vendor 
router.post('/registervendor', registervendorController.newvendorregister); 


module.exports = router; // export to use in server.js