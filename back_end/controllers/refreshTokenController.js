const jwt = require('jsonwebtoken');
const { poolPromise } = require('../db');
const sql = require('mssql');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    try {
        const pool = await poolPromise;

        const results = await pool.request()
        .input('REFRESH_TOKEN', sql.VarChar, refreshToken)
        .query(`
            SELECT aa.*, bb.REFRESH_TOKEN FROM SPARK_USERS aa 
            LEFT JOIN SPARK_USER_PASS bb on aa.user_id = bb.user_id
            WHERE bb.REFRESH_TOKEN = @REFRESH_TOKEN
            `)

        if (results.recordset.length < 1) return res.sendStatus(403);
        const roles = (await pool.request()
        .input('id', sql.Int, results.recordset[0].USER_ID)
        .query(
            `SELECT role_id FROM SPARK_USER_ROLES
             WHERE user_id = @id`)).recordset.flat()
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if (err || results.recordset[0].EMAIL !== decoded.email) return res.sendStatus(403);
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

    } catch (err) {
        console.log(err)
    }

}

module.exports = { handleRefreshToken }