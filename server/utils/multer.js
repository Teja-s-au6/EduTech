const multer = require('multer')


const multerConfig = multer({
    storage : multer.memoryStorage(),
    limits : {
        fileSize : 1024*1024*100
    },
    fileFilter: (_, file, cb) => {
            cb(null, true)
    }
})

const upload = multer(multerConfig)
module.exports = upload