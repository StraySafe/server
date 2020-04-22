const router = require('express').Router();
const threadController = require('../controllers/threadController')
const authentication =  require('../middleware/authentication');
const authhorization =  require('../middleware/authorizationThread');

router.get('/', threadController.fetchAllThread)
router.get('/:id', threadController.fetchThreadById)
router.put('/statusUnresolved/:id', threadController.updateStatusUnresolved)
router.put('/statusRequested/:id', threadController.updateStatusRequested)
router.put('/statusResolved/:id', threadController.updateStatusResolved)
router.post('/', authentication, threadController.createThread)
router.post('/:id', authentication, threadController.createComment)
router.put('/:id', authentication, authhorization, threadController.editThread)
router.delete('/:id', authentication, authhorization, threadController.deleteThread)

module.exports = router