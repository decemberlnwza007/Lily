const User = require('../model/user.model');

exports.getUsers = async (req, res) => {
    try {
        const users = await User.getAllUsers();
        res.json(users)
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.RegisterController = async (req, res) => {
    try {
        const { username, email, password, firstname, lastname, image } = req.body;

        const users = await User.RegisterModel(username, email, password, firstname, lastname, image);
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
