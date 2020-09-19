import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import { notification } from 'antd'
export const createPayment = createAsyncThunk('user/createPayment', async(payment) => {
    const storage = JSON.parse(localStorage.getItem("user"))
    try {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': storage.token
        }
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/user/pay`,payment, {headers: headers})
        console.log(response.data)
        notification.success({
            message : "request received",
            description :"you can proceesd with the payment now!",
            duration : 3
        })
        return response.data
    } catch (err) {
        console.log(err)
    }
})

export const paymentSuccess = createAsyncThunk('user/paymentSuccess', async(details) => {
    const storage = JSON.parse(localStorage.getItem("user"))
    try {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': storage.token
        }
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/user/payment/verify`,details, {headers: headers})
        console.log(response.data)
        notification.success({
            message : "request received",
            description :"Payment Successfull",
            duration : 3
        })
        return response.data
    } catch (err) {
        console.log(err)
        alert("Payment Unsuccessfull")
    }
})

const slice = createSlice({
    name: "courseReducer",
    initialState: {
        order: null,
        successPayment: null,
        isGetting: false
    },
    reducers:{},
    extraReducers: {
        [createPayment.pending] : (state, action) => {
            state.isFetching = true
        },
        [createPayment.fulfilled]: (state, action) => {
            state.order = action.payload;
            state.isFetching = false;
        },
        [createPayment.rejected]: (state, action) => {
            state.order = null
            state.isFetching = false;
        },
        [paymentSuccess.pending] : (state, action) => {
            state.isFetching = true
        },
        [paymentSuccess.fulfilled]: (state, action) => {
            const userJSON = JSON.stringify(action.payload);
            localStorage.setItem("user", userJSON);
            state.successPayment = action.payload;
            state.isFetching = false;
        },
        [paymentSuccess.rejected]: (state, action) => {
            state.successPayment = null
            state.isFetching = false;
        }
    }
})

export default slice.reducer;