import  {combineReducers} from '@reduxjs/toolkit';
import userReducer from './userReducer';
import courseReducer from './courseReducer'
import paymentReducer from './paymentReducer';
export default combineReducers({
    user : userReducer,
    course : courseReducer,
    paymentState: paymentReducer
})