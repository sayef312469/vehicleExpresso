/* eslint-disable no-undef */
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
  parkHistory,
  datyData,
  getAllParks,
  paymentData,
  givenAmount,
  garageAdminPay,
  getNotice,
  totalUnread,
  setReadNotice,
  parksDueAdmin,
  notifyParkForDue,
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
router.post('/parkhistory', parkHistory)
router.post('/daydata', datyData)
router.get('/getallparks', getAllParks)
router.post('/paymentdata', paymentData)
router.post('/givenamount', givenAmount)
router.post('/garageadminpay', garageAdminPay)
router.post('/getnotice', getNotice)
router.post('/totalunread', totalUnread)
router.post('/setreadnotice', setReadNotice)
router.get('/parksdueadmin', parksDueAdmin)
router.post('/notifyparkfordue', notifyParkForDue)

module.exports = router
