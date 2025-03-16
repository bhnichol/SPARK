const { poolPromise } = require("../db");
const sql = require('mssql');

const handleLogout = async (req, res) => {
    // On client, also delete the accessToken

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //No content
    const refreshToken = cookies.jwt;

    // Is refreshToken in db?
    try {
        const pool = await poolPromise;
        const results = await pool.request()
        .input('REFRESH_TOKEN', sql.VarChar, refreshToken)
        .query(`
            SELECT aa.*, bb.REFRESH_TOKEN FROM SPARK_USERS aa 
            LEFT JOIN SPARK_USER_PASS bb on aa.user_id = bb.user_id
            WHERE bb.REFRESH_TOKEN = @REFRESH_TOKEN
            `)
        if (results.recordset.length < 1) {
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true})
            return res.sendStatus(204);
        }

        // Delete refreshToken in db
        await pool.request()
        .input('id', sql.Int, results.recordset[0].USER_ID)
        .query(
            `UPDATE SPARK_USER_PASS 
            SET REFRESH_TOKEN = ''
            WHERE user_id = @id`)
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true});
        res.sendStatus(204);
    } catch (err) {
        console.log(err)
    }
}

module.exports = { handleLogout }