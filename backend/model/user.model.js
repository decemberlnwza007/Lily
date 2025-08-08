const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const getAllUsers = async () => {
    const result = await db.query('SELECT * FROM users ORDER  BY id ASC');

    return result.rows;
}

module.exports = {
    getAllUsers,
}