const express = require('express');
const { register, login, logout, sendVerifyOtp, verifyEmail, isAuthenticated, sendResetOtp, resetPassword } = require('../controllers/auth.controller');
const userAuth = require('../middleware/user.Auth');
const authRouter = express.Router();

authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.get('/logout',logout);


authRouter.post('/send-verify-otp',userAuth,sendVerifyOtp);
authRouter.post('/verify-account',userAuth,verifyEmail);

authRouter.get('/is-auth',userAuth,isAuthenticated);

authRouter.post('/send-reset-otp',sendResetOtp);
authRouter.post('/reset-password',resetPassword);



module.exports = authRouter;
