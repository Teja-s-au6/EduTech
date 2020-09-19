import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import { message } from 'antd'

export const registration = createAsyncThunk('user/registration', async(data) => {
    try {
        const headers = {
            'Content-Type': 'application/json'
        }
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/signUp`, data, {headers: headers})
        //console.log(response.data)
        message.success("Registeration Successfull")
        return response.data
    } catch (err) {
        console.log(err)
        message.warning("Registeration UnSuccessfull")
    }
})

export const logIn = createAsyncThunk('user/logIn', async(data) => {
    try {
        const headers = {
            'Content-Type': 'application/json'
        }
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/signIn`, data, {headers: headers})
        console.log(response.data)
        message.success("Login Successfull")
        return response.data
    } catch (err) {
        console.log(err)
        message.warning("Login UnSuccessfull")
    }
})

export const logOut = createAsyncThunk('user/logOut', async(_,{getState}) => {
    const storage = JSON.parse(localStorage.getItem("user"))
    try {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': storage.token
        }
        const response = await axios.delete(`${process.env.REACT_APP_BASE_URL}/signOut`, {headers: headers})
        //console.log(response.data)
        message.success("LogOut Successfull")
        return response.data
    } catch (err) {
        console.log(err)
    }
})

export const profile = createAsyncThunk('user/profile', async(_,{getState}) => {
    const accessToken = JSON.parse(localStorage.getItem("user"))
    try {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': accessToken
        }
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/profile`, {headers: headers})
        //console.log(response.data)
        return response.data
    } catch (err) {
        console.log(err)
    }
})


const slice = createSlice({
    name: "userReducer",
    initialState: {
        user: JSON.parse(localStorage.getItem('user')) || null,
        userDetails: null,
        isAuthenticating: false
    },
    reducers:{},
    extraReducers: {
        [registration.pending] : (state, action) => {
            state.isAuthenticating = true
        },
        [registration.fulfilled]: (state, action) => {
            const userJSON = JSON.stringify(action.payload);
            localStorage.setItem("user", userJSON);
            state.user = action.payload
            state.isAuthenticating = false;
        },
        [registration.rejected]: (state, action) => {
            state.user = null
            state.isAuthenticating = false;
        },
        [logIn.pending] : (state, action) => {
            state.isAuthenticating = true
        },
        [logIn.fulfilled]: (state, action) => {
            const userJSON = JSON.stringify(action.payload);
            localStorage.setItem("user", userJSON);
            state.user = action.payload
            state.isAuthenticating = false;
        },
        [logIn.rejected]: (state, action) => {
            state.user = null
            state.isAuthenticating = false;
        },
        [logOut.pending] : (state, action) => {
            state.isAuthenticating = true
        },
        [logOut.fulfilled]: (state, action) => {
            state.user = null;
            state.isAuthenticating = false;
        },
        [logOut.rejected]: (state, action) => {
            state.user = null
            state.isAuthenticating = false;
        },
        [profile.pending] : (state, action) => {
            state.isAuthenticating = true
        },
        [profile.fulfilled]: (state, action) => {
            state.userDetails = action.payload;
            state.isAuthenticating = false;
        },
        [profile.rejected]: (state, action) => {
            state.userDetails = null
            state.isAuthenticating = false;
        }
    }
})

export default slice.reducer;