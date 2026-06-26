const db = require("../config/postgres");

exports.changeKey = async (envId)=>{
    const response = await db.query("UPDATE environments SET sdk_key = gen_random_uuid() WHERE id = $1 RETURNING sdk_key", [envId]);
    console.log(response.rows);
    return response.rows[0];
}