const oracledb = require('oracledb');


const getAllProjects = async (req, res) => {
    try {
        const conn = await oracledb.getConnection();
        const results = await conn.execute('SELECT PROJECT_ID, TITLE FROM SPARK_PROJECTS WHERE (INACTIVE_IND <> 1 OR INACTIVE_IND IS NULL)  AND USER_ID = :USER_ID ORDER BY ORG_ID ASC', [Number(req.user_id)], { outFormat: oracledb.OUT_FORMAT_OBJECT });
        res.send(results.rows);
        if (conn) {
            conn.close()
        }
    } catch (err) {
        res.send(err);
    }
}

const createProject = async (req, res) => {
    const { pdt, wbs, title, notes, group, subtype, start_date } = req.body;
    if (!title || !start_date) { return res.status(400).json({ "message": 'project title required' }) };
    try {
        const conn = await oracledb.getConnection();
        const rs = await conn.execute('INSERT INTO SPARK_PROJECTS (TITLE, USER_ID, NOTES, GROUP_ID, SUBTYPE_ID, START_DATE) VALUES (:TITLE, :USER_ID, :NOTES, :GROUP_ID, :SUBTYPE_ID, :START_DATE) RETURNING PROJECT_ID INTO :PROJECT_ID',
            {
                TITLE: title,
                USER_ID: req.user_id,
                NOTES: notes,
                GROUP_ID: group,
                SUBTYPE_ID: subtype,
                START_DATE: start_date,
                PROJECT_ID: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
            },
            { autoCommit: true }
        )
        const newProjectId = rs.outBinds.PROJECT_ID[0];
        if (pdt) {
            await conn.executeMany(
                `INSERT INTO SPARK_PDT
             (EMP_ID, POSITION_ID, PROJECT_ID, USER_ID)
             VALUES (:EMP_ID, :POSITION_ID, :PROJECT_ID, :USER_ID)`, pdt.map(emp => ({
                    EMP_ID: emp.EMP_ID,
                    POSITION_ID: emp.POSITION_ID,
                    PROJECT_ID: newProjectId,
                    USER_ID: req.user_id
                })),
                { autoCommit: true }
            );
        }
        if (wbs) {
            let idMap = {};
            for (const row of wbs) {
                const parentDbId = row.PARENT_WBS ? idMap[row.PARENT_WBS] : null;

                const result = await conn.execute(
                    `INSERT INTO WBS_TABLE (TITLE, START_DATE, END_DATE, PARENT_WBS)
                    VALUES (:title, :startDate, :endDate, :parentWbsId)
                    RETURNING WBS_ID INTO :outId`,
                    {
                        title: row.TITLE,
                        startDate: row.START_DATE,
                        endDate: row.END_DATE,
                        parentWbsId: parentDbId,
                        outId: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
                    }
                );
                
                // Map temporary local ID to the new DB ID
                idMap[row.ID] = result.outBinds.outId[0];
            }
            await conn.commit();
        }
            res.status(201).json({ 'message': `project successfully created.` })
            if (conn) {
                conn.close()
            }
        } catch (err) {
            console.log(err);
            res.status(400).json({ message: err });
        }
    }

const deleteProject = async (req, res) => {
        if (!req?.params?.id) { return res.status(400).json({ "message": 'project id required' }) };
        const PROJECT_ID = req?.params?.id
        try {
            const conn = await oracledb.getConnection();
            await conn.execute('UPDATE SPARK_PROJECTS SET INACTIVE_IND = 1, INACTIVE_DATE = SYSDATE WHERE PROJECT_ID = :PROJECT_ID AND USER_ID = :USER_ID AND INACTIVE_IND <> 1', { PROJECT_ID: Number(PROJECT_ID), USER_ID: Number(req.user_id) });
            await conn.execute('UPDATE SPARK_WBS SET INACTIVE_IND = 1, INACTIVE_DATE = SYSDATE WHERE PROJECT_ID = :PROJECT_ID AND USER_ID = :USER_ID AND INACTIVE_IND <> 1', { PROJECT_ID: Number(PROJECT_ID), USER_ID: Number(req.user_id) }, { autoCommit: true });
            await conn.execute('UPDATE SPARK_PDT SET INACTIVE_IND = 1, INACTIVE_DATE = SYSDATE WHERE PROJECT_ID = :PROJECT_ID AND USER_ID = :USER_ID AND INACTIVE_IND <> 1', { PROJECT_ID: Number(PROJECT_ID), USER_ID: Number(req.user_id) }, { autoCommit: true });
            res.status(200).json({ 'message': 'Project deleted successfully' });
            if (conn) {
                conn.close()
            }
        } catch (err) {
            console.log(err);
            res.send(err)
        }
    }


    module.exports = { getAllProjects, deleteProject, createProject };