const router = require('express').Router();
const petRouter = require('./pet');
const threadRouter = require('../routes/thread')
const userController = require('../controllers/userController')

router.get('/', function (req, res) {
	res.send('Welcome StrayCare REST API');
});

router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/users/:id', userController.findUser)

router.use('/pet', petRouter);
router.use('/threads', threadRouter)

module.exports = router;