const express = require('express');
const userRouter = express.Router();

const { getUserData } = require('../controllers/user.controller');
const userAuth = require('../middleware/user.Auth');

userRouter.get('/get-user-data', userAuth,getUserData);

module.exports = userRouter;