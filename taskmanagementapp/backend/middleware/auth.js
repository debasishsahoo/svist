const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticate=async(req,res,next)=>{}
const authorize=(...roles)=>{}

module.exports={authenticate,authorize}