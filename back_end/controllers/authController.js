const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const oracledb = require('oracledb');

const handleLogin = async (req, res) => {
    const { email, pwd } = req.body;
    if (!email || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });
    try {
        const conn = await oracledb.getConnection();
        const results = await conn.execute(
            `SELECT aa.email, bb.pass_hash, aa.USER_ID FROM SPARK_USERS aa
             LEFT JOIN SPARK_USERS_PASS bb ON aa.USER_ID = bb.USER_ID
             WHERE aa.email = :email`, [email], { outFormat: oracledb.OUT_FORMAT_OBJECT })
        if (results.rows.length < 1) {
            console.log("User does not exist.")
            return res.sendStatus(401)
        }
        const roles = (await conn.execute(
            `SELECT role_id FROM SPARK_USERS_ROLES
             WHERE USER_ID = :USER_ID`, [results.rows[0]['USER_ID']])).rows.flat()
        const match = await bcrypt.compare(pwd, results.rows[0]['PASS_HASH']);
        if (match) {

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "email": results.rows[0]['EMAIL'],
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            );
            const refreshToken = jwt.sign(
                { "email": results.rows[0]['EMAIL'] },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' }
            );
            await conn.execute(
                `UPDATE SPARK_USERS_PASS 
                SET REFRESH_TOKEN = :token
                WHERE USER_ID = :USER_ID`, [refreshToken, results.rows[0]['USER_ID']], { autoCommit: true })
            console.log(`Email, ${email} successfully logged in!`)
            // Creates Secure Cookie with refresh token
            res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
            // Send authorization roles and access token to user
            res.json({accessToken });
            if(conn) conn.close();
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