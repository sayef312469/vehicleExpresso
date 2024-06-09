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

module.exports = router
