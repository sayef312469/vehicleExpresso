const express = require('express')
const {
  searchParks,
  addParkAdmin,
  searchParksUsingEmail,
  findEmailsforPark,
  getRentCosts,
  setRentCosts,
  addVehicle,
  getVehicle,
  entryVehicle,
  getExitData,
  exitVehicle,
  isParkAdmin,
  userParkHistory,
  allParksHistory,
  parkHistory,
} = require('../controllers/parkingController')

const router = express.Router()

router.post('/', searchParks)
router.post('/addparkadmin', addParkAdmin)
router.post('/searchparksusingemail', searchParksUsingEmail)
router.post('/findemailsforpark', findEmailsforPark)
router.post('/getrentcost', getRentCosts)
router.post('/setrentcost', setRentCosts)
router.post('/addvehicle', addVehicle)
router.post('/getvehicle', getVehicle)
router.post('/entryvehicle', entryVehicle)
router.post('/getexitdata', getExitData)
router.post('/exitvehicle', exitVehicle)
router.post('/isparkadmin', isParkAdmin)
router.post('/userparkhistory', userParkHistory)
router.post('/allparkshistory', allParksHistory)
router.post('/parkhistory', parkHistory)

module.exports = router
