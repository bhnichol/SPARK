const express = require('express');
const router = express.Router();
const projectController = require('../../controllers/projectController');
const rolesList = require('../../config/rolesList')
const verifyRoles = require('../../middleware/verifyRoles')

router.route('/')
      .get(verifyRoles(rolesList.User), projectController.getAllProjects)
      .post(verifyRoles(rolesList.User), projectController.createProject)
      .delete(verifyRoles(rolesList.User), projectController.deleteProject)
router.route('/get/:id')
      .get(verifyRoles(rolesList.User), projectController.getProject)


module.exports = router;