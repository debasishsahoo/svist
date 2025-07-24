const User = require("../models/User");
const { body } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation');

exports.register= async (req, res) => {}
exports.login= async (req, res) => {}
exports.logout= async (req, res) => {}
exports.getProfile= async (req, res) => {}
exports.updateProfile= async (req, res) => {}
exports.updatePassword= async (req, res) => {}
exports.deleteAccount= async (req, res) => {}