const oracledb = require('oracledb');


const getAllOrgs = async (req, res) => {
    try {
        const conn = await oracledb.getConnection();
        const results = await conn.execute('SELECT ORG_ID, ORG_NAME FROM SPARK_ORGS WHERE (INACTIVE_IND <> 1 OR INACTIVE_IND IS NULL)  AND USER_ID = :USER_ID ORDER BY ORG_ID ASC',[Number(req.user_id)],{outFormat: oracledb.OUT_FORMAT_OBJECT});
        res.send(results.rows);
        if(conn){
            conn.close()
        }
    } catch (err) {
        res.send(err);
    }
}

const createOrg = async (req, res) => {
    const {employees, ORG_NAME, PARENT_ORG} = req.body;
     // let query = '';
    try {
        const conn = await oracledb.getConnection();
        const orgResults = await  conn.execute('INSERT INTO SPARK_ORGS (ORG_NAME, USER_ID, PARENT_ORG) VALUES (:ORG_NAME, :USER_ID, :PARENT_ORG) RETURNING ORG_ID INTO :ORG_ID',
            {
              ORG_NAME: ORG_NAME,          // your variable
              USER_ID: req.user_id,
              PARENT_ORG: PARENT_ORG,
              ORG_ID: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
            },
            { autoCommit: true }
        )
        const newOrgId = orgResults.outBinds.ORG_ID[0];
        if(employees){
        await conn.executeMany(
            `UPDATE SPARK_EMPLOYEES
             SET ORG_ID = :ORG_ID
             WHERE EMP_ID = :EMP_ID
             AND USER_ID = :USER_ID`, employees.map(emp => ({
                ORG_ID: newOrgId,
                EMP_ID: emp.EMP_ID,
                USER_ID: req.user_id
              })),
              { autoCommit: true }
          );
        }
        res.status(201).json({'message': `organization successfully created.`})
        if(conn){
            conn.close()
        }
    } catch (err) {
        res.status(400).json({message: err});
    }
}

const deleteOrg = async (req, res) => {
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

module.exports = {getAllOrgs, deleteOrg, createOrg};