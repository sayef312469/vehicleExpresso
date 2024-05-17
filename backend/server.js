const express = require("express");
const oracledb = require("oracledb");
const cors = require("cors");
require("dotenv").config();

const parkingRoute = require("./routes/parkingRoute");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(cors());

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});

app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use("/api/parking", parkingRoute);
app.use("/api/user", userRoutes);

// some changes
