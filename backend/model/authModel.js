const db = require("../config/postgres");

exports.findUserByEmail  = async (email) => {
    const response = await db.query("SELECT id, email, password_hash FROM users WHERE email = $1", [email]);
    return response.rows[0]
}

exports.createUser = async (email, hashedpassword) => {
    await db.query("INSERT INTO users (email, password_hash, is_verified) VALUES ($1, $2, $3)", [email, hashedpassword, true]);
}