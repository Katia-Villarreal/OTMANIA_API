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

    const user = result.rows[0];
    const isLogin = verifyPassword(Password, user.password);
    
    if(isLogin){
        res.status(200).json({isLogin:true, user:user});
    }else{
        res.status(404).json({isLogin:false, user:{}});
    }
}