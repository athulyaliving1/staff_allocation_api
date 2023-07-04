const app = require('express'); //import express
const router = app.Router();

const vendorModule = require('../controllers/vendorModule');
const branchesModule = require('../controllers/branchesdepentModule');
const masterdutyModule = require('../controllers/masterdutyModule');


//Register Vendor 
router.post('/registervendor', vendorModule.newvendorregister);
router.get('/getvendor', vendorModule.getVendor);


//branches depent filter
router.get('/api/branches/cities', branchesModule.getcities)
router.get('/api/branches/countries', branchesModule.getcountries)
router.get('/api/branches/states', branchesModule.getstates)


//master duty

router.get('/api/floor/masterduty',masterdutyModule.getmasterduty)






module.exports = router; // export to use in server.js