/* eslint-disable no-undef */
const oracledb = require('oracledb')

const connection = async () => {
  try {
    const connectionData = await oracledb.getConnection({
      user: 'ADMIN',
      password: 'ADMIN',
      connectString: process.env.CONNECTION_STRING,
    })
    return connectionData
  } catch (error) {
    console.log(error)
  }
}

const runQuery = async (query, params) => {
  const conn = await connection()
  const data = await conn.execute(query, params, {
    outFormat: oracledb.OUT_FORMAT_OBJECT,
  })
  conn.commit()
  await conn.close()
  return data.rows
}

const runQueryOutBinds = async (query, params) => {
  const conn = await connection()
  const data = await conn.execute(query, params, {
    outFormat: oracledb.OUT_FORMAT_OBJECT,
  })
  conn.commit()
  await conn.close()
  console.log(data)
  return data.outBinds
}

module.exports = { runQuery, runQueryOutBinds }
