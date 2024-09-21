const { runQuery, runQueryOutBinds } = require('../connection')
const { BlobServiceClient } = require('@azure/storage-blob')
const fs = require('fs')
const oracledb = require('oracledb')

const getShop = async (req, res) => {
  try {
    const result = await runQuery('SELECT * FROM PRODUCTS', {})
    res.status(200).json(result)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

const getShopById = async (req, res) => {
  const { id } = req.params
  try {
    const result = await runQuery(
      'SELECT * FROM PRODUCTS WHERE SELLER_ID=:id',
      { id }
    )
    res.status(200).json(result)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

const getShopByCategory = async (req, res) => {
  const { category } = req.params
  try {
    const result = await runQuery(
      'SELECT * FROM PRODUCTS WHERE PRODUCT_CATEGORY=:category',
      { category }
    )
    if (result.length == 0) {
      res.status(404).json({ error: 'Products not found' })
    } else {
      res.status(200).json(result)
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

const addProduct = async (req, res) => {
  const {
    id,
    name,
    description,
    tag,
    create_date,
    sellerId,
    price,
    quantityAvailable,
  } = req.body
  const parsedDate = new Date(create_date)
  const image = req.file
  console.log('This is image ' + image)

  const blobServiceClient = BlobServiceClient.fromConnectionString(
    process.env.AZURE_STORAGE_CONNECTION_STRING
  )
  const containerClient = blobServiceClient.getContainerClient('product-images')
  const blobName = `${Date.now()}-${image.originalname}`
  const blockBlobClient = containerClient.getBlockBlobClient(blobName)

  try {
    const uploadBlobResponse = await blockBlobClient.uploadFile(image.path)
    console.log(
      `Blob was uploaded successfully. requestId: ${uploadBlobResponse.requestId}`
    )
    const imageUrl = blockBlobClient.url
    if (uploadBlobResponse._response.status === 201) {
      console.log(image.path)
      fs.unlink(image.path, (err) => {
        if (err) {
          console.error('Failed to delete local file:', err)
        } else {
          console.log('Successfully deleted local file')
        }
      })
    }
    const result = await runQuery(
      `INSERT INTO PRODUCTS 
        (PRODUCT_ID,
        PRODUCT_NAME,
        PRODUCT_DESCRIPTION,
        PRODUCT_IMAGE_URL,
        PRODUCT_CATEGORY,
        CREATED_AT,
        SELLER_ID,
        SELLER_PRICE,
        SELLER_STOCK) 
    VALUES 
        (:id,
        :name,
        :description,
        :imageUrl, 
        :tag, 
        :create_date, 
        :sellerId, 
        :price, 
        :quantityAvailable)`,
      {
        id,
        name,
        description,
        imageUrl,
        tag,
        create_date: parsedDate,
        sellerId,
        price,
        quantityAvailable,
      },
      { autoCommit: true }
    )
    res.status(200).json({ message: 'Product added successfully' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

const updateProduct = async (req, res) => {
  const { id } = req.params
  const {
    name,
    description,
    url,
    category,
    create_date,
    seller_id,
    price,
    stock,
  } = req.body
  try {
    const result = await runQuery(
      `UPDATE PRODUCTS 
      SET PRODUCT_NAME=:name,
      PRODUCT_DESCRIPTION=:description,
      PRODUCT_IMAGE_URL=:url,
      PRODUCT_CATEGORY=:category,
      CREATED_AT=:create_date,
      SELLER_ID=:seller_id,
      SELLER_PRICE=:price,
      SELLER_STOCK=:stock
      WHERE PRODUCT_ID=:id`,
      {
        name,
        description,
        url,
        category,
        create_date,
        seller_id,
        price,
        stock,
        id,
      },
      { autoCommit: true }
    )
    res.status(200).json({ message: 'Product updated successfully' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

const archiveProduct = async (req, res) => {
  const { id } = req.params
  try {
    const result = await runQuery('CALL UPDATE_STATUS(:id)', {
      id,
    })
    res.status(200).json({ message: 'Product archived successfully' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

const updateStock = async (req, res) => {
  const { id, stock } = req.body
  try {
    await runQuery(
      'UPDATE PRODUCTS SET SELLER_STOCK=:stock WHERE PRODUCT_ID=:id',
      { stock, id },
      { autoCommit: true }
    )
    res.status(200).json({ message: 'Stock updated successfully' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

const createPurchase = async (req, res) => {
  const {
    buyerId,
    paymentOption,
    totalPrice,
    cartItems,
    cardDetails,
    bkashAccount,
    discountPrice,
    promoCode,
  } = req.body
  try {
    const purchaseIdOutBind = await runQueryOutBinds(
      `INSERT INTO PURCHASES (BUYER_ID, PAYMENT_OPTION, PURCHASE_DATE, TOTAL_PRICE, PROMO_CODE)
       VALUES (:buyerId, :paymentOption, :purchaseDate, :totalPrice, :promoCode)
       RETURNING PURCHASE_ID INTO :purchaseId`,
      {
        buyerId,
        paymentOption,
        purchaseDate: new Date(),
        totalPrice,
        promoCode,
        purchaseId: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      }
    )

    const purchaseId = purchaseIdOutBind.purchaseId[0]

    if (paymentOption === 'Card') {
      await runQuery(
        `INSERT INTO CARD_PAYMENTS (PURCHASE_ID, CARD_TYPE, CARD_HOLDER_NAME, CARD_NUMBER, CARD_EXPIRY_DATE, CARD_CVV)
         VALUES (:purchaseId, :cardType, :cardHolderName, :cardNumber, :cardExpiryDate, :cardCvv)`,
        {
          purchaseId,
          cardType: cardDetails.cardType,
          cardHolderName: cardDetails.cardHolderName,
          cardNumber: cardDetails.cardNumber,
          cardExpiryDate: new Date(cardDetails.cardExpiryDate),
          cardCvv: cardDetails.cvv,
        }
      )
    } else if (paymentOption === 'Bkash') {
      await runQuery(
        `INSERT INTO BKASH_PAYMENTS (PURCHASE_ID, BKASH_ACCOUNT)
         VALUES (:purchaseId, :bkashAccount)`,
        {
          purchaseId,
          bkashAccount,
        }
      )
    }

    const purchaseDetailsPromises = cartItems.map((item) => {
      return runQuery(
        `INSERT INTO PURCHASE_DETAILS 
         (PURCHASE_ID, PRODUCT_ID, ITEM_PRICE, QUANTITY, DISCOUNT_PRICE)
         VALUES (:purchaseId, :productId, :itemPrice, :quantity, :discountPrice)`,
        {
          purchaseId,
          productId: item.PRODUCT_ID,
          itemPrice: item.SELLER_PRICE,
          quantity: item.quantity,
          discountPrice: discountPrice || 0,
        }
      )
    })

    await Promise.all(purchaseDetailsPromises)

    res.status(200).json({ message: 'Purchase completed successfully' })
  } catch (error) {
    console.error('Error creating purchase:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

const getPurchaseHistoryByUserId = async (req, res) => {
  const { userId } = req.params
  const { page = 1, pageSize = 10 } = req.query
  const offset = (page - 1) * pageSize

  try {
    const result = await runQuery(
      `SELECT 
         PURCHASE_ID, 
         BUYER_ID, 
         PAYMENT_OPTION, 
         PURCHASE_DATE, 
         PROMO_CODE, 
         PURCHASE_TOTAL_PRICE, 
         PRODUCT_DETAILS 
       FROM PURCHASES_WITH_DETAILS 
       WHERE BUYER_ID = :userId 
       ORDER BY PURCHASE_DATE DESC 
       OFFSET :offset ROWS FETCH NEXT :pageSize ROWS ONLY`,
      { userId, offset, pageSize }
    )

    const totalRecordsResult = await runQuery(
      `SELECT COUNT(*) AS TOTAL_COUNT 
       FROM PURCHASES_WITH_DETAILS 
       WHERE BUYER_ID = :userId`,
      { userId }
    )

    const totalRecords = totalRecordsResult[0]?.TOTAL_COUNT || 0

    res.status(200).json({
      purchases: result,
      totalRecords,
      currentPage: parseInt(page),
      pageSize: parseInt(pageSize),
      totalPages: Math.ceil(totalRecords / pageSize),
    })
  } catch (error) {
    console.error('Error fetching purchase history:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

const checkPromoCodeUsage = async (buyerId, promoCode) => {
  const result = await runQuery(
    'SELECT COUNT(*) AS count FROM PURCHASES WHERE BUYER_ID = :buyerId AND PROMO_CODE = :promoCode',
    { buyerId, promoCode }
  )

  return result[0].COUNT > 0
}

const promoCodeCheck = async (req, res) => {
  const { promoCode, buyer_id } = req.query

  const hasUsedPromoCode = await checkPromoCodeUsage(buyer_id, promoCode)
  if (hasUsedPromoCode) {
    return res.status(400).json({ error: 'Promo code has already been used.' })
  }

  try {
    const result = await runQuery(
      'SELECT * FROM PROMOCODES WHERE PROMO_CODE=:promoCode',
      { promoCode }
    )
    console.log(result)
    if (result.length == 0) {
      console.log('Promo code not found')
      res.status(404).json({ error: 'Promo code not found' })
    } else {
      console.log('Promo code found')
      res.status(200).json(result[0])
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

const submitProductReport = async (req, res) => {
  const { productId, userId, reportText } = req.body

  try {
    await runQuery(
      `INSERT INTO PRODUCTREPORTS (PRODUCT_ID, USER_ID, REPORT_TEXT) 
       VALUES (:productId, :userId, :reportText)`,
      { productId, userId, reportText }
    )

    res.status(201).json({ message: 'Report submitted successfully' })
  } catch (error) {
    console.error('Error submitting report:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

const getQuestionsAndAnswers = async (req, res) => {
  const { productId } = req.params

  try {
    const result = await runQuery(
      `SELECT
    PQ.QUESTION_ID,
    PQ.PRODUCT_ID,
    PQ.QUESTION_TEXT,
    PQ.QUESTION_DATE,
    PA.ANSWER_TEXT,
    PA.ANSWER_DATE,
    BUYER.NAME       AS BUYER_NAME,
    SELLER.NAME      AS SELLER_NAME
FROM
    PRODUCTQUESTIONS PQ,
    PRODUCTANSWERS   PA,
    USERS            BUYER,
    USERS            SELLER
WHERE
    PQ.QUESTION_ID = PA.QUESTION_ID
    AND PQ.PRODUCT_ID = :productId
    AND BUYER.USERID = PQ.BUYER_ID
    AND SELLER.USERID = PA.SELLER_ID
ORDER BY
    PQ.QUESTION_DATE DESC`,
      { productId }
    )

    const questions = []
    const questionMap = new Map()

    result.forEach((row) => {
      if (!questionMap.has(row.QUESTION_ID)) {
        questionMap.set(row.QUESTION_ID, {
          questionId: row.QUESTION_ID,
          questionText: row.QUESTION_TEXT,
          questionDate: row.QUESTION_DATE,
          buyerName: row.BUYER_NAME,
          answers: [],
        })
        questions.push(questionMap.get(row.QUESTION_ID))
      }

      if (row.ANSWER_TEXT) {
        questionMap.get(row.QUESTION_ID).answers.push({
          answerText: row.ANSWER_TEXT,
          answerDate: row.ANSWER_DATE,
          sellerName: row.SELLER_NAME,
        })
      }
    })

    res.status(200).json(questions)
  } catch (error) {
    console.error('Error fetching questions and answers:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

const getQuestionsForSeller = async (req, res) => {
  const { productId } = req.params

  try {
    const result = await runQuery(
      `SELECT
    PQ.QUESTION_ID,
    (SELECT PA.QUESTION_ID FROM PRODUCTANSWERS PA WHERE PA.QUESTION_ID = PQ.QUESTION_ID) AS ANSWER_ID,
    PQ.PRODUCT_ID,
    PQ.QUESTION_TEXT,
    PQ.QUESTION_DATE,
    (SELECT PA.ANSWER_TEXT FROM PRODUCTANSWERS PA WHERE PA.QUESTION_ID = PQ.QUESTION_ID) AS ANSWER_TEXT,
    (SELECT PA.ANSWER_DATE FROM PRODUCTANSWERS PA WHERE PA.QUESTION_ID = PQ.QUESTION_ID) AS ANSWER_DATE,
    (SELECT NAME FROM USERS WHERE USERID = PQ.BUYER_ID) AS BUYER_NAME,
    (SELECT NAME FROM USERS WHERE USERID = (SELECT SELLER_ID FROM PRODUCTANSWERS PA WHERE PA.QUESTION_ID = PQ.QUESTION_ID)) AS SELLER_NAME
FROM
    PRODUCTQUESTIONS PQ
    WHERE
    PQ.PRODUCT_ID = :productId
ORDER BY
    PQ.QUESTION_DATE DESC
`,
      { productId }
    )

    const questions = []
    const questionMap = new Map()

    result.forEach((row) => {
      if (!questionMap.has(row.QUESTION_ID)) {
        questionMap.set(row.QUESTION_ID, {
          questionId: row.QUESTION_ID,
          questionText: row.QUESTION_TEXT,
          questionDate: row.QUESTION_DATE,
          buyerName: row.BUYER_NAME,
          answers: [],
        })
        questions.push(questionMap.get(row.QUESTION_ID))
      }

      if (row.ANSWER_TEXT) {
        questionMap.get(row.QUESTION_ID).answers.push({
          answerText: row.ANSWER_TEXT,
          answerDate: row.ANSWER_DATE,
          sellerName: row.SELLER_NAME,
        })
      }
    })

    res.status(200).json(questions)
  } catch (error) {
    console.error('Error fetching questions for seller:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

const addQuestion = async (req, res) => {
  const { productId, buyerId, questionText } = req.body

  try {
    const result = await runQueryOutBinds(
      `INSERT INTO PRODUCTQUESTIONS (PRODUCT_ID, BUYER_ID, QUESTION_TEXT) 
       VALUES (:productId, :buyerId, :questionText) RETURNING QUESTION_ID INTO :questionId`,
      {
        productId,
        buyerId,
        questionText,
        questionId: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
      }
    )

    const questionId = result.questionId[0]

    res
      .status(201)
      .json({ questionId, productId, buyerId, questionText, answers: [] })
  } catch (error) {
    console.error('Error adding question:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

const addAnswer = async (req, res) => {
  const { questionId, sellerId, answerText } = req.body

  try {
    await runQuery(
      `INSERT INTO PRODUCTANSWERS (QUESTION_ID, SELLER_ID, ANSWER_TEXT) 
       VALUES (:questionId, :sellerId, :answerText)`,
      { questionId, sellerId, answerText }
    )

    const result = await runQuery(
      `SELECT 
         PA.ANSWER_TEXT, 
         PA.ANSWER_DATE, 
         U.NAME AS SELLER_NAME 
       FROM 
         PRODUCTANSWERS PA, USERS U 
       WHERE 
         PA.QUESTION_ID = :questionId 
         AND PA.SELLER_ID = :sellerId 
         AND PA.ANSWER_TEXT = :answerText 
         AND U.USERID = PA.SELLER_ID`,
      { questionId, sellerId, answerText }
    )

    if (result.length > 0) {
      const answer = result[0]
      res.status(201).json({
        answerText: answer.ANSWER_TEXT,
        answerDate: answer.ANSWER_DATE,
        sellerName: answer.SELLER_NAME,
      })
    } else {
      res.status(500).json({ error: 'Failed to retrieve inserted answer' })
    }
  } catch (error) {
    console.error('Error adding answer:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

const getProductReviews = async (req, res) => {
  const { productId } = req.params

  try {
    const reviews = await runQuery(
      `SELECT 
         REVIEW_ID,
         USER_ID,
         NAME,
         RATING,
         REVIEW_TEXT,
         REVIEW_DATE
       FROM 
         PRODUCTREVIEWS PR, 
         USERS U
       WHERE 
         PR.PRODUCT_ID = :productId
         AND PR.USER_ID = U.USERID
       ORDER BY 
         PR.REVIEW_DATE DESC`,
      { productId }
    )

    res.status(200).json({
      reviews: reviews.map((review) => ({
        reviewId: review.REVIEW_ID,
        userId: review.USER_ID,
        userName: review.NAME,
        rating: review.RATING,
        reviewText: review.REVIEW_TEXT,
        reviewDate: review.REVIEW_DATE,
      })),
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

const addProductReview = async (req, res) => {
  const { productId, userId, rating, reviewText } = req.body

  try {
    const result = await runQueryOutBinds(
      `INSERT INTO PRODUCTREVIEWS (USER_ID, PRODUCT_ID, RATING, REVIEW_TEXT) 
       VALUES (:userId, :productId, :rating, :reviewText) 
       RETURNING REVIEW_ID, REVIEW_DATE INTO :reviewId, :reviewDate`,
      {
        userId,
        productId,
        rating,
        reviewText,
        reviewId: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
        reviewDate: { type: oracledb.DATE, dir: oracledb.BIND_OUT },
      }
    )

    res.status(201).json({
      reviewId: result.reviewId[0],
      reviewDate: result.reviewDate[0],
      rating,
      reviewText,
    })
  } catch (error) {
    console.error('Error adding review:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

const averageRating = async (req, res) => {
  const { productId } = req.params

  try {
    const result = await runQuery(
      `SELECT AVG(RATING) AS AVERAGE_RATING FROM PRODUCTREVIEWS WHERE PRODUCT_ID = :productId`,
      { productId }
    )
    res.status(200).json(result[0])
  } catch (error) {
    console.error('Error fetching average rating:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = {
  getShop,
  getShopById,
  getShopByCategory,
  addProduct,
  updateProduct,
  archiveProduct,
  updateStock,
  createPurchase,
  getPurchaseHistoryByUserId,
  promoCodeCheck,
  submitProductReport,
  getQuestionsAndAnswers,
  getQuestionsForSeller,
  addQuestion,
  addAnswer,
  getProductReviews,
  addProductReview,
  averageRating,
}
