import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import { message } from 'antd'

export const allCourses = createAsyncThunk('user/allCourses', async() => {
    const storage = JSON.parse(localStorage.getItem("user"))
    try {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': storage.token
        }
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/courses`, {headers: headers})
        console.log(response.data)
        return response.data
    } catch (err) {
        console.log(err)
    }
})

export const getParticularCourse = createAsyncThunk('user/getParticularCourse', async(courseId) => {
    const storage = JSON.parse(localStorage.getItem("user"))
    try {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': storage.token
        }
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/course/${courseId}`, {headers: headers})
        console.log(response.data)
        return response.data
    } catch (err) {
        console.log(err)
    }
})

export const createCourse = createAsyncThunk('user/createCourse', async(data) => {
    const storage = JSON.parse(localStorage.getItem("user"))
    try {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': storage.token
        }
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/createcourse`,data, {headers: headers})
        console.log(response.data)
        message.success("Course Created Suuccesfully, Click On the Upload video")
        return response.data
    } catch (err) {
        console.log(err)
    }
})

export const uploadVideo = createAsyncThunk('user/uploadVideo', async({courseId, data}) => {
    const storage = JSON.parse(localStorage.getItem("user"))
    try {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': storage.token
        }
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/uploadvideos/${courseId}`,data, {headers: headers})
        console.log(response.data)
        message.success("video uploaded successfully")
        return response.data
    } catch (err) {
        console.log(err)
        message.warning("video uploaded Unsuccessfully")
    }
})


const slice = createSlice({
    name: "courseReducer",
    initialState: {
        course: null,
        particularCourse: null,
        createdCourse : null,
        isFetching: false
    },
    reducers:{},
    extraReducers: {
        [allCourses.pending] : (state, action) => {
            state.isFetching = true
        },
        [allCourses.fulfilled]: (state, action) => {
            state.course = action.payload;
            state.isFetching = false;
        },
        [allCourses.rejected]: (state, action) => {
            state.course = null
            state.isFetching = false;
        },
        [getParticularCourse.pending] : (state, action) => {
            state.isFetching = true
        },
        [getParticularCourse.fulfilled]: (state, action) => {
            state.particularCourse = action.payload;
            state.isFetching = false;
        },
        [getParticularCourse.rejected]: (state, action) => {
            state.particularCourse = null
            state.isFetching = false;
        },
        [createCourse.pending] : (state, action) => {
            state.isFetching = true
        },
        [createCourse.fulfilled]: (state, action) => {
            state.createdCourse = action.payload;
            state.isFetching = false;
        },
        [createCourse.rejected]: (state, action) => {
            state.createdCourse = null
            state.isFetching = false;
        },
        [uploadVideo.pending] : (state, action) => {
            state.isFetching = true
        },
        [uploadVideo.fulfilled]: (state, action) => {
            //state.createdCourse = action.payload;
            state.isFetching = false;
        },
        [uploadVideo.rejected]: (state, action) => {
            //state.createdCourse = null
            state.isFetching = false;
        },

    }
})

export default slice.reducer;