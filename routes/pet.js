const router = require('express').Router();
const Controller = require('../controllers/petController');
const authentication =  require('../middleware/authentication');
const authhorization =  require('../middleware/authorization');

router.get('/', authentication, Controller.get);
router.get('/:id', authentication, Controller.getById);
router.post('/', authentication, Controller.create);
router.put('/:id', authentication, authhorization, Controller.update);
router.patch('/:id', authentication, Controller.updateRequest);
router.delete('/:id', authentication, authhorization, Controller.delete);

module.exports = router;