const express = require('express')
const {
  searchParks,
  addParkAdmin,
  searchParksUsingEmail,
  findEmailsforPark,
} = require('../controllers/parkingController')

const router = express.Router()

router.post('/', searchParks)
router.post('/addparkadmin', addParkAdmin)
router.post('/searchparksusingemail', searchParksUsingEmail)
router.post('/findemailsforpark', findEmailsforPark)

module.exports = router
