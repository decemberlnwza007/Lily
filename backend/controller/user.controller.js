const User = require('../model/user.model');

exports.getUsers = async (req, res) => {
    try {
        const users = await User.getAllUsers();
        res.json(users)
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}