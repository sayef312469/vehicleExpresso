import React, { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import {
  Card,
  Button,
  ButtonGroup,
  Container,
  ListGroup,
  Form,
  Alert,
} from 'react-bootstrap'
import { toast } from 'react-toastify'
import StarRating from '../components/StarRating'
import { squircle } from 'ldrs'
squircle.register()

const ProductDetail = ({
  product,
  onBackToShop,
  handleAddToCart,
  userDetail,
}) => {
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [reviews, setReviews] = useState([])
  const [newReview, setNewReview] = useState('')
  const [rating, setRating] = useState(0)
  const [showQASection, setShowQASection] = useState(false)
  const [questions, setQuestions] = useState([])
  const [newQuestion, setNewQuestion] = useState('')
  const [reportText, setReportText] = useState('')
  const [reportSubmitted, setReportSubmitted] = useState(false)
  const [showReportSection, setShowReportSection] = useState(false)
  const [loading, setLoading] = useState(true)
  const [averageRating, setAverageRating] = useState(0)

  const incrementQuantity = () => {
    setQuantity((prevQuantity) =>
      prevQuantity < product.SELLER_STOCK ? prevQuantity + 1 : prevQuantity
    )
  }

  const decrementQuantity = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1))
  }

  const handleAddToCartClick = () => {
    if (quantity > product.SELLER_STOCK) {
      alert(`Cannot add more than ${product.SELLER_STOCK} items to the cart.`)
    } else {
      addToCart({ ...product, quantity })
      handleAddToCart(product.PRODUCT_ID, quantity)
    }
  }

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/api/shop/reviews/${product.PRODUCT_ID}`
        )
        if (response.ok) {
          const data = await response.json()
          console.log(data)
          setReviews(data.reviews)
        } else {
          console.error('Failed to fetch reviews')
        }
      } catch (error) {
        console.error('Error fetching reviews:', error)
      }
    }

    fetchReviews()
  }, [product.PRODUCT_ID])

  const handleAddReview = async () => {
    const reviewData = {
      productId: product.PRODUCT_ID,
      userId: userDetail.USERID,
      rating: rating,
      reviewText: newReview,
    }

    try {
      const response = await fetch(
        'http://localhost:4000/api/shop/add-review',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reviewData),
        }
      )

      if (response.ok) {
        const data = await response.json()

        if (newReview && rating > 0) {
          setReviews((prevReviews) => [
            {
              reviewId: data.reviewId,
              userName: userDetail.NAME,
              rating: data.rating,
              reviewText: data.reviewText,
              reviewDate: data.reviewDate,
            },
            ...prevReviews,
          ])
          setNewReview('')
          setRating(0)
        } else {
          toast.error('Please provide a review and a rating.')
        }
      } else {
        console.error('Failed to submit review')
      }
    } catch (error) {
      console.error('Error submitting review:', error)
    }
  }

  useEffect(() => {
    const fetchQuestionsAndAnswers = async () => {
      try {
        let response
        if (product.SELLER_ID === userDetail.USERID) {
          response = await fetch(
            `http://localhost:4000/api/shop/product/${product.PRODUCT_ID}/qna`
          )
        } else {
          response = await fetch(
            `http://localhost:4000/api/shop/product/${product.PRODUCT_ID}/questions`
          )
        }
        if (response.ok) {
          const data = await response.json()
          setQuestions(data)
        } else {
          console.error('Failed to fetch questions and answers')
        }
      } catch (error) {
        console.error('Error fetching questions and answers:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchQuestionsAndAnswers()
  }, [product.PRODUCT_ID])

  useEffect(() => {
    const fetchAverageRating = async () => {
      const response = await fetch(
        `http://localhost:4000/api/shop/average-rating/${product.PRODUCT_ID}`
      )
      const data = await response.json()
      console.log('star rating: ' + data.AVERAGE_RATING)
      setAverageRating(data.AVERAGE_RATING)
    }
    fetchAverageRating()
  }, [product.PRODUCT_ID])

  const StarRatingNew = ({ rating }) => {
    const starPercentage = (rating / 5) * 100
    console.log('star percentage: ' + starPercentage)
    return (
      <div className="star-container">
        <div
          className="star-filled"
          style={{ width: `${starPercentage}%` }}
        ></div>
      </div>
    )
  }

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <l-squircle
          size="37"
          stroke="5"
          stroke-length="0.15"
          bg-opacity="0.1"
          speed="0.9"
          color="rgba(33, 244, 177, 0.653)"
        ></l-squircle>
      </div>
    )
  }

  const handleAddQuestion = async () => {
    if (newQuestion) {
      const questionData = {
        productId: product.PRODUCT_ID,
        buyerId: userDetail.USERID,
        questionText: newQuestion,
      }

      try {
        const response = await fetch(
          'http://localhost:4000/api/shop/add-question',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(questionData),
          }
        )

        if (response.ok) {
          setNewQuestion('')
          toast.success('Question submitted successfully!')
        } else {
          toast.error('An error occurred while submitting the question.')
        }
      } catch (error) {
        console.error('Error submitting question:', error)
        toast.error('An error occurred while submitting the question.')
      }
    } else {
      toast.error('Please enter a question.')
    }
  }

  const handleAddAnswer = async (questionIndex, answerText) => {
    console.log('questionIndex:', questionIndex)
    const answerData = {
      questionId: questions[questionIndex].questionId,
      sellerId: userDetail.USERID,
      answerText: answerText,
    }

    try {
      const response = await fetch(
        'http://localhost:4000/api/shop/add-answer',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(answerData),
        }
      )

      if (response.ok) {
        const data = await response.json()
        const updatedQuestions = [...questions]
        updatedQuestions[questionIndex].answers.push({
          answerText: data.answerText,
          answerDate: data.answerDate,
          sellerName: data.sellerName,
        })
        setQuestions(updatedQuestions)
      } else {
        console.error('Failed to submit answer')
      }
    } catch (error) {
      console.error('Error submitting answer:', error)
    }
  }

  const handleReportSubmit = async () => {
    const reportData = {
      productId: product.PRODUCT_ID,
      userId: userDetail.USERID,
      reportText: reportText,
    }

    try {
      const response = await fetch(
        'http://localhost:4000/api/shop/report-product',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reportData),
        }
      )

      if (response.ok) {
        setReportSubmitted(true)
        toast.success('Report submitted successfully!')
      } else {
        console.error('Failed to submit report')
        toast.error('Please provide a description of the issue.')
      }
    } catch (error) {
      console.error('Error submitting report:', error)
      toast.error('An error occurred while submitting the report.')
    }
  }

  return (
    <div className="product-detail">
      <Button className="back-button" variant="link" onClick={onBackToShop}>
        <div className="back-to-shop">
          <span className="material-symbols-outlined">chevron_left</span>
          <span>Back to Shop</span>
        </div>
      </Button>
      <Card>
        <Card.Img
          variant="top"
          src={product.PRODUCT_IMAGE_URL}
          alt={product.PRODUCT_NAME}
        />
        <Card.Body>
          <Card.Title>{product.PRODUCT_NAME}</Card.Title>
          <div className="star-rating">
            <StarRatingNew rating={averageRating} />
          </div>
          <span className="rating-body">
            ({averageRating ? averageRating.toFixed(1) : 0})
          </span>
          <Card.Text>{product.PRODUCT_DESCRIPTION}</Card.Text>
          <p className="text-body">Available: {product.SELLER_STOCK}</p>
          <Card.Text className="price">
            <strong>Price:</strong> ${product.SELLER_PRICE.toFixed(2)}
          </Card.Text>
          {product.SELLER_STOCK > 0 ? (
            <div className="card-footer">
              <Container>
                <ButtonGroup
                  aria-label="Basic example"
                  className="quantity-button-group"
                >
                  <Button
                    className="quantity-btn text-color"
                    onClick={decrementQuantity}
                  >
                    -
                  </Button>
                  <span className="quantity-display">{quantity}</span>
                  <Button
                    className="quantity-btn text-color"
                    onClick={incrementQuantity}
                  >
                    +
                  </Button>
                </ButtonGroup>
              </Container>

              <div className="card-button" onClick={handleAddToCartClick}>
                <svg className="svg-icon" viewBox="0 0 20 20">
                  <path d="M17.72,5.011H8.026c-0.271,0-0.49,0.219-0.49,0.489c0,0.271,0.219,0.489,0.49,0.489h8.962l-1.979,4.773H6.763L4.935,5.343C4.926,5.316,4.897,5.309,4.884,5.286c-0.011-0.024,0-0.051-0.017-0.074C4.833,5.166,4.025,4.081,2.33,3.908C2.068,3.883,1.822,4.075,1.795,4.344C1.767,4.612,1.962,4.853,2.231,4.88c1.143,0.118,1.703,0.738,1.808,0.866l1.91,5.661c0.066,0.199,0.252,0.333,0.463,0.333h8.924c0.116,0,0.22-0.053,0.308-0.128c0.027-0.023,0.042-0.048,0.063-0.076c0.026-0.034,0.063-0.058,0.08-0.099l2.384-5.75c0.062-0.151,0.046-0.323-0.045-0.458C18.036,5.092,17.883,5.011,17.72,5.011z"></path>
                  <path d="M8.251,12.386c-1.023,0-1.856,0.834-1.856,1.856s0.833,1.853,1.856,1.853c1.021,0,1.853-0.83,1.853-1.853S9.273,12.386,8.251,12.386z M8.251,15.116c-0.484,0-0.877-0.393-0.877-0.874c0-0.484,0.394-0.878,0.877-0.878c0.482,0,0.875,0.394,0.875,0.878C9.126,14.724,8.733,15.116,8.251,15.116z"></path>
                  <path d="M13.972,12.386c-1.022,0-1.855,0.834-1.855,1.856s0.833,1.853,1.855,1.853s1.854-0.83,1.854-1.853S14.994,12.386,13.972,12.386z M13.972,15.116c-0.484,0-0.878-0.393-0.878-0.874c0-0.484,0.394-0.878,0.878-0.878c0.482,0,0.875,0.394,0.875,0.878C14.847,14.724,14.454,15.116,13.972,15.116z"></path>
                </svg>
              </div>
            </div>
          ) : (
            <div className="card-footer">
              <span className="text-title" style={{ color: 'red' }}>
                Out of stock
              </span>
            </div>
          )}
          <hr />
          <div>
            <Button
              variant="outline-danger"
              onClick={() => setShowReportSection(!showReportSection)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-exclamation-triangle-fill"
                viewBox="0 0 16 16"
                style={{ marginRight: '8px' }}
              >
                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.708c.89 0 1.437-.99.98-1.767L8.982 1.566zm.854 10.591a.905.905 0 1 1-1.81 0 .905.905 0 0 1 1.81 0zm-2.154-3.473a.5.5 0 0 1 .495-.563h1.346a.5.5 0 0 1 .495.563l-.2 4a.5.5 0 0 1-.495.437h-1.346a.5.5 0 0 1-.495-.437l-.2-4z" />
              </svg>
              {showReportSection ? 'Hide Report Section' : 'Report Product'}
            </Button>
            {showReportSection && (
              <div className="report-section">
                <h6>Report Product</h6>
                {reportSubmitted ? (
                  <Alert variant="success">
                    Thank you! Your report has been submitted.
                  </Alert>
                ) : (
                  <Form.Group>
                    <Form.Label>Describe the issue</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={reportText}
                      onChange={(e) => setReportText(e.target.value)}
                    />
                    <br />
                    <Button variant="danger" onClick={handleReportSubmit}>
                      Submit Report
                    </Button>
                  </Form.Group>
                )}
              </div>
            )}
          </div>
          <hr />
          <div>
            <Button
              variant="outline-primary"
              onClick={() => setShowQASection(!showQASection)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-question-circle"
                viewBox="0 0 16 16"
                style={{ marginRight: '8px' }}
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="M5.255 5.786a.237.237 0 0 0-.247.247c0 .164.09.233.247.233h.821v.252c0 .177.041.346.116.494.075.148.182.272.31.37.128.099.275.167.435.21a.942.942 0 0 0 .228.027c.22 0 .407-.06.548-.18.142-.12.217-.26.217-.419v-.637c0-.165-.072-.329-.217-.493a1.042 1.042 0 0 0-.317-.283l-.212-.105c-.142-.07-.247-.128-.316-.172a.53.53 0 0 1-.203-.235.548.548 0 0 1-.075-.296v-.108c0-.227.088-.403.265-.529.177-.126.39-.189.636-.189.243 0 .435.062.576.188.142.125.213.273.213.442v.09h.821v-.252c0-.163-.056-.317-.167-.463a1.49 1.49 0 0 0-.422-.368 2.115 2.115 0 0 0-.642-.217c-.25-.034-.504-.052-.764-.052-.221 0-.445.027-.671.08-.227.053-.444.128-.648.224a1.942 1.942 0 0 0-.528.345c-.149.142-.269.306-.361.49a2.4 2.4 0 0 0-.14.576h1.244v-.108zM6.5 10.793a.5.5 0 0 1 1 0 .5.5 0 0 1-1 0z" />
              </svg>
              {showQASection ? 'Hide Q&A Section' : 'Questions & Answers'}
            </Button>
            {showQASection && (
              <div className="qa-section">
                <hr />
                <h5>Questions & Answers</h5>
                {questions.length > 0 ? (
                  <ListGroup variant="flush">
                    {questions.map((question, index) => (
                      <ListGroup.Item key={index}>
                        {console.log(question)}
                        <strong>Q:</strong> {question.questionText}-
                        <em>{question.buyerName}</em>
                        <p>{question.questionDate}</p>
                        <strong>A:</strong>
                        {question.answers.length > 0 ? (
                          <ul>
                            {question.answers.map((answer, ansIndex) => (
                              <li key={ansIndex}>
                                {answer.answerText}-<em>{answer.sellerName}</em>
                                <br />
                                {answer.answerDate}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>No answers yet.</p>
                        )}
                        {product.SELLER_ID === userDetail.USERID && (
                          <Form.Group>
                            <Form.Control
                              type="text"
                              placeholder="Add an answer..."
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleAddAnswer(index, e.target.value)
                                  e.target.value = ''
                                }
                              }}
                            />
                          </Form.Group>
                        )}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                ) : (
                  <Alert variant="info">No questions yet.</Alert>
                )}
                <hr />
                <h6>Ask a Question</h6>
                <Form.Group>
                  <Form.Control
                    type="text"
                    placeholder="Enter your question..."
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                  />
                </Form.Group>
                <br />
                <Button variant="primary" onClick={handleAddQuestion}>
                  Submit Question
                </Button>
              </div>
            )}
          </div>
          <hr />
          <div className="review-section">
            <h5>Customer Reviews</h5>
            {reviews.length > 0 ? (
              <ListGroup variant="flush">
                {reviews.map((review, index) => (
                  <ListGroup.Item key={index}>
                    <strong>{review.userName}</strong> -{' '}
                    <em>{new Date(review.reviewDate).toLocaleDateString()}</em>
                    <br />
                    <div className="star-rating">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <span
                          key={i}
                          className={
                            i <= review.rating ? 'star filled' : 'star'
                          }
                        >
                          &#9733;
                        </span>
                      ))}
                    </div>
                    <p>{review.reviewText}</p>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <Alert variant="info">No reviews yet.</Alert>
            )}
            <hr />
            <h6>Add a Review</h6>
            <Form.Group>
              <Form.Label>Rating</Form.Label>
              <StarRating rating={rating} onRatingChange={setRating} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Review</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
              />
            </Form.Group>
            <br />
            <Button variant="primary" onClick={handleAddReview}>
              Submit Review
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}

export default ProductDetail
