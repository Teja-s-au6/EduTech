const {Schema, model} = require("mongoose");
const {hash, compare} = require("bcrypt");

const courseSchema  = new Schema ({
    user :{
        type : Schema.Types.ObjectId,
        ref : "user"
    },
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    couponCode : {
        type : Number
    },
    videos : [{
        type : Schema.Types.ObjectId,
        ref : 'video'
    }],
    revenue : [{
        type: String
    }],
    quesAndAns : [{
        type: String
    }],
    category : {
        type: String,
        required: true
    },
    isUserPaid : {
        type: Boolean,
        default: false
    },
    Enrolled : {
        type : Number,
        default : 0
    },
    privacy : {
        type : String
    }

})

const Course = model("course", courseSchema)

module.exports = Course