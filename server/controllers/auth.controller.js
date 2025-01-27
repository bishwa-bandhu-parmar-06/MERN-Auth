const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const transporter = require('../config/nodemailer');


// ============= User Registration =================


module.exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({ success: false, message: 'Please fill all the fields' });
    }
    try {
        const ExisingUser = await userModel.findOne({ email });
        if (ExisingUser) {
            return res.json({ success: false, message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, { httpOnly: true,
            secure: process.env.NODE_ENV === 'production' ? true : false,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // sending email verification otp
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Email Verification',
            text: `Welcome to MERN Auth website. Your account has been created with the email ID:  ${email}`,
        };

        await transporter.sendMail(mailOptions);


        return res.json({ success: true, message: 'User registered successfully' });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}




// ============= User Login =============

module.exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ success: false, message: 'Required Email or Password' });
    }

    try {
        const user = await userModel.findOne({ email });
        
        if (!user) {
            return res.json({ success: false, message: 'Credentials does not Exist' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid Credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, { httpOnly: true,
            secure: process.env.NODE_ENV === 'production' ? true : false,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({ success: true, message: 'User logged in successfully' });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}



// ============= User Logout =============


module.exports.logout = async (req, res) => {

    try {
        res.clearCookie('token',{
            secure: process.env.NODE_ENV === 'production' ? true : false,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        return res.json({ success: true, message: 'User logged out successfully' });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
    
}



// ============= User Verification =================

module.exports.sendVerifyOtp = async (req, res) => {

    try {
        const { userId } = req.body;
        const user = await userModel.findById(userId);

        // if (!user) {  // Check if user exists
        //     return res.json({ success: false, message: 'User not found' });
        // }

        if (user.isAccountVerified) {
            return res.json({ success: false, message: 'Account already Verified' });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.verifyOtp = otp;


        user.verifyotpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Email or Account Verification OTP',
            text: `Your OTP for email verification is ${otp}`,
        };

        await transporter.sendMail(mailOptions);

        return res.json({ success: true, message: 'OTP sent successfully' });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


// ============= Verify Email OTP =================

module.exports.verifyEmail = async (req, res) => {

    const { userId, otp } = req.body;

    if (!userId || !otp) {
        return res.json({ success: false, message: 'Missing Details' });
    }

    try {
        
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }


        if(user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.json({ success: false, message: 'Invalid OTP' });
        }

        if (user.verifyotpExpireAt < Date.now()) {
            return res.json({ success: false, message: 'OTP expired' });
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyotpExpireAt = 0;

        await user.save();

        return res.json({ success: true, message: 'Email Verified Successfully' });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


// ==========User  Is Authenticated or Not =============

module.exports.isAuthenticated = async (req, res) =>{
    try {
        return res.json({ success: true, message: 'Authenticated' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


// ============= Send  Password Reset OTP =============
module.exports.sendResetOtp = async (req, res) => {
    
    const { email } = req.body;

    if (!email) {
        return res.json({ success: false, message: 'Email is Required' });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.resetOtp = otp;


        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'password Reset OTP',
            text: `Your OTP for Reseting your Password is ${otp}, This OTP is valid for 15 minutes`,
        };

        await transporter.sendMail(mailOptions);

        return res.json({ success: true, message: 'OTP sent to Your email is successfully' });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }

}


// ============= Reset User Password =============

module.exports.resetPassword = async (req, res) => {

    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.json({ success: false, message: 'Email, OTP and New Password is Required' });
    }

    try {
        
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        if(user.resetOtp === '' || user.resetOtp !== otp) {
            return res.json({ success: false, message: 'Invalid OTP' });
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: 'OTP expired' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;
        

        await user.save();

        return res.json({ success: true, message: 'Password Reset Successfully' });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}
