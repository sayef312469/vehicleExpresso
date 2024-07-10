const express = require('express')
const router = express.Router()
const {
  pieData,
  lineData,
  shortUser,
  longUser,
  tableFetch,
  updateTable,
} = require('../controllers/careController')

router.post('/piedata', pieData)
router.post('/linedata', lineData)
router.post('/shortuser', shortUser)
router.post('/longuser', longUser)
router.post('/table', tableFetch)
router.post('/update', updateTable)

module.exports = router
