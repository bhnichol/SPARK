const oracledb = require('oracledb');


const getAllOrgs = async (req, res) => {
    try {
        const conn = await oracledb.getConnection();
        const results = await conn.execute('SELECT ORG_ID, ORG_NAME, PARENT_ORG FROM SPARK_ORGS WHERE (INACTIVE_IND <> 1 OR INACTIVE_IND IS NULL)  AND USER_ID = :USER_ID ORDER BY ORG_ID ASC',[Number(req.user_id)],{outFormat: oracledb.OUT_FORMAT_OBJECT});
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
     if(!ORG_NAME)  { return res.status(400).json({ "message": 'org name required' })};
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
    if (!req?.body?.orgid) { return res.status(400).json({ "message": 'empid required' })};
    try {
        const conn = await oracledb.getConnection();
        await conn.execute('UPDATE SPARK_ORGS SET INACTIVE_IND = 1, INACTIVE_DATE = SYSDATE WHERE ORG_ID = :ORG_ID AND USER_ID = :USER_ID', {ORG_ID:Number(req.body.orgid), USER_ID:Number(req.user_id)});
        await conn.execute('UPDATE SPARK_EMPLOYEES SET ORG_ID = NULL WHERE ORG_ID = :ORG_ID AND USER_ID = :USER_ID', {ORG_ID:Number(req.body.orgid), USER_ID:Number(req.user_id)},{autoCommit: true});
        await conn.execute('UPDATE SPARK_ORGS SET PARENT_ORG = NULL WHERE PARENT_ORG = :ORG_ID AND USER_ID = :USER_ID', {ORG_ID:Number(req.body.orgid), USER_ID:Number(req.user_id)},{autoCommit: true});
        res.status(200).json({'message' : 'Org deleted successfully'});
        if(conn){
            conn.close()
        }
    } catch (err) {
        console.log(err);
        res.send(err)
    }
}

const removeEmp = async (req,res) => {
    const empid = req?.params?.id
    if(!empid) { return res.status(400).json({ "message": 'empid required' })};

    try {
        const conn = await oracledb.getConnection();
        await conn.execute("UPDATE SPARK_EMPLOYEES SET ORG_ID = NULL WHERE EMP_ID = :EMP_ID AND USER_ID = :USER_ID", {EMP_ID:Number(empid), USER_ID:Number(req.user_id)},{autoCommit: true})
        res.status(200).json({'message' : 'Emp removed from org'});
    }
    catch (err) {
        res.status(400).json({message: err});
    }

}

const editOrg = async (req,res) => {
    const orgid = req?.params?.id
    const {employees, ORG_NAME, PARENT_ORG} = req.body;
    if(!ORG_NAME) { return res.status(400).json({ "message": 'org name required' })};
    if(!orgid) { return res.status(400).json({ "message": 'orgid required' })};
    try {
        const conn = await oracledb.getConnection();
        await conn.execute(
            `UPDATE SPARK_EMPLOYEES SET ORG_ID = NULL WHERE ORG_ID = :ORG_ID AND USER_ID = :USER_ID`, {ORG_ID:Number(orgid), USER_ID:Number(req.user_id)})
        await conn.execute(
             `UPDATE SPARK_ORGS SET ORG_NAME = :ORG_NAME, PARENT_ORG = :PARENT_ORG WHERE ORG_ID = :ORG_ID AND USER_ID = :USER_ID`
            , {ORG_ID:Number(orgid), USER_ID:Number(req.user_id), PARENT_ORG: Number(PARENT_ORG) ?? null, ORG_NAME: ORG_NAME}, {autoCommit: true})

        if(employees?.length > 0){
        await conn.executeMany(
            `UPDATE SPARK_EMPLOYEES
             SET ORG_ID = :ORG_ID
             WHERE EMP_ID = :EMP_ID
             AND USER_ID = :USER_ID`, employees.map(emp => ({
                ORG_ID: orgid,
                EMP_ID: emp.EMP_ID,
                USER_ID: req.user_id
              })),
              { autoCommit: true }
          );
        }
        res.status(200).json({'message' : 'Org updated successfully'});
    }
    catch (err) {
        res.status(400).json({message: err});
    }

}

module.exports = {getAllOrgs, deleteOrg, createOrg, removeEmp, editOrg};