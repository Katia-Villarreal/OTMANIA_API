import { db_connect } from "../Utils/db.js";
import { getSalt, hashPassword } from "../Utils/hash.js";

export const getUsers = async (req, res) => {
    const sql = db_connect();
    const text = "SELECT * FROM Users";
    const result = await sql.query(text);
    res.json(result.rows);
}

export const getUser = async (req, res) => {
    const sql = db_connect();
    const text = "SELECT * FROM Users WHERE IDUser = $1";
    const values = [req.params.id];
    const result = await sql.query(text, values);
    console.log(result.rows[0]);
    res.json(result.rows[0]);
}

export const PostUser = async (req, res) => {
    const sql = db_connect();
    const {FirstName, LastName, Nickname, Email, Password, Country, IDUserType} = req.body;
    const salt = getSalt(parseInt(process.env.SALT_SIZE));
    const hashed = hashPassword(Password);
    const text = "INSERT INTO Users (FirstName, LastName, Nickname, Email, Password, Country, IDUserType) VALUES ($1, $2, $3, $4, $5, $6, $7)";
    const values = [FirstName, LastName, Nickname, Email, hashed, Country, IDUserType];
    const result = await sql.query(text, values);
    res.json(result)
}

export const PutUser = async (req, res) => {
    const sql = db_connect();
    const id = req.params.id;
    const {FirstName, LastName, Nickname, Email, Password, Country, IDUserType} = req.body;
    const text = "UPDATE Users SET FirstName = $1, LastName = $2, Nickname = $3, Email = $4, Password = $5, Country = $6, IDUserType = $7 WHERE IDUser = $8";
    const values = [FirstName, LastName, Nickname, Email, Password, Country, IDUserType, id];
    const result = await sql.query(text, values);
    res.json(result);
}