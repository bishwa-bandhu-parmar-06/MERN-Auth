const userModel = require('../models/user.model');

module.exports.getUserData = async (req, res) => {
    try {
        
        const { userId } = req.body;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }
        res.json({ success: true,
            message: 'User Data',
            userData: {
                name: user.name,
                isAccountVerified: user.isAccountVerified,
            }
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}