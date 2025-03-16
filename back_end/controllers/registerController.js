const bcrypt = require('bcrypt');
const roles_list = require('../config/rolesList');
const { poolPromise } = require('../db');
const sql = require('mssql');

const handleNewUser = async (req, res) => {
    const { email, pwd } = req.body;
    if (!email || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

    try {
        const pool = await poolPromise;
        const results = await pool.request()
        .input('email', sql.VarChar, email)
        .query(`SELECT COUNT(*) AS COUNT FROM SPARK_USERS WHERE email = @email`)
        
        // check for duplicate usernames in the db
        //if (duplicate) return res.sendStatus(409); //Conflict 
        if(results.recordset[0].COUNT > 0){
           return res.sendStatus(409)
        }
        //encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);
        //store the new user
        await pool.request()
        .input('email', sql.VarChar, email)
        .query('INSERT INTO SPARK_USERS (email) VALUES (@email)');


        const newId = await pool.request()
        .input('email', sql.VarChar, email)
        .query(`SELECT USER_ID FROM SPARK_USERS WHERE email = @email AND INACTIVE_IND IS NULL OR INACTIVE_IND != 1`)

        if(newId.recordset.length<1){
            throw {message: "Error with registration, user not created."};
        }

        await pool.request()
        .input('newId', sql.Int, newId.recordset[0].USER_ID)
        .input('hashedPwd', sql.VarChar, hashedPwd)
        .query(`INSERT INTO spark_user_pass (user_id, pass_hash) VALUES (@newid, @hashedPwd)`)

        await pool.request()
        .input('newId', sql.Int, newId.recordset[0].USER_ID)
        .input('role', sql.Int, roles_list.User)
        .query(`INSERT INTO spark_user_roles (user_id, role_id) VALUES (@newId, @role)`)

        res.status(201).json({'message': `${email} account successfully created.`})

    } catch (err) {
        res.status(500).json({ 'message': err.message });
        console.log(err.message);
    }
}

module.exports = { handleNewUser };