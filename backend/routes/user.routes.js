const router= require('express').Router();
const userController = require('../controllers/user.controller');

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);

router.post('/',userController.createUsers);
router.put('/:id',userController.updateUsers);
router.delete('/:id',userController.deleteUsers);





module.exports = router;