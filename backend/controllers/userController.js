const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const { runQuery } = require('../connection')
const path = require('path')
const oracleErrorHandler = require('../oracleErrorHandler')
const { BlobServiceClient } = require('@azure/storage-blob')

const createToken = (ID) => {
  return jwt.sign({ ID }, process.env.SECRET, { expiresIn: '30d' })
}

const loginUser = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400).json({ error: 'All field must be filled' })
  } else {
    try {
      const use = await runQuery('select * from users where email=:email', {
        email,
      })
      if (use.length == 0) {
        res.status(400).json({ error: 'Email is not correct' })
      } else {
        const user = use[0]
        const match = await bcrypt.compare(password, user.PASSWORD)
        if (!match) {
          res.status(400).json({ error: 'Password is not correct' })
        } else {
          const token = createToken(user.USERID)
          console.log(token)
          const username = user.NAME
          res
            .status(200)
            .json({ id: user.USERID, name: username, email, token })
        }
      }
    } catch (error) {
      console.log(error)
      oracleErrorHandler(error, res)
    }
  }
}

const signUpUser = async (req, res) => {
  const { username, email, password, conPassword } = req.body
  if (!username || !email || !password || !conPassword) {
    res.status(400).json({ error: 'All field must be filled' })
  } else if (!validator.matches(username, '^[a-zA-Z0-9_.-]*$')) {
    res.status(400).json({ error: 'Not a valid usrename' })
  } else if (!validator.isEmail(email)) {
    res.status(400).json({ error: 'The email is not valid' })
  } else if (password !== conPassword) {
    res.status(400).json({ error: "Password doesn't match" })
  } else if (!validator.isStrongPassword(password)) {
    res.status(400).json({ error: 'Password not strong enough' })
  } else {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    try {
      const data = await runQuery(
        'select * from table(signup(:username, :email, :hash))',
        {
          username,
          email,
          hash,
        }
      )
      if (data.length == 0) {
        res.status(400).json({ error: 'Something went wrong' })
        return
      }
      const user = data[0]
      const usname = user.NAME
      const token = createToken(user.USERID)
      res.status(200).json({ id: user.USERID, name: usname, email, token })
    } catch (error) {
      console.log(error)
      oracleErrorHandler(error, res)
    }
  }
}

const profileUser = async (req, res) => {
  let userid = req.params.id
  try {
    console.log('Data fetched from database')
    const result = await runQuery('SELECT * FROM USERS WHERE USERID=:userid', {
      userid,
    })
    if (result.length) {
      res.status(200).json(result[0])
    } else {
      res.status(400).json({ error: 'No user found' })
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const profilePicture = async (req, res) => {
  const id = req.params.id
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    process.env.AZURE_STORAGE_CONNECTION_STRING
  )
  const containerClient = blobServiceClient.getContainerClient('images')
  const file = req.file
  if (!file) {
    return res.status(400).send('No file uploaded')
  }

  const blobName = path.basename(file.path)
  const blockBlobClient = containerClient.getBlockBlobClient(blobName)

  try {
    const uploadBlobResponse = await blockBlobClient.uploadFile(file.path)
    console.log(
      `Blob was uploaded successfully. requestId: ${uploadBlobResponse.requestId}`
    )

    const imageUrl = blockBlobClient.url

    const result = await runQuery(
      `UPDATE users SET pro_url=:imageUrl where userid=:id`,
      {
        id,
        imageUrl,
      },
      { autoCommit: true }
    )
    console.log('URL stored in database', result)
    res.status(200).json({ PRO_URL: imageUrl })
  } catch (err) {
    console.error('Error during upload:', err)
    res.status(500).json({ message: 'Upload failed', error: err })
  }
}

const profileParking = async (req, res) => {
  let userid = req.params.id
  try {
    console.log('Data fetched from database')
    const result = await runQuery(
      `SELECT
    COUNT(*) AS COUNTS,
    GARAGE.GARAGEID,
    GARAGE.COUNTRY,
    GARAGE.CITY,
    GARAGE.AREA,
    VEHICLE_INFO.VEHICLENO,
    VEHICLE_INFO.VEHICLETYPE,
    VEHICLE_INFO.VEHICLE_MODEL,
    VEHICLE_INFO.VEHICLE_COMPANY,
    VEHICLE_INFO.VEHICLE_COLOR
FROM
    USERS,
    GARAGE,
    VEHICLE_INFO,
    HAS_PAYMENT
WHERE
    VEHICLE_INFO.VEHICLENO = HAS_PAYMENT.VEHICLENO
    AND GARAGE.GARAGEID = HAS_PAYMENT.GARAGEID
    AND VEHICLE_INFO.VEHICLE_OWNER = USERS.USERID
    AND USERS.USERID = :userid
GROUP BY
    GARAGE.GARAGEID,
    GARAGE.COUNTRY,
    GARAGE.CITY,
    GARAGE.AREA,
    VEHICLE_INFO.VEHICLENO,
    VEHICLE_INFO.VEHICLETYPE,
    VEHICLE_INFO.VEHICLE_MODEL,
    VEHICLE_INFO.VEHICLE_COMPANY,
    VEHICLE_INFO.VEHICLE_COLOR`,
      {
        userid,
      }
    )
    if (result.length) {
      res.status(200).json(result)
    } else {
      res.status(400).json({ error: 'No user found' })
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const profileShorterm = async (req, res) => {
  let userid = req.params.id
  try {
    console.log('Data fetched from database')
    const result = await runQuery(
      `WITH SERVICE_COUNT AS (
        SELECT
            COUNT(*) AS COUNTS
        FROM
            CARE_TRANSAC,
            SHORTTERMCARE,
            TAKES_CARE,
            VEHICLE_INFO,
            USERS
        WHERE
            SHORTTERM_ID=CARE_TRANSAC.SERVICE_ID
            AND SHORTTERM_ID=TAKES_CARE.SERVICE_ID
            AND TAKES_CARE.VEHICLENO=VEHICLE_INFO.VEHICLENO
            AND VEHICLE_INFO.VEHICLE_OWNER=USERS.USERID
            AND USERID=:userid
      )
      SELECT
          SERVICE_COUNT.COUNTS,
          SERVICE_TYPE,
          MECHANIC_NAME,
          REPAIR,
          WASH,
          VEHICLE_INFO.VEHICLENO,
          VEHICLETYPE,
          VEHICLE_MODEL,
          VEHICLE_COLOR,
          VEHICLE_COMPANY,
          TO_CHAR(SERVICE_DATE, 'yyyy-mm-dd') AS SERVICE_DATE
      FROM
          CARE_TRANSAC,
          SHORTTERMCARE,
          TAKES_CARE,
          VEHICLE_INFO,
          USERS,
          SERVICE_COUNT
      WHERE
          SHORTTERM_ID=CARE_TRANSAC.SERVICE_ID
          AND SHORTTERM_ID=TAKES_CARE.SERVICE_ID
          AND TAKES_CARE.VEHICLENO=VEHICLE_INFO.VEHICLENO
          AND VEHICLE_INFO.VEHICLE_OWNER=USERS.USERID
          AND USERID=:userid`,
      {
        userid,
      }
    )
    if (result.length) {
      res.status(200).json(result)
    } else {
      res.status(400).json({ error: 'No user found' })
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const profileLongterm = async (req, res) => {
  let userid = req.params.id
  try {
    console.log('Data fetched from database')
    const result = await runQuery(
      `SELECT
    COUNT(*)                               AS TOTAL_LONG,
    TC.VEHICLENO,
    CT.SERVICE_TYPE,
    LC.MAINTENANCE_CATEGORY,
    CT.SERVICING_COST,
    TO_CHAR(TC.SERVICE_DATE, 'yyyy-mm-dd') AS SERVICE_DATE
FROM
    VEHICLE_INFO     VI,
    TAKES_CARE       TC,
    CARE_TRANSAC     CT,
    LONGTERMCARE     LC,
    MAINTENANCE_INFO MI,
    USERS            U
WHERE
    VI.VEHICLE_OWNER=:VEHICLEOWNER
    and U.USERID=VI.VEHICLE_OWNER
    AND VI.VEHICLENO=TC.VEHICLENO
    AND TC.SERVICE_ID=CT.SERVICE_ID
    AND CT.SERVICE_ID=LC.LONGTERM_ID
    AND CT.SERVICE_ID=MI.MAINTENANCE_ID
    AND TO_DATE(LC.FINAL_DATE, 'yyyy-mm-dd') > TO_DATE(SYSDATE, 'yyyy-mm-dd')
GROUP BY
    TC.VEHICLENO,
    CT.SERVICE_TYPE,
    LC.MAINTENANCE_CATEGORY,
    CT.SERVICING_COST,
    TC.SERVICE_DATE
ORDER BY
    TC.SERVICE_DATE`,
      {
        userid,
      }
    )
    if (result.length) {
      res.status(200).json(result)
    } else {
      res.status(400).json({ error: 'No user found' })
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const updateContact = async (req, res) => {
  const id = req.params.id
  const { phone, area, city, country } = req.body
  try {
    const result = await runQuery(
      `UPDATE users SET phone=:phone, area=:area, city=:city, country=:country where userid=:id`,
      {
        phone,
        area,
        city,
        country,
        id,
      },
      { autoCommit: true }
    )
    console.log('Contact updated', result)
    res.status(200).json({ message: 'Contact updated successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const userRecord = async (req, res) => {
  try {
    const query = `
      SELECT USERID, NAME, EMAIL, COUNTRY, CITY, AREA, PHONE
      FROM USERS
      WHERE USERID > 0
    `
    const result = await runQuery(query, {})
    res.status(200).json(result)
  } catch (err) {
    console.error('Error fetching record:', err)
    res.status(500).json({ error: err.message })
  }
}

const userIdUpdate = async (req, res) => {
  const id = req.params.id
  const { userid } = req.body
  try {
    const result = await runQuery(
      `update users set userid=:userid where userid=:id`,
      {
        userid,
        id,
      },
      { autoCommit: true }
    )
    console.log('User ID updated')
    res.status(200).json({ message: 'Contact updated successfully' })
    console.log('Done')
  } catch (err) {
    res.status(500).json({ error: err.message })
    console.log(err)
  }
}

module.exports = {
  loginUser,
  signUpUser,
  profileUser,
  profilePicture,
  profileParking,
  updateContact,
  profileShorterm,
  userRecord,
  userIdUpdate,
}
