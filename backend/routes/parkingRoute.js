const express = require("express");
const { searchParks } = require("../controllers/parkingController");

const router = express.Router();

router.post("/", searchParks);

module.exports = router;
