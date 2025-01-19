const express=require('express');
const router = express.Router();
const {
    pieData, 
    lineData, 
    shortUser, 
    longUser,
    shortTableFetch, 
    longTableFetch, 
    maintenanceinfoFetch, 
    updateShortTable, updateLongTable, 
    availVehicle, 
    updateMaintInfo, 
    deleteMaintInfo, 
    fetchOldChats, 
    fetchContacts,
    StoreUnreadMessages,
    fetchUnreadMessages,
    storeUnreadContacts}=require("../controllers/careController");


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
router.post('/maintenanceinfo-update',updateMaintInfo);
router.post('/maintenanceinfo-deletion',deleteMaintInfo);
router.post('/old-chats',fetchOldChats);
router.post('/contacts',fetchContacts)
router.post('/unread-msgs',StoreUnreadMessages)
router.post('/fetch-unread-msgs',fetchUnreadMessages)
router.post('/unread-contacts', storeUnreadContacts)

module.exports = router;