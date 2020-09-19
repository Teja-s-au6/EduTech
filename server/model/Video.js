const {Schema, model} = require("mongoose");

const videoSchema  = new Schema ({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String
    },
    link: {
        type : String
    },
    course : {
        type : Schema.Types.ObjectId,
        ref: "course"
    }
})

const Video = model("video", videoSchema)

module.exports = Video