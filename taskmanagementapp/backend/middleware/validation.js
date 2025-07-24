const { body, validationResult } = require("express-validator");

const handleValidationErrors=(req,res,next)=>{}

const ValidateRegister=[]
const ValidateLogin=[]
const ValidateTask=[]
module.exports={
  ValidateRegister,
  ValidateLogin,
  ValidateTask,
  handleValidationErrors,
}