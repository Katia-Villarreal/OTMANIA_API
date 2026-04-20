import { db_connect } from "../Utils/db.js";
import { verifyPassword } from "../Utils/hash.js";

export const login = async (req, res) => {
    const sql = db_connect();
    const { Email, Password } = req.body;
    const text = "SELECT * FROM Users WHERE Email = $1";
    const values = [Email];
    const result = await sql.query(text, values);

    if (result.rows.length === 0) {
        return res.status(401).json({
            isLogin: false
        });
    }

    const salt = result.rows[0].password.substring(0, process.env.SALT_SIZE);
    const hashed = verifyPassword(Password, result.rows[0].password);
    console.log(result.rows[0]);

    const salted_hashed = salt + hashed;
    if(result.rows[0].password == salted_hashed){
        res.status(200).json({isLogin:true, user:result.rows[0]});
    }else{
        res.status(404).json({isLogin:false, user:{}});
    }
}