const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sql = require('mssql');
const { poolPromise } = require('../db');

const handleLogin = async (req, res) => {
    const { email, pwd } = req.body;
    if (!email || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });
    try {
        const pool = await poolPromise;
        const results = await pool.request()
        .input('email', sql.VarChar, email)
        .query(
            `SELECT aa.email, bb.pass_hash, aa.user_id FROM SPARK_USERS aa
             LEFT JOIN SPARK_USER_PASS bb ON aa.user_id = bb.user_id 
             WHERE aa.email = @email`)

        if (results.recordset.length < 1) {
            console.log("User does not exist.")
            return res.sendStatus(401)
        }

        const roles = (await pool.request()
        .input('id', sql.Int, results.recordset[0].user_id)
        .query(
            `SELECT role_id FROM SPARK_USER_ROLES
             WHERE user_id = @id`)).recordset.flat()

        const match = await bcrypt.compare(pwd, results.recordset[0].pass_hash);
        if (match) {

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "email": results.recordset[0].EMAIL,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            );
            const refreshToken = jwt.sign(
                { "email": results.recordset[0].email },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' }
            );
            await pool.request()
            .input('token', sql.VarChar, refreshToken)
            .input('id', sql.Int, results.recordset[0].user_id)
            .query(
                `UPDATE SPARK_USER_PASS
                SET REFRESH_TOKEN = @token
                WHERE user_id = @id`)
            console.log(`Email, ${email} successfully logged in!`)
            // Creates Secure Cookie with refresh token
            res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
            // Send authorization roles and access token to user
            res.json({accessToken });

        }
        else {
            console.log("Incorrect Password")
            res.sendStatus(401)
        }
    } catch (err) {
        console.log(err.message)
        res.sendStatus(401)
    }
}

module.exports = { handleLogin };

// if (match) {
//     const roles = Object.values(foundUser.roles).filter(Boolean);
//     // create JWTs
//     const accessToken = jwt.sign(
//         {
//             "UserInfo": {
//                 "username": foundUser.username,
//                 "roles": roles
//             }
//         },
//         process.env.ACCESS_TOKEN_SECRET,
//         { expiresIn: '10s' }
//     );
//     const refreshToken = jwt.sign(
//         { "username": foundUser.username },
//         process.env.REFRESH_TOKEN_SECRET,
//         { expiresIn: '1d' }
//     );
//     // Saving refreshToken with current user
//     foundUser.refreshToken = refreshToken;
//     const result = await foundUser.save();
//     console.log(result);
//     console.log(roles);

//     // Creates Secure Cookie with refresh token
//     res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

//     // Send authorization roles and access token to user
//     res.json({ roles, accessToken });

// } else {
//     res.sendStatus(401);
// }