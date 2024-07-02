/* eslint-disable no-undef */
const express = require('express')
const {
  loginUser,
  signUpUser,
  profileUser,
  profilePicture,
  profileParking,
} = require('../controllers/userController')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

const router = express.Router()

router.post('/login', loginUser)

router.post('/signup', signUpUser)

router.get('/profile/:id', profileUser)

router.post('/upload/:id', upload.single('file'), profilePicture)

router.get('/profile-parking/:id', profileParking)

module.exports = router
