const router = require("express").Router();
const authController = require('../controllers/authController');

router.post('/register',authController.register)
router.post("/login",authController.login)
router.get("/verify",(req,res)=>{
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    },
  });
})
router.post("/logout",authController.logout)
module.exports = router;