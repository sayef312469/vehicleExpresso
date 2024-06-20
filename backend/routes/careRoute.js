const express=require('express');
const router = express.Router();
const {pieData, lineData, serviceUser,tableFetch, updateTable}=require("../controllers/careController");


router.post('/piedata',pieData);
router.post('/linedata',lineData);
router.post('/user',serviceUser);
router.post('/table',tableFetch);
router.post('/update',updateTable)

module.exports = router;