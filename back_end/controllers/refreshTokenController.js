const jwt = require('jsonwebtoken');
const dbConn = require('../config/dbConn');
const oracledb = require('oracledb');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    try {
        const conn = await oracledb.getConnection();
        const results = await conn.execute(`
            SELECT * FROM SPARK_USERS aa 
            LEFT JOIN SPARK_USERS_PASS bb on aa.USER_ID = bb.USER_ID
            WHERE bb.REFRESH_TOKEN = :REFRESH_TOKEN
            `, [refreshToken], {outFormat: oracledb.OUT_FORMAT_OBJECT})
        if (results.rows.length < 1) return res.sendStatus(403);
        const roles = (await conn.execute(
            `SELECT role_id FROM SPARK_USERS_ROLES
             WHERE USER_ID = :USER_ID`, [results.rows[0]['USER_ID']])).rows.flat()
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if (err || results.rows[0]['EMAIL'] !== decoded.email) return res.sendStatus(403);
                const accessToken = jwt.sign(
                    {
                        "UserInfo": {
                            "email": decoded.email,
                            "roles": roles
                        }
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '15m' }
                );
                res.json({ accessToken })
            }
        );
        if(conn)  await conn.close();
    } catch (err) {
        console.log(err)
    }

}

module.exports = { handleRefreshToken }