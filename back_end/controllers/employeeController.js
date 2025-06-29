const oracledb = require('oracledb');
const dbConn = require('../config/dbConn');

const getAllEmployees = async (req, res) => {
    try {
        const conn = await oracledb.getConnection();
        const results = await conn.execute('SELECT aa.EMP_ID, aa.EMP_NAME, aa.PAY_RATE, aa.ORG_ID, bb.ORG_NAME FROM SPARK_EMPLOYEES aa LEFT JOIN SPARK_ORGS bb ON aa.ORG_ID = bb.ORG_ID WHERE (aa.INACTIVE_IND <> 1 OR aa.INACTIVE_IND IS NULL)  AND aa.USER_ID = :USER_ID ORDER BY aa.EMP_ID ASC',[Number(req.user_id)],{outFormat: oracledb.OUT_FORMAT_OBJECT});
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
    const NoIndexEmps = employees.map((emp) => {if(!emp.PAY_RATE || !emp.EMP_NAME) {err = true} return ({...emp, ORG_ID: !emp.ORG_ID ? null : emp.ORG_ID, USER_ID: req.user_id, PAY_RATE: Number(emp.PAY_RATE)})})
     // let query = '';
    if (!employees || err)  return res.status(400).json({ 'message': 'missing employees' });
    try {
        const conn = await oracledb.getConnection();
        const results = await conn.executeMany('INSERT INTO SPARK_EMPLOYEES (EMP_NAME, USER_ID, PAY_RATE, ORG_ID) VALUES (:EMP_NAME, :USER_ID, :PAY_RATE, :ORG_ID)',[...NoIndexEmps],
            {autoCommit: true,    
            bindDefs: {
            EMP_NAME: { type: oracledb.STRING, maxSize: 50},
            USER_ID: {type: oracledb.NUMBER},
            PAY_RATE: { type: oracledb.NUMBER},
            ORG_ID: { type: oracledb.NUMBER}
        }});
        res.status(201).json({'message': `employees successfully created.`})
        if(conn){
            conn.close()
        }
    } catch (err) {
        console.error(err);
        res.status(400).json({message: err});
    }
}

const deleteEmployee = async (req, res) => {
    if (!req?.body?.empid) { return res.status(400).json({ "message": 'empid required' })};
    try {
        const conn = await oracledb.getConnection();
        const results = await conn.execute('UPDATE SPARK_EMPLOYEES SET INACTIVE_IND = 1, INACTIVE_DATE = SYSDATE WHERE EMP_ID = :EMP_ID AND USER_ID = :USER_ID', {EMP_ID:Number(req.body.empid), USER_ID:Number(req.user_id)},{autoCommit: true});
        res.json(results)
        if(conn){
            conn.close()
        }
    } catch (err) {
        console.log(err);
        res.send(err)
    }
}

module.exports = {getAllEmployees, deleteEmployee, createEmployee};