import { db_connect } from "../Utils/db.js";

const pool = db_connect();

// ================= DASHBOARD CARDS =================
export async function getDashboardCards(iduser, usertype, companyid) {

    const uid = iduser ? Number(iduser) : null;
    const type = usertype ? Number(usertype) : 3;
    const comp = companyid ? Number(companyid) : null;

    if (!uid) throw new Error("Invalid user ID");

    let userFilter = "";
    let params = [];

    if (type === 3 || !comp) {
        userFilter = "WHERE u.iduser = $1";
        params = [uid];
    } else {
        userFilter = "WHERE u.idcompany = $1";
        params = [comp];
    }

    const users = await pool.query(`
        SELECT COUNT(*) 
        FROM users u
        ${userFilter}
    `, params);

    const games = await pool.query(`
        SELECT COUNT(*) 
        FROM gamesessions gs
        JOIN users u ON gs.idplayer = u.iduser
        ${userFilter}
    `, params);

    const avgTime = await pool.query(`
        SELECT AVG(EXTRACT(EPOCH FROM (gs.endtime - gs.starttime))/60) AS avg_time
        FROM gamesessions gs
        JOIN users u ON gs.idplayer = u.iduser
        ${userFilter}
    `, params);

    const performance = await pool.query(`
        SELECT AVG(mh.performancegained) AS performance
        FROM minigamehistory mh
        JOIN gamesessions gs ON mh.idsession = gs.idsession
        JOIN users u ON gs.idplayer = u.iduser
        ${userFilter}
    `, params);

    return {
        users: Number(users.rows[0].count),
        games: Number(games.rows[0].count),
        avgTime: Math.round(avgTime.rows[0].avg_time || 0),
        performance: Math.round(performance.rows[0].performance || 0)
    };
}


// ================= BAR CHART =================
export async function getPerformanceByCompany(iduser, usertype, companyid) {

    const uid = iduser ? Number(iduser) : null;
    const type = usertype ? Number(usertype) : 3;
    const comp = companyid ? Number(companyid) : null;

    if (!uid) throw new Error("Invalid user ID");

    let result;

    if (type === 3 || !comp) {
        result = await pool.query(`
            SELECT u.nickname as company_name, 
                   AVG(mh.performancegained) as avg_score
            FROM minigamehistory mh
            JOIN gamesessions gs ON mh.idsession = gs.idsession
            JOIN users u ON gs.idplayer = u.iduser
            WHERE u.iduser = $1
            GROUP BY u.nickname
        `, [uid]);

    } else {
        result = await pool.query(`
            SELECT c.companyname as company_name, 
                   AVG(mh.performancegained) as avg_score
            FROM minigamehistory mh
            JOIN gamesessions gs ON mh.idsession = gs.idsession
            JOIN users u ON gs.idplayer = u.iduser
            JOIN clientcompanies c ON u.idcompany = c.idclient
            WHERE u.idcompany = $1
            GROUP BY c.companyname
        `, [comp]);
    }

    return {
        labels: result.rows.length ? result.rows.map(r => r.company_name) : ["No data"],
        values: result.rows.length ? result.rows.map(r => Number(r.avg_score)) : [0]
    };
}


// ================= PIE CHART =================
export async function getTaskOutcomes(iduser, usertype, companyid) {

    const uid = iduser ? Number(iduser) : null;
    const type = usertype ? Number(usertype) : 3;
    const comp = companyid ? Number(companyid) : null;

    if (!uid) throw new Error("Invalid user ID");

    let result;

    if (type === 3 || !comp) {
        // EXTERNAL → solo su data
        result = await pool.query(`
            SELECT ms.timestatus, COUNT(*) as total
            FROM minigamehistory mh
            JOIN gamesessions gs ON mh.idsession = gs.idsession
            JOIN users u ON gs.idplayer = u.iduser
            JOIN minigamestatus ms ON mh.idminigamestatus = ms.idminigamestatus
            WHERE u.iduser = $1
            GROUP BY ms.timestatus
        `, [uid]);

    } else {
        // EMPRESA
        result = await pool.query(`
            SELECT ms.timestatus, COUNT(*) as total
            FROM minigamehistory mh
            JOIN gamesessions gs ON mh.idsession = gs.idsession
            JOIN users u ON gs.idplayer = u.iduser
            JOIN minigamestatus ms ON mh.idminigamestatus = ms.idminigamestatus
            WHERE u.idcompany = $1
            GROUP BY ms.timestatus
        `, [comp]);
    }

    return {
        labels: result.rows.length ? result.rows.map(r => r.timestatus) : ["No data"],
        values: result.rows.length ? result.rows.map(r => Number(r.total)) : [0]
    };
}


export async function getAvgUserScores(iduser) {

    const uid = iduser ? Number(iduser) : null;
    if (!uid) throw new Error("Invalid user ID");

    const result = await pool.query(`
        SELECT u.nickname, AVG(mh.scoregained) as avg_score
        FROM minigamehistory mh
        JOIN gamesessions gs ON mh.idsession = gs.idsession
        JOIN users u ON gs.idplayer = u.iduser
        WHERE u.iduser = $1
        GROUP BY u.nickname
    `, [uid]);

    return result.rows;
}