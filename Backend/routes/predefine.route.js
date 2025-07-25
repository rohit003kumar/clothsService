


const express = require("express");
const router = express.Router();
const adminController = require("../controllers/predefine.controller");
const { isAuth, isAdmin } = require("../middleware/isAuth");

// Create or update slot templates
router.post("/slots", isAuth, isAdmin, adminController.createSlotTemplate);

// Get slots for a single date
// router.get("/slot-template", isAuth, isAdmin, adminController.getSlotTemplateByDate);

// Get all slot templates
router.get("/slot-templates", isAuth, isAdmin, adminController.getAllSlotTemplates);

// Delete slot template for a specific date
router.delete("/slot-template/:date", isAuth, isAdmin, adminController.deleteSlotTemplateByDate);

module.exports = router;

