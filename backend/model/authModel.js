const db = require("../config/postgres");

exports.findUserByEmail  = async (email) => {
    const response = await db.query("SELECT id, email, password_hash, name FROM users WHERE email = $1", [email]);
    return response.rows[0]
}

exports.createUser = async (name, email, hashedpassword) => {
    const response = await db.query("INSERT INTO users (name, email, password_hash, is_verified) VALUES ($1, $2, $3, $4) RETURNING id, name, email", [name, email, hashedpassword, true]);
    return response.rows[0];
}