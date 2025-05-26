const express = require('express');
const router = express.Router();
const orgController = require('../../controllers/orgController');
const rolesList = require('../../config/rolesList')
const verifyRoles = require('../../middleware/verifyRoles')

router.route('/')
      .get(verifyRoles(rolesList.User), orgController.getAllOrgs)
      .post(verifyRoles(rolesList.User), orgController.createOrg)
      .delete(verifyRoles(rolesList.User), orgController.deleteOrg)
router.route('/remove/:id')
      .post(verifyRoles(rolesList.User), orgController.removeEmp)
router.route('/update/:id')
      .post(verifyRoles(rolesList.User), orgController.editOrg)

module.exports = router;