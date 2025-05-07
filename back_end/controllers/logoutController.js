const oracledb = require('oracledb');
const handleLogout = async (req, res) => {
    // On client, also delete the accessToken

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //No content
    const refreshToken = cookies.jwt;

    // Is refreshToken in db?
    try {
        const conn = await oracledb.getConnection();
        const results = await conn.execute(`
            SELECT * FROM SPARK_USERS aa 
            LEFT JOIN SPARK_USERS_PASS bb on aa.USER_ID = bb.USER_ID
            WHERE bb.REFRESH_TOKEN = :REFRESH_TOKEN
            `, [refreshToken], { outFormat: oracledb.OUT_FORMAT_OBJECT })
        if (results.rows.length < 1) {
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true})
            return res.sendStatus(204);
        }

        // Delete refreshToken in db
        await conn.execute(
            `UPDATE SPARK_USERS_PASS
            SET REFRESH_TOKEN = ''
            WHERE USER_ID = :USER_ID`, [results.rows[0]['USER_ID']], { autoCommit: true })
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true});
        res.sendStatus(204);
        if(conn) await conn.close();

    } catch (err) {
        console.log(err)
    }
}

module.exports = { handleLogout }