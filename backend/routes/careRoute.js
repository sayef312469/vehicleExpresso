const express=require('express');
const router = express.Router();
const {pieData, lineData, shortUser, longUser,shortTableFetch, longTableFetch, maintenanceinfoFetch, updateShortTable, updateLongTable, availVehicle}=require("../controllers/careController");


router.post('/piedata',pieData);
router.post('/linedata',lineData);
router.post('/shortuser',shortUser);
router.post('/longuser',longUser);
router.post('/shorttable',shortTableFetch);
router.post('/longtable',longTableFetch)
router.post('/update-short',updateShortTable);
router.post('/update-long',updateLongTable);
router.post('/maintenance-info',maintenanceinfoFetch);
router.post('/vehicleno',availVehicle);

module.exports = router;