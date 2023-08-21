const app = require("express"); //import express
const router = app.Router();

const vendorModule = require("../controllers/vendorModule");
const branchesModule = require("../controllers/branchesdepentModule");
const masterdutyModule = require("../controllers/masterdutyModule");
const staffModule = require("../controllers/staffModule");
const shiftModule = require("../controllers/shiftModule");
const shiftAllocationModule = require("../controllers/shiftAllocationModule.js");

//Register Vendor
router.post("/registervendor", vendorModule.newvendorregister);
router.get("/getvendor", vendorModule.getVendor);
router.delete("/deletevendor/:id", vendorModule.deleteVendor);
router.put("/updatevendor/:id", vendorModule.updateVendor);

//branches depent filter
router.get("/api/branches/cities", branchesModule.getcities);
router.get("/api/branches/countries", branchesModule.getcountries);
router.get("/api/branches/states", branchesModule.getstates);
router.get("/api/branches/location", branchesModule.branchlocation);
router.get("/api/branches/getTowers", branchesModule.getTower);
router.get("/api/branches/floor", branchesModule.getFloor);
router.get(
  "/api/branches/section/:branch_id/:floor",
  branchesModule.getSection
);

//master duty

router.get("/api/floor/masterduty", masterdutyModule.getmasterduty);

//staff

router.get("/api/staff/staffsearch", staffModule.staffSearch);
router.post("/api/staff/staffregister", staffModule.staffRegister);
router.get("/api/staff/staffprofile/:id", staffModule.staffProfile);

//shift
router.get("/api/shift/shiftsearch", shiftModule.shiftSearch);
router.get("/api/shift/roster", shiftModule.shiftRoster);
router.get("/api/shift/roster/:id", shiftModule.shiftRosterGetbyId);
router.put("/api/shift/rosterupdate/:id", shiftModule.shiftRosterUpdate);
router.get(
  "/api/shift/rosterbranch/:id",
  shiftModule.shiftRosterBranchesUpdate
);
router.get("/api/shift/rostermasterduty/:id", shiftModule.shiftRosterDutyFetch);
router.get(
  "/api/shift/rostermastershift/:id",
  shiftModule.shiftRosterShiftFetch
);
router.get(
  "/api/shift/rostermasterstaff/:id",
  shiftModule.shiftRosterStaffsFetch
);
router.get(
  "/api/shift/rosterfloorsection/:id",
  shiftModule.shiftRosterFloorsSectionFetch
);
router.get("/api/shift/rosterbed/:id", shiftModule.shiftRosterBedFetch);
router.get("/api/shift/rosterroom/:id", shiftModule.shiftRosterroomsFetch);

router.get("/api/shift/masterbranches", shiftModule.shiftMasterBranchFetch);

router.get("/api/shiftroster/masterfloor", shiftModule.shiftMasterFloorFetch);

router.get("/api/shift/masterSection", shiftModule.shiftMasterSectionFetch);

router.get("/api/shift/masterbeds", shiftModule.shiftMasterbedFetch);

router.get("/api/shift/vendorsearch/:id", shiftModule.shiftVendorsearch);

router.delete(
  "/api/shift/shiftrosterdelete/:id",
  shiftModule.shiftrosterdelete
);

//floor allocation

router.post(
  "/api/shiftallocation/floorallocation",
  shiftAllocationModule.floorAllocation
);

router.put(
  "/api/shiftallocation/floorallocationupdate/:id",
  shiftAllocationModule.floorAllocationUpdate
);

router.put(
  "/api/shiftallocation/floorallocationbulkupdate",
  shiftAllocationModule.floorallocationbulkupdate
);

module.exports = router; // export to use in server.js
