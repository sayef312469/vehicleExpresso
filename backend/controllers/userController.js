const oracledb = require('oracledb')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const { runQuery } = require('../connection')
const oracleErrorHandler = require('../oracleErrorHandler')

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
      const exists = await runQuery(
        'select userid id from users where email=:email',
        {
          email,
        },
      )
      if (exists.length == 0) {
        const ins = await runQuery(
          'insert into users(name, email, password) values(:username, :email, :hash)',
          {
            username,
            email,
            hash,
          },
        )
        const data = await runQuery('select * from users where email=:email', {
          email,
        })
        const user = data[0]
        const usname = await user.NAME
        const token = createToken(user.USERID)
        res.status(200).json({ id: user.USERID, name: usname, email, token })
      } else {
        console.log(exists)
        res.status(400).json({ error: 'Email already exists' })
      }
    } catch (error) {
      console.log(error)
      res.status(400).json({ error: 'Something went wrong' })
    }
  }
}

module.exports = { loginUser, signUpUser }
