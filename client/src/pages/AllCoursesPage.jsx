import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import  { allCourses } from '../store/courseReducer';
import AllCoursesList from '../components/AllCoursesList';
//import { Spin } from 'antd';
class UnVerifiedHomesPage extends Component {
    componentDidMount() {
        this.props.allCourses()
    }
    render() {
        if(!this.props.user) return <Redirect to="/" />
        return (
            this.props.courses ?
            <AllCoursesList courses={this.props.courses.courses} />
             : null
        )
       
    }
}


const mapStateToProps = (storeState) => {
    return {
        user : storeState.features.user.user,
        courses : storeState.features.course.course
    }
}

export default connect(mapStateToProps, {allCourses})(UnVerifiedHomesPage)