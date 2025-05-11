const oracledb = require('oracledb');
const dbConn = require('../config/dbConn');

const getAllEmployees = async (req, res) => {
    try {
        const conn = await oracledb.getConnection();
        const results = await conn.execute('SELECT * FROM SPARK_EMPLOYEES WHERE INACTIVE_IND != 1',[],{outFormat: oracledb.OUT_FORMAT_OBJECT});
        res.send(results.rows);
        if(conn){
            conn.close()
        }
    } catch (err) {
        res.send(err);
    }
}

const createEmployee = async (req, res) => {
    const {employees} = req.body;
    let err = false;
    const NoIndexEmps = employees.map((emp) => {if(!emp.PAY_RATE || !emp.EMP_NAME) {err = true} return ({...emp, ORG_CODE: !emp.ORG_CODE ? null : emp.ORG_CODE})})
     // let query = '';
    if (!employees || err)  return res.status(400).json({ 'message': 'missing employees' });
    try {
        const conn = await oracledb.getConnection();
        const results = await conn.executeMany('INSERT INTO SPARK_EMPLOYEES (EMP_NAME, USER_ID, PAY_RATE, ORG_CODE) VALUES (:EMP_NAME, :USEr_ID, :PAY_RATE, :ORG_CODE)',[...NoIndexEmps],
            {autoCommit: true,    
            bindDefs: {
            EMP_NAME: { type: oracledb.STRING, maxSize: 50},
            PAY_RATE: { type: oracledb.NUMBER},
            ORG_CODE: { type: oracledb.STRING, maxSize: 50}
        }});
        res.status(201).json({'message': `employees successfully created.`})
        if(conn){
            conn.close()
        }
    } catch (err) {
        res.send(err);
    }
}

const deleteEmployee = async (req, res) => {
    if (!req?.body?.empid) return res.status(400).json({ "message": 'empid required' });
    const timestamp = new Date();
    try {
        const conn = await oracledb.getConnection();
        const results = await conn.execute('UPDATE SPARK_EMPLOYEES SET INACTIVE_IND = 1, DELETE_DATE = :DELETE_DATE WHERE EMP_ID = :EMP_ID', [timestamp, req.body.empid],{autoCommit: true});
        res.json(results)
        if(conn){
            conn.close()
        }
    } catch (err) {
        res.send(err)
    }
}

module.exports = {getAllEmployees, deleteEmployee, createEmployee};