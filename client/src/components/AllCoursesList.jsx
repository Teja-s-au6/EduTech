import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { List, Avatar, Button } from 'antd';

class AllCoursesList extends Component {

	render() {
        //console.log(this.props.homes)
		return (
			<div>
				<List
					itemLayout="vertical"
					size="large"
					pagination={{
						onChange: (page) => {
							console.log(page);
						},
						pageSize: 10
					}}
					dataSource={this.props.courses}
					renderItem={(item) => (
						<List.Item key={item._id} actions={[<Link to={`/course/${item._id}`}><Button type="primary" >Get Details</Button></Link>]}>
							<List.Item.Meta
								title={item.title}
								description={item.user.name}
                            />
                            <p>₹{item.price}</p>
						</List.Item>
					)}
				/>
			</div>
		);
	}
}

export default (AllCoursesList);