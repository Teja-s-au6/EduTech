const {connect} = require("mongoose");
const {MONGODB_URI,MONGODB_PASSWORD} = process.env


connect(MONGODB_URI.replace("<password>", MONGODB_PASSWORD),
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }).then(function () {
        console.log('Database Connected Successfully');
    }).catch(function (err) {
        console.log(err.message);
    });