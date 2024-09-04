const express = require('express')
const {
  addProduct,
  getShop,
  getShopById,
  updateStock,
  createPurchase,
  promoCodeCheck,
  submitProductReport,
  getQuestionsAndAnswers,
  getQuestionsForSeller,
  addQuestion,
  addAnswer,
  getProductReviews,
  addProductReview,
  archiveProduct,
  averageRating,
} = require('../controllers/shopController')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

router.get('/products', getShop)
router.get('/my-product/:id', getShopById)
router.post('/add-product', upload.single('image'), addProduct)
router.put('/update-stock', updateStock)
router.post('/purchase', createPurchase)
router.get('/promo-code', promoCodeCheck)
router.post('/report-product', submitProductReport)
router.get('/product/:productId/questions', getQuestionsAndAnswers)
router.get('/product/:productId/qna', getQuestionsForSeller)
router.post('/add-question', addQuestion)
router.post('/add-answer', addAnswer)
router.get('/reviews/:productId', getProductReviews)
router.post('/add-review', addProductReview)
router.put('/archive-product/:id', archiveProduct)
router.get('/average-rating/:productId', averageRating)

module.exports = router
