import { db_connect } from "../Utils/db.js";

export const getGameSessionUsers = async (req, res) => {
    const sql = db_connect();
    const text = "SELECT * FROM GameSessions";
    const result = await sql.query(text);
    res.json(result.rows);
}

export const getGameSessionUser = async (req, res) => {
    const sql = db_connect();
    const text = "SELECT * FROM GameSessions WHERE IDSession = $1";
    const values = [req.params.id];
    const result = await sql.query(text, values);
    console.log(result.rows[0]);
    res.json(result.rows[0]);
}

export const createGameSession = async (req, res) => {
    const sql = db_connect();
    const { starttime, endtime, idplayer, totalscore, gamedays} = req.body;
    const text = "SELECT insert_game_session($1, $2, $3, $4, $5) AS idsession";
    const values = [starttime, endtime, idplayer, totalscore, gamedays];
    const result = await sql.query(text, values);
    res.json(result.rows[0]);
}