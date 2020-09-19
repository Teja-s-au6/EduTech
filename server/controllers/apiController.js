const Course = require('../model/Courses');
const AmountPay = require('../model/AmountPay');
const Video = require('../model/Video');
const bufferToString = require('../utils/bufferToString');
const cloudinary = require('../utils/cloudinary');
const instance = require("../utils/razorpay");
const createSignature = require("../utils/createSignature");
const {v4 : uuid } = require("uuid");

module.exports = {
	async createCourse(req, res) {
		try {
			const user = req.user;
			const body = req.body;
			//let videos = req.files;
			const createCourse = await Course.create({
				...body,
				user: user._id
			});
			// videos.forEach(async (element) => {
			// 	if (element.originalname !== undefined) {
			// 		const videoContent = bufferToString(element.originalname, element.buffer);
			// 	const {secure_url} = await cloudinary.v2.uploader.upload(videoContent, {
			// 			resource_type: 'video',
			// 			chunk_size: 6000000,
			// 			eager: [
			// 				{ width: 300, height: 300, crop: 'pad', audio_codec: 'none' },
			// 				{ width: 160, height: 100, crop: 'crop', gravity: 'south', audio_codec: 'none' }
			// 			]
			// 		},async function(error, result) {
            //             return  await result
            //         })
            //         console.log(secure_url)
            //         await createCourse.videos.push(secure_url);
            //         await createCourse.save();
			// 	}
			// });
			user.courses.push(createCourse._id);
			user.isInstructor = true;
			await user.save();
			res.status(201).json({
                YourCourse: createCourse,
                data : user,
				message: 'course created successfully'
			});
		} catch (err) {
			console.error(err);
			res.status(400).json({ err: err.message });
		}
	},

	async uploadVideos (req, res) {
	    try {
            const user = req.user
            console.log(req.body.data)
            const body = JSON.parse(req.body.data);
            const id = req.params.courseId
            console.log(id)
            let videos = req.files;
            const videoContent = bufferToString(videos[0].originalname, videos[0].buffer);
            const {secure_url} = await cloudinary.v2.uploader.upload(videoContent, {
                    resource_type: 'video',
                    chunk_size: 6000000,
                    eager: [
                        { width: 300, height: 300, crop: 'pad', audio_codec: 'none' },
                        { width: 160, height: 100, crop: 'crop', gravity: 'south', audio_codec: 'none' }
                    ]
                },async function(error, result) {
                    return  await result
                })
            const foundCourse = await Course.findById({ _id : id})
            const videoDetail = await Video.create({ ...body , course : foundCourse._id, link : secure_url})
            foundCourse.videos.push(videoDetail)
            await foundCourse.save()
            res.status(201).json({
				YourCourse: foundCourse,
				message: 'course created successfully'
			});

	    } catch (err) {
	        console.error(err)
	        res.status(400).json({err : err.message})
	    }
    },

    async getAllCourses (req, res) {
        try {
            const courses = await Course.find({
                privacy : "public"
            }).populate('user')
            res.status(200).json({ courses : courses })
        } catch (err) {
            console.error(err)
	        res.status(400).json({err : err.message})
        }
    },

    async getParticularCourse (req, res) {
        try {
            const id = req.params.courseId
            const foundCourse = await Course.findById({ _id : id }).populate("videos").populate("user")
            res.status(200).json({ particularCourse : foundCourse }) 
            
        } catch (err) {
            console.error(err)
	        res.status(400).json({err : err.message})
        }
    },
    async amountpaycreate (req, res) {
        try {
            const user = req.user;
            const {amountInPaise, currency} = req.body;
            const transactionId = uuid()
            const orderOptions = {
                currency,
                amount : amountInPaise,
                receipt: transactionId,
                payment_capture: 0
            }
            const order = await instance.orders.create(orderOptions);
            const transactions = await AmountPay.create({user: user._id, transactionId: transactionId, orderValue: `${amountInPaise / 100} INR`, razorpayOrderId: order.id })
            res.status(201).json({message: "payment successfull", orderId: order.id})
        } catch (err) {
            console.error(err)
            res.status(400).json({err : err.message})
        }
    },

    async verifyAmountPayment (req, res) {
        const user = req.user
        const {amount,currency,razorpay_order_id,razorpay_payment_id,razorpay_signature,courseId} = req.body;
        try {
            const createdSignature = createSignature(razorpay_order_id, razorpay_payment_id);
            if(createdSignature !== razorpay_signature) {
                return res.status(401).send({ message: "Invalid payment request"})
            }
            const captureResponse = await instance.payments.capture(razorpay_payment_id, amount, currency)
            const foundPayment = await AmountPay.find({razorpayOrderId: razorpay_order_id})
            const foundCourse = await Course.findOneAndUpdate({_id: courseId},{ $inc  : {Enrolled : 1}},{new: true })
            if(!foundPayment) {
                return res.status(401).send({ message: "Invalid payment request"})
            }
            foundPayment[0].razorpayTransactionId = razorpay_payment_id
            foundPayment[0].razorpaySignature = razorpay_signature
            foundPayment[0].isPending = false
            await foundPayment[0].save()
            user.coursesTaken.push(courseId)
            user.coursePayment.push(foundPayment[0]._id)
            await user.save()
            res.status(201).json({foundPayment, data : user, token : user.accessToken})
        } catch (err) {
            console.error(err)
            res.status(400).json({err : err.message})
        }
    }
};
