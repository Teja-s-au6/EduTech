const express = require("express");
const {config} = require("dotenv");
const cors = require("cors");

config()
require("./db")
require("./utils/razorpay")

const port = process.env.PORT || 1234

const app = express()
app.use(express.json())
app.use(cors())

const userRoutes = require("./routes/userRoutes")
const apiRoutes = require("./routes/apiRoutes")
app.use(userRoutes)
app.use(apiRoutes)

app.listen(port, () => {
    console.log("server started")
})

