import { db_connect } from "../Utils/db.js";

export const getMinigameHistoryUsers = async (req, res) => {
    const sql = db_connect();
    const text = "SELECT * FROM MinigameHistory";
    const result = await sql.query(text);
    res.json(result.rows);
}

export const getMinigameHistoryUser = async (req, res) => {
    const sql = db_connect();
    const text = "SELECT * FROM MinigameHistory WHERE IDMinigameHistory = $1";
    const values = [req.params.id];
    const result = await sql.query(text, values);
    console.log(result.rows[0]);
    res.json(result.rows[0]);
}