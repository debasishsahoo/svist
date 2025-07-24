const router = require("express").Router();
const authController = require('../controllers/authController');


router.get('/profile',authController.getProfile);
router.put('/profile',authController.updateProfile);
router.put('/password',authController.updatePassword);
router.delete("/account",authController.deleteAccount);
module.exports = router;
