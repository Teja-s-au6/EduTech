const { Router } = require('express')
const router = Router()

const {signUp,signIn,signOut} = require("../controllers/userController");

const authenticate = require("../middleware/authenticate");

router.post('/signUp', signUp)
router.post('/signIn', signIn)
router.delete('/signOut', authenticate, signOut)

module.exports = router