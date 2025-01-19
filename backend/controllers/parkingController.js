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
  const { email, country, city, area, name, longitude, latitude, status } =
    req.body
  try {
    if (
      !email ||
      !country ||
      !city ||
      !area ||
      !name ||
      !longitude ||
      !latitude ||
      !status
    ) {
      res.status(400).json({ error: 'All fields must be filled' })
    } else {
      const isValidUser = await runQuery(
        `select * from users where email=:email`,
        {
          email,
        },
      )
      const user = isValidUser[0]
      if (isValidUser.length == 0) {
        res.status(400).json({ error: 'Not a valid email' })
        return
      }
      const isExists = await runQuery(
        `select garageid from garage where upper(country)=upper(:country) and upper(city)=upper(:city) and upper(area)=upper(:area) and upper(name)=upper(:name)`,
        {
          country,
          city,
          area,
          name,
        },
      )

      if (isExists.length) {
        res.status(400).json({ error: 'Park is already exists' })
        return
      }

      if (isExists.length == 0) {
        await runQuery(
          `insert into garage values(default, :ownerid, :country, :city, :area, :name, :longitude, :latitude, :status)`,
          {
            ownerid: user.USERID,
            country,
            city,
            area,
            name,
            longitude,
            latitude,
            status,
          },
        )
      }
      const park = await runQuery(
        `select * from garage where upper(country)=upper(:country) and upper(city)=upper(:city) and upper(area)=upper(:area) and upper(name)=upper(:name)`,
        {
          country,
          city,
          area,
          name,
        },
      )

      await runQuery(`begin insert_rent_data( :garageid ); end;`, {
        garageid: park[0].GARAGEID,
      })

      res.status(200).json(park[0])
    }
  } catch (e) {
    console.log(e)
    oracleErrorHandler(e, res)
  }
}

const searchParksUsingEmail = async (req, res) => {
  const { email } = req.body
  try {
    const userid = await runQuery(
      `select userid from users where email = :email`,
      {
        email,
      },
    )
    const parks = await runQuery(
      `select * from garage where ownerid = :userid`,
      {
        userid: userid[0].USERID,
      },
    )
    res.status(200).json(parks)
  } catch (e) {
    console.log(e)
    oracleErrorHandler(e, res)
  }
}

const getRentCosts = async (req, res) => {
  const { garageid, vehicletype } = req.body
  try {
    const cost = await runQuery(
      `select status, costshort, costlong, leftshort, leftlong from garage g join rent_info r on g.garageid = r.garageid where r.garageid=:garageid and r.vehicletype=:vehicletype`,
      {
        garageid,
        vehicletype,
      },
    )
    res.status(200).json(cost[0])
  } catch (e) {
    console.log(e)
    oracleErrorHandler(e, res)
  }
}

const setRentCosts = async (req, res) => {
  const { garageid, vehicletype, costshort, costlong, leftshort, leftlong } =
    req.body
  try {
    await runQuery(
      `update rent_info set costshort=:costshort, costlong=:costlong, leftshort=:leftshort, leftlong=:leftlong where garageid=:garageid and vehicletype=:vehicletype`,
      {
        costshort,
        costlong,
        leftshort,
        leftlong,
        garageid,
        vehicletype,
      },
    )

    res.status(200).json({
      COSTSHORT: costshort,
      COSTLONG: costlong,
      LEFTSHORT: leftshort,
      LEFTLONG: leftlong,
    })
  } catch (e) {
    console.log(e)
    oracleErrorHandler(e, res)
  }
}

const findEmailsforPark = async (req, res) => {
  const { country, city, area, name } = req.body
  try {
    const emails = await runQuery(
      `select users.name, users.email from users join garage on garage.ownerid=users.userid where upper(garage.country)=upper(:country) and upper(garage.city)=upper(:city) and upper(garage.area)=upper(:area) and upper(garage.name)=upper(:name)`,
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

const addVehicle = async (req, res) => {
  let {
    email,
    vehicleno,
    vehicletype,
    vehicle_model,
    vehicle_company,
    vehicle_color,
  } = req.body
  try {
    if (
      !email ||
      !vehicleno ||
      !vehicletype ||
      !vehicle_model ||
      !vehicle_company ||
      !vehicle_color
    ) {
      res.status(400).json({ error: 'All fields must be filled' })
    } else {
      vehicleno = vehicleno.toUpperCase()
      vehicletype = vehicletype.toUpperCase()
      vehicle_company = vehicle_company.toUpperCase()
      vehicle_model = vehicle_model.toUpperCase()
      vehicle_color = vehicle_color.toUpperCase()
      const isValidUser = await runQuery(
        `select * from users where email=:email`,
        {
          email,
        },
      )
      const user = isValidUser[0]
      if (isValidUser.length == 0) {
        res.status(400).json({ error: 'Not a valid email' })
        return
      }

      const isExists = await runQuery(
        `select * from vehicle_info where vehicleno=:vehicleno`,
        {
          vehicleno,
        },
      )

      if (isExists.length) {
        const uname = await runQuery(
          `select name from users where userid=:vehicle_owner`,
          {
            vehicle_owner: isExists[0].VEHICLE_OWNER,
          },
        )
        res
          .status(400)
          .json({ error: uname[0].NAME + ' is the owner of the vehicle' })
        return
      }

      await runQuery(
        `insert into vehicle_info values(:vehicleno, :vehicle_owner, :vehicletype, :vehicle_model, :vehicle_company, :vehicle_color)`,
        {
          vehicleno,
          vehicle_owner: user.USERID,
          vehicletype,
          vehicle_model,
          vehicle_company,
          vehicle_color,
        },
      )

      const vehicle = await runQuery(
        `select * from vehicle_info where vehicleno=:vehicleno`,
        {
          vehicleno,
        },
      )

      res.status(200).json(vehicle[0])
    }
  } catch (e) {
    console.log(e)
    oracleErrorHandler(e, res)
  }
}

const getVehicle = async (req, res) => {
  const { vehicleno } = req.body
  try {
    const getVtype = await runQuery(
      `select v.*, u.name, u.email from vehicle_info v join users u on v.vehicle_owner = u.userid where vehicleno=upper(:vehicleno)`,
      {
        vehicleno,
      },
    )
    if (getVtype.length) {
      res.status(200).json(getVtype[0])
    } else {
      res.status(400).json({ error: 'Such vehicle not found' })
    }
  } catch (e) {
    console.log(e)
    oracleErrorHandler(e, res)
  }
}

const entryVehicle = async (req, res) => {
  let { vehicleno, garageid, payment_amount, servicetype } = req.body
  try {
    vehicleno = vehicleno.toUpperCase()
    await runQuery(
      `begin entryvehicle(upper(:vehicleno), :garageid, :payment_amount, :servicetype); end;`,
      {
        vehicleno,
        garageid,
        payment_amount,
        servicetype,
      },
    )
    res.status(200).json({
      VEHICLENO: vehicleno,
      GARAGEID: garageid,
      PAYMENT_AMOUNT: payment_amount,
      SERVICETYPE: servicetype,
    })
  } catch (e) {
    console.log(e)
    oracleErrorHandler(e, res)
  }
}

const getExitData = async (req, res) => {
  const { garageid, vehicleno } = req.body
  try {
    const data = await runQuery(
      `select u.name, u.email, v.vehicletype, h.servicetype, initcap(to_char(st_date, 'dd mon,yyyy hh24:mi')) st_time, initcap(to_char(CURRENT_TIMESTAMP, 'dd mon,yyyy hh24:mi')) end_time, case h.servicetype when 'SHORT' then costshort else costlong end PER_UNIT_COST,
      round((extract(day from (CURRENT_TIMESTAMP - st_date)) * 24 +
      extract(hour from (CURRENT_TIMESTAMP - st_date)) +
      (extract(minute from (CURRENT_TIMESTAMP - st_date)) / 60)) * case h.servicetype when 'SHORT' then costshort else costlong end) - h.payment_amount COST, h.payment_amount PAID
      from has_payment h join vehicle_info v on v.vehicleno = h.vehicleno join rent_info r on r.garageid = h.garageid and r.vehicletype = v.vehicletype join users u on u.userid = v.vehicle_owner
      where h.garageid=:garageid and v.vehicleno=upper(:vehicleno)`,
      {
        garageid,
        vehicleno,
      },
    )
    if (data.length) {
      res.status(200).json(data[0])
    } else {
      res.status(400).json({ error: 'No info' })
    }
  } catch (e) {
    console.log(e)
    oracleErrorHandler(e, res)
  }
}

const exitVehicle = async (req, res) => {
  const { vehicleno, garageid, servicetype, total_amount, paid } = req.body
  if (!vehicleno || !garageid) {
    return res.status(400).json({ error: 'All fields must be filled' })
  }
  try {
    await runQuery(
      `begin exitvehicle(upper(:vehicleno), :garageid, :servicetype, :total_amount, :paid); end;`,
      {
        vehicleno,
        garageid,
        servicetype,
        total_amount,
        paid,
      },
    )
    res.status(200).json({
      vehicleno,
      garageid,
      servicetype,
      total_amount,
      paid,
    })
  } catch (e) {
    console.log(e)
    oracleErrorHandler(e, res)
  }
}

const isParkAdmin = async (req, res) => {
  const { userid } = req.body
  try {
    const data = await runQuery(
      `select count(*) CNT from garage where ownerid=:userid`,
      {
        userid,
      },
    )
    if (data.length) {
      res.status(200).json(data[0])
    } else {
      res.status(400).json({ error: 'No Data' })
    }
  } catch (e) {
    oracleErrorHandler(e, res)
  }
}

const userParkHistory = async (req, res) => {
  const { userid } = req.body
  try {
    const data = await runQuery(
      `select ts.serviceid, ts.servicetype, initcap(to_char(ts.start_time, 'dd mon,yyyy hh24:mi')) start_time, initcap(to_char(ts.end_time, 'dd mon,yyyy hh24:mi')) end_time, ts.total_amount, ts.paid, g.country, g.city, g.area, g.name parkname, v.vehicle_company, v.vehicle_model, v.vehicle_color
      from takes_service ts join garage g on ts.garageid = g.garageid join vehicle_info v on v.vehicleno = ts.vehicleno 
      where v.vehicle_owner = :userid 
      order by ts.end_time desc
      fetch first 100 rows only`,
      {
        userid,
      },
    )
    res.status(200).json(data)
  } catch (e) {
    console.log(e)
    oracleErrorHandler(e, res)
  }
}

const parkHistory = async (req, res) => {
  const { userid, garageid, vehicletype, servicetype, email } = req.body
  try {
    const params = {
      userid,
    }
    if (garageid) {
      params.garageid = garageid
    }

    if (email) {
      params.email = email
    }

    if (vehicletype) {
      params.vehicletype = vehicletype
    }

    if (servicetype) {
      params.servicetype = servicetype
    }

    const data = await runQuery(
      `select ts.serviceid, ts.servicetype, initcap(to_char(ts.start_time, 'dd mon,yyyy hh24:mi')) start_time, initcap(to_char(ts.end_time, 'dd mon,yyyy hh24:mi')) end_time, ts.total_amount, ts.paid, u.name username, u.email, g.country, g.city, g.area, g.name parkname, v.vehicle_company, v.vehicle_model, v.vehicle_color
      from takes_service ts join garage g on ts.garageid = g.garageid join vehicle_info v on v.vehicleno = ts.vehicleno join users u on v.vehicle_owner = u.userid 
      where g.ownerid = :userid ${garageid ? 'and ts.garageid = :garageid' : ''} ${email ? 'and email = :email' : ''} ${vehicletype ? 'and v.vehicletype = :vehicletype' : ''} ${servicetype ? 'and ts.servicetype = :servicetype' : ''} 
      order by ts.end_time desc
      fetch first 100 rows only`,
      params,
    )
    res.status(200).json(data)
  } catch (e) {
    console.log(e)
    oracleErrorHandler(e, res)
  }
}

const datyData = async (req, res) => {
  const { garageid, hisDay } = req.body
  try {
    const data = await runQuery(
      `select initcap(to_char(end_time, 'dd mon, yyyy')) end_time, sum(total_amount) total_amount, sum(paid) paid, count(case servicetype when 'SHORT' then 1 end) short_service, count(case servicetype when 'LONG' then 1 end) long_service  from takes_service 
      where garageid = :garageid and end_time >= to_date(:hisDay, 'yyyy-mm-dd') and end_time < to_date(:hisDay, 'yyyy-mm-dd') + 1
      group by initcap(to_char(end_time, 'dd mon, yyyy'))`,
      {
        garageid,
        hisDay,
      },
    )
    if (data.length) {
      res.status(200).json(data[0])
    } else {
      res.status(400).json({ error: 'No Data' })
    }
  } catch (e) {
    console.log(e)
    oracleErrorHandler(e, res)
  }
}

const getAllParks = async (req, res) => {
  try {
    const data = await runQuery(`select * from getallparks`, {})
    if (data.length) {
      res.status(200).json(data)
    } else {
      res.status(400).json({ error: 'No Park' })
    }
  } catch (e) {
    console.log(e)
    oracleErrorHandler(e, res)
  }
}

const paymentData = async (req, res) => {
  const { garageid, payDay } = req.body
  try {
    const data = await runQuery(
      `select sum(paid) * .15 total_pay from takes_service 
      where garageid = :garageid and end_time >= to_date(:payDay, 'yyyy-mm-dd') and end_time < to_date(:payDay, 'yyyy-mm-dd') + 1`,
      {
        garageid,
        payDay,
      },
    )
    if (data.length) {
      res.status(200).json(data[0])
    } else {
      res.status(400).json({ error: 'No Payment Record' })
    }
  } catch (e) {
    console.log(e)
    oracleErrorHandler(e, res)
  }
}

const givenAmount = async (req, res) => {
  const { garageid, payDay } = req.body
  try {
    const data = await runQuery(
      `select sum(amount) given_amount 
      from garage_admin_pay 
      where garageid = :garageid and payment_time >= to_date(:payDay, 'yyyy-mm-dd') and payment_time < to_date(:payDay, 'yyyy-mm-dd') + 1`,
      {
        garageid,
        payDay,
      },
    )
    if (data.length) {
      res.status(200).json(data[0])
    } else {
      res.status(400).json({ error: 'No Payment Record' })
    }
  } catch (e) {
    console.log(e)
    oracleErrorHandler(e, res)
  }
}

const garageAdminPay = async (req, res) => {
  const { garageid, paymentAmount, payDay } = req.body
  if (!garageid || !paymentAmount || !payDay) {
    res.status(400).json({ error: 'All field must be filled' })
    return
  }
  try {
    runQuery(
      `insert into garage_admin_pay(garageid, amount, payment_time)
      values (:garageid, :paymentAmount, to_date(:payDay, 'yyyy-mm-dd'))`,
      {
        garageid,
        paymentAmount,
        payDay,
      },
    )
      .then(async () => {
        const us = await runQuery(
          `select u.email from users u join garage g on u.userid = g.ownerid where g.garageid = :garageid`,
          {
            garageid,
          },
        )

        res.status(200).json({ msg: 'Payment Successfull', EMAIL: us[0].EMAIL })
      })
      .catch(() => res.status(400).json({ error: 'Payment Unsuccessfull' }))
  } catch (e) {
    console.log(e)
    oracleErrorHandler(e, res)
  }
}

const getNotice = async (req, res) => {
  const { userid, offset } = req.body
  try {
    const data = await runQuery(
      `select NOTICEID, USERID, MESSAGE, to_char(NOTICE_TIME, 'dd Mon, yyyy hh24:mi') NOTICE_TIME
      from notice
      where userid = :userid
      order by NOTICEID desc
      offset :offset rows fetch next 10 rows only`,
      {
        userid,
        offset,
      },
    )
    if (data.length) {
      res.status(200).json(data)
    } else {
      res.status(400).json({ error: 'No Notification' })
    }
  } catch (e) {
    console.log(e)
    oracleErrorHandler(e, res)
  }
}

const totalUnread = async (req, res) => {
  const { userid } = req.body
  try {
    const data = await runQuery(
      `select count(*) total_unread from notice
      where userid = :userid and is_read = 0`,
      {
        userid,
      },
    )
    if (data.length) {
      res.status(200).json(data[0])
    } else {
      res.status(400).json({ error: 'No Notification' })
    }
  } catch (e) {
    console.log(e)
    oracleErrorHandler(e, res)
  }
}

const setReadNotice = async (req, res) => {
  const { userid } = req.body
  try {
    runQuery(
      `update notice
      set is_read = 1
      where userid = :userid and is_read = 0`,
      {
        userid,
      },
    )
      .then(() => {
        res.status(200).json({ msg: 'Mark as read' })
      })
      .catch(() => {
        res.status(400).json({ error: 'Mark as not read' })
      })
  } catch (e) {
    console.log(e)
    oracleErrorHandler(e, res)
  }
}

const parksDueAdmin = async (req, res) => {
  try {
    const data = await runQuery(`select * from due_payment_to_admin_view`, {})
    if (data.length) {
      res.status(200).json(data)
    } else {
      res.status(400).json({ error: 'No park have due' })
    }
  } catch (e) {
    console.log(e)
    oracleErrorHandler(e, res)
  }
}

const notifyParkForDue = async (req, res) => {
  const { garageid, due, da } = req.body
  try {
    runQuery(`begin notice_park_for_due( :garageid, :due, :da ); end;`, {
      garageid,
      due,
      da,
    })
      .then(async () => {
        const us = await runQuery(
          `select u.email from users u join garage g on u.userid = g.ownerid where g.garageid = :garageid`,
          {
            garageid,
          },
        )

        res.status(200).json({ msg: 'Notified', EMAIL: us[0].EMAIL })
      })
      .catch((e) => {
        console.log(e)
        res.status(400).json({ error: 'Not send' })
      })
  } catch (e) {
    console.log(e)
    oracleErrorHandler(e, res)
  }
}

module.exports = {
  searchParks,
  searchParksUsingEmail,
  addParkAdmin,
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
}
