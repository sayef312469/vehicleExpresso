const oracledb = require("oracledb");
const { runQuery } = require("../connection");

const searchParks = async (req, res) => {
  const { longitude, latitude, vehicletype } = req.body;
  try {
    const parks = await runQuery(
      "select park_info.*, brtc_letter.vehiclename, pcph.price from park_info join brtc_letter on park_info.vehicletype = brtc_letter.vehicletype join parking_cost_per_hour pcph on pcph.vehicletype = brtc_letter.vehicletype where park_info.vehicletype=:vehicletype order by abs(park_info.longitude - :longitude) + abs(park_info.latitude - :latitude) fetch first 20 rows only",
      {
        vehicletype,
        longitude,
        latitude,
      }
    );
    res.status(200).json(parks);
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: "Something wrong" });
  }
};

module.exports = { searchParks };
