import { db_connect } from "../Utils/db.js";
import { hash } from "../Utils/hash.js";

export const login = async (req, res) => {
    const sql = db_connect();
    const { Email, Password } = req.body;
    const text = "SELECT * FROM Users WHERE Email = $1";
    const values = [Email];
    const result = await sql.query(text, values);
    const salt = result.rows[0].password.substring(0, process.env.SALT_SIZE);
    const hashed = hash(Password, salt);
    console.log(result.rows[0]);
}