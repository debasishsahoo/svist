const router= require('express').Router();
const userController = require('../controllers/user.controller');

router.get('/:id', userController.getUserById);

module.exports = router;