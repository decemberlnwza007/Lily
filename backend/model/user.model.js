const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const getAllUsers = async () => {
    const result = await db.query('SELECT * FROM users ORDER  BY id ASC');

    return result.rows;
}

const createUser = async (username, email, password, firstname, lastname, image) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
        'INSERT INTO users (username, email, password, firstname, lastname, image) VALUES ($1, $2, $3, $4'
    )
}

module.exports = {
    getAllUsers,
}