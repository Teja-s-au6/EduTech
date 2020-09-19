const { Router } = require('express')
const router = Router()

const {createCourse,uploadVideos,getAllCourses,getParticularCourse,amountpaycreate,verifyAmountPayment} = require("../controllers/apiController");

const authenticate = require("../middleware/authenticate");

const upload = require('../utils/multer');

router.post('/createcourse',authenticate,  createCourse)

router.post('/uploadvideos/:courseId', upload.array("videos", 10),authenticate,  uploadVideos)

router.get('/courses',authenticate,  getAllCourses)

router.get('/course/:courseId',authenticate,  getParticularCourse)

router.post('/user/pay', authenticate, amountpaycreate);

router.post('/user/payment/verify', authenticate, verifyAmountPayment);

module.exports = router