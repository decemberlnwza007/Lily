const express = require('express');
const router = express.Router();
const User = require('../controller/user.controller');

router.get('/user/get', User.getUsers);

module.exports = router;