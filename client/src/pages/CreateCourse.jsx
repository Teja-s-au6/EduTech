import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createCourse, uploadVideo } from '../store/courseReducer';
import { Form, Input, Button, Typography } from 'antd';

const layout = {
	labelCol: {
		span: 5
	},
	wrapperCol: {
		span: 10
	}
};
const tailLayout = {
	wrapperCol: {
		offset: 5,
		span: 10
	}
};

class CreateCourse extends Component {
	state = {
		title: '',
		description: '',
		price: '',
		category: '',
        privacy: 'public',
        file : '',
        videotitle : '',
        videodescription : ''
	};

	handleChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	};

	handleSubmit = (e) => {
		e.preventDefault();
		this.props.createCourse(this.state);
		//this.props.history.push('/signIn')
	};

	handleSubmit1 = (e) => {
        e.preventDefault();
        const courseId = this.props.createdCourse.YourCourse._id
        const formData = new FormData()
		//console.log(this.state.file)
		formData.append('file', this.state.file)
		formData.append('title', this.state.videotitle)
        formData.append('description', this.state.videodescription)
        
        this.props.uploadVideo({courseId: courseId, data:formData});
    };
	render() {
		return this.props.createdCourse ? (
			<div>
				<Form
					{...layout}
					name="basic"
					initialValues={{
						remember: true
					}}
				>
					<Form.Item
						label="video Title"
						name="videotitle"
						rules={[
							{
								required: true,
								message: 'Please input videotitle!'
							}
						]}
					>
						<Input name="videotitle" onChange={this.handleChange} value={this.state.videotitle} />
					</Form.Item>

					<Form.Item
						label=" Description"
						name="videodescription"
						rules={[
							{
								required: true,
								message: 'Please input your videodescription!'
							}
						]}
					>
						<Input name="videodescription" onChange={this.handleChange} value={this.state.videodescription} />
					</Form.Item>
					<input type="file" id="myFile" name="filename" />
					<Button type="primary" onClick={this.handleSubmit1}>
						Upload a videos
					</Button>
				</Form>
			</div>
		) : (
			<div>
				<Form
					{...layout}
					name="basic"
					initialValues={{
						remember: true
					}}
				>
					<Form.Item
						label="Course Title"
						name="title"
						rules={[
							{
								required: true,
								message: 'Please input Course Title!'
							}
						]}
					>
						<Input name="title" onChange={this.handleChange} value={this.state.title} />
					</Form.Item>

					<Form.Item
						label="Course Description"
						name="description"
						rules={[
							{
								required: true,
								message: 'Please input your description!'
							}
						]}
					>
						<Input name="description" onChange={this.handleChange} value={this.state.description} />
					</Form.Item>

					<Form.Item
						label="category"
						name="category"
						rules={[
							{
								required: true,
								message: 'Please input your category!'
							}
						]}
					>
						<Input name="category" onChange={this.handleChange} value={this.state.category} />
					</Form.Item>

					<Form.Item
						label="price"
						name="price"
						rules={[
							{
								required: true,
								message: 'Please input your price!'
							}
						]}
					>
						<Input name="price" type="number" onChange={this.handleChange} value={this.state.price} />
					</Form.Item>

					<Form.Item {...tailLayout}>
						<Button type="primary" htmlType="create Course" onClick={this.handleSubmit}>
							create a course
						</Button>
					</Form.Item>
				</Form>
			</div>
		);
	}
}

const mapStateToProps = (storeState) => {
	return {
		user: storeState.features.user.user,
		createdCourse: storeState.features.course.createdCourse
	};
};

export default connect(mapStateToProps, { createCourse, uploadVideo })(CreateCourse);
