const express = require("express");
const router = express.Router();
const employeesController = require("../../controllers/employeesController");
// const verfiyJWT = require("../../middleware/verfiyJWT")
const ROLES_LIST = require("../../config/roles");
const verifyRoles = require("../../middleware/verfiyRoles");
router
  .route("/")
  .get(employeesController.getAllEmployees)
  .post(verifyRoles(ROLES_LIST.Admin,ROLES_LIST.Editor),employeesController.createNewEmployees)
  .put(verifyRoles(ROLES_LIST.Admin,ROLES_LIST.Editor),employeesController.updateEmployee)
  .delete(verifyRoles(ROLES_LIST.Admin),employeesController.deleteE);

router.route("/:id").get(employeesController.getEmployee);

module.exports = router;
