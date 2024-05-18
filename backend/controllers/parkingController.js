const oracledb = require('oracledb')
const { runQuery } = require('../connection')
const oracleErrorHandler = require('../oracleErrorHandler')

const searchParks = async (req, res) => {
  const { longitude, latitude, vehicletype } = req.body
  try {
    const parks = await runQuery(
      `select * from table(show_parks(:vehicletype, :longitude, :latitude))`,
      {
        vehicletype,
        longitude,
        latitude,
      },
    )
    res.status(200).json(parks)
  } catch (e) {
    console.log(e)
    oracleErrorHandler(e, res)
  }
}

const addParkAdmin = async (req, res) => {
  const { email, country, city, area, name, longitude, latitude } = req.body
  try {
    if (
      !email ||
      !country ||
      !city ||
      !area ||
      !name ||
      !longitude ||
      !latitude
    ) {
      res.status(400).json({ error: 'All fields must be filled' })
    } else {
      const isExists = await runQuery(
        `select id from park_info where upper(country)=upper(:country) and upper(city)=upper(:city) and upper(area)=upper(:area) and upper(name)=upper(:name)`,
        {
          country,
          city,
          area,
          name,
        },
      )

      if (isExists.length == 0) {
        await runQuery(
          `insert into park_info values(default, :country, :city, :area, :name, :longitude, :latitude)`,
          {
            country,
            city,
            area,
            name,
            longitude,
            latitude,
          },
        )
      }
      const park = await runQuery(
        `select * from park_info where upper(country)=upper(:country) and upper(city)=upper(:city) and upper(area)=upper(:area) and upper(name)=upper(:name)`,
        {
          country,
          city,
          area,
          name,
        },
      )
      const usid = await runQuery(`select id from users where email=:email`, {
        email,
      })
      await runQuery(`insert into park_admin values(:userid, :parkid)`, {
        userid: usid[0].ID,
        parkid: park[0].ID,
      })
      res.status(200).json(park[0])
    }
  } catch (e) {
    console.log(e)
    oracleErrorHandler(e, res)
  }
}

const makeParkAdmin = async (req, res) => {
  const { userid, parkid } = req.body
  try {
    const ins_park = await runQuery(
      `insert into park_admin values(:userid, :parkid)`,
      {
        userid,
        parkid,
      },
    )
    if (ins_park.length == 0) {
      const park = await runQuery(
        `select * from park_info where id = :parkid`,
        { parkid },
      )
      res.status(200).json(park)
    } else {
      res.status(200).json({ error: 'Something went worng' })
    }
  } catch (e) {
    console.log(e.code)
    oracleErrorHandler(e, res)
  }
}

const searchParksUsingEmail = async (req, res) => {
  const { email } = req.body
  try {
    const userid = await runQuery(`select id from users where email = :email`, {
      email,
    })
    const parks = await runQuery(
      `select * from table(park_info_func( :userid ))`,
      {
        userid: userid[0].ID,
      },
    )
    res.status(200).json(parks)
  } catch (e) {
    console.log(e)
    oracleErrorHandler(e, res)
  }
}

const findEmailsforPark = async (req, res) => {
  const { country, city, area, name } = req.body
  try {
    const emails = await runQuery(
      `select users.name, users.email from users join park_admin on park_admin.userid=users.id join park_info on park_info.id=park_admin.parkid where upper(park_info.country)=upper(:country) and upper(park_info.city)=upper(:city) and upper(park_info.area)=upper(:area) and upper(park_info.name)=upper(:name)`,
      {
        country,
        city,
        area,
        name,
      },
    )
    res.status(200).json(emails)
  } catch (e) {
    console.log(e)
    oracleErrorHandler(e, res)
  }
}

module.exports = {
  searchParks,
  makeParkAdmin,
  searchParksUsingEmail,
  addParkAdmin,
  findEmailsforPark,
}
