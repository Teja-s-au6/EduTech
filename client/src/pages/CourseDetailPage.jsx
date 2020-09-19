import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { getParticularCourse } from '../store/courseReducer';
import { createPayment, paymentSuccess } from '../store/paymentReducer';
import { Player } from 'video-react';
import '../styles/VideoPlayer.css';
import { Button } from 'antd';
export class CourseDetailPage extends Component {
	state = {
		book: false
	};
	componentDidMount() {
		const courseId = this.props.match.params.courseId;
		this.props.getParticularCourse(courseId);
	}

	handleDepositBook = (e) => {
		e.preventDefault();
		this.setState({ book: true });
		const price = this.props.particularCourse.particularCourse.price;
		const payment = {
			amountInPaise: price * 100,
			currency: 'INR'
		};
		this.props.createPayment(payment);
	};

	handleDepositPayment = (e) => {
		e.preventDefault();
		const courseId = this.props.match.params.courseId;
		const price = this.props.particularCourse.particularCourse.price;
		const checkoutObject = {
			key: 'rzp_test_ZwkXJNBqm8UDM9',
			amount: price * 100,
			currency: 'INR',
			name: this.props.user.data.name,
			order_id: this.props.order.orderId,
			handler: ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
				const details = {
					razorpay_order_id,
					razorpay_payment_id,
					razorpay_signature,
					amount: price * 100,
					currency: 'INR',
					courseId: courseId
				};
				this.props.paymentSuccess(details);
			}
		};
		const razorpay = new window.Razorpay(checkoutObject);
		razorpay.open();
		this.setState({ book: false });
	};

	render() {
		if (!this.props.user) return <Redirect to="/" />;
		return this.props.particularCourse ? (
			<div>
				<h1>{this.props.particularCourse.particularCourse.title}</h1>
				<h2>Instructor : {this.props.particularCourse.particularCourse.user.name}</h2>
				<h4>Price : ₹{this.props.particularCourse.particularCourse.price}</h4>
                <h4>Enrolled : {this.props.particularCourse.particularCourse.Enrolled}</h4>
				<p>About Course : {this.props.particularCourse.particularCourse.description}</p>
				<h3>Videos</h3>
				{this.props.particularCourse.particularCourse.videos.map((el) => {
					return this.props.user.data.coursesTaken.includes(this.props.particularCourse.particularCourse._id) ? (
						<div style={{ marginLeft: 400 }} key={el._id}>
							<h1>{el.title}</h1>
							<p>{el.description}</p>
							<div style={{ width: 800, height: 500 }}>
								<Player>
									<source src={el.link} />
								</Player>
							</div>
						</div>
					) : (
						<p key={el._id}>You have to take this course to view the video</p>
					);
                })}
                {this.props.user.data.coursesTaken.includes(this.props.particularCourse.particularCourse._id) ? 
                    <h1>Already Paid Enjoy the Course</h1> 
                    :
                    this.state.book ? (
                        <Button onClick={this.handleDepositPayment} type="primary">
                            Pay the Amount
                        </Button>
                    ) : (
                        <Button onClick={this.handleDepositBook}>Enroll Now</Button>
                    )
                }
			</div>
		) : null;
	}
}

const mapStateToProps = (storeState) => {
	return {
		user: storeState.features.user.user,
        particularCourse: storeState.features.course.particularCourse,
        order : storeState.features.paymentState.order,
        successPayment : storeState.features.paymentState.successPayment
	};
};

export default connect(mapStateToProps, { getParticularCourse, createPayment, paymentSuccess })(CourseDetailPage);
