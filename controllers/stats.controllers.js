import { db_connect } from "../Utils/db.js";

const pool = db_connect(); // 👈 IMPORTANTE


export async function getDashboardCards() {
    const users = await pool.query("SELECT COUNT(*) FROM Users");
    const games = await pool.query("SELECT COUNT(*) FROM GameSessions");

    const avgTime = await pool.query(`
        SELECT AVG(EXTRACT(EPOCH FROM (EndTime - StartTime))/60) AS avg_time
        FROM GameSessions
    `);

    const performance = await pool.query(`
        SELECT AVG(PerformanceGained) AS performance
        FROM MinigameHistory
    `);

    return {
        users: users.rows[0].count,
        games: games.rows[0].count,
        avgTime: Math.round(avgTime.rows[0].avg_time || 0),
        performance: Math.round(performance.rows[0].performance || 0)
    };
}


export async function getPerformanceByCompany() {
    const result = await pool.query(`
        SELECT * FROM get_avg_score_per_company()
    `);

    return {
        labels: result.rows.map(r => r.company_name),
        values: result.rows.map(r => Number(r.avg_score))
    };
}


export async function getTaskOutcomes() {
    const result = await pool.query(`
        SELECT * FROM count_users_by_status()
    `);

    return {
        labels: result.rows.map(r => r.status),
        values: result.rows.map(r => Number(r.total_users))
    };
}


export async function getAvgUserScores() {
    const result = await pool.query(`
        SELECT * FROM get_user_average_scores()
    `);

    return result.rows;
}