

// const express = require("express");
// const router = express.Router();
// const adminController = require("../controllers/predefine.controller");
// const { isAuth, isAdmin } = require("../middleware/isAuth");

// // Create or update slot templates
// router.post("/slots", isAuth, isAdmin, adminController.createSlotTemplate);

// // Get slots for a single date
// // router.get("/slot-template", isAuth, isAdmin, adminController.getSlotTemplateByDate);

// // Get all slot templates
// router.get("/slot-templates", isAuth, isAdmin, adminController.getAllSlotTemplates);

// // Delete slot template for a specific date
// router.delete("/slot-template/:date", isAuth, isAdmin, adminController.deleteSlotTemplateByDate);

// module.exports = router;














const express = require("express");
const router = express.Router();
const adminController = require("../controllers/predefine.controller");
const { isAuth, isAdmin } = require("../middleware/isAuth");

// 📌 Create / update / append slots (manual or auto-generate)
router.post("/slots", isAuth, isAdmin, adminController.createSlotTemplate);

// 📌 Get all slot templates
router.get("/slot-templates", isAuth, isAdmin, adminController.getAllSlotTemplates);

// 📌 Delete slot template for a specific date
router.delete("/slot-template/:date", isAuth, isAdmin, adminController.deleteSlotTemplateByDate);

// 📌 Close or open a full date
router.patch("/slot-template/:date/close", isAuth, isAdmin, adminController.toggleSlotStatus);

// 📌 Close or open a specific slot inside a date
router.patch("/slot-template/:date/slot/:slotLabel/close", isAuth, isAdmin, adminController.toggleSlotStatus);

// 🆕 Enhanced slot management routes
// Add a slot to all existing dates
router.post("/slots/add-to-all", isAuth, isAdmin, adminController.addSlotToAllDates);

// Remove a slot from all dates
router.delete("/slots/remove-from-all", isAuth, isAdmin, adminController.removeSlotFromAllDates);

// Get next 10 dates
router.get("/slots/next-ten-dates", isAuth, isAdmin, adminController.getNextTenDates);

// Auto-generate templates for next 10 days
router.post("/slots/auto-generate", isAuth, isAdmin, adminController.autoGenerateNextTenDays);

// 🆕 Global Slot Template Management
// Get global slot template
router.get("/slots/global-template", isAuth, isAdmin, adminController.getGlobalSlotTemplate);

// Update global slot template
router.put("/slots/global-template", isAuth, isAdmin, adminController.updateGlobalSlotTemplate);

// Auto-generate templates for next N days using global template
router.post("/slots/auto-generate-advanced", isAuth, isAdmin, adminController.autoGenerateNextNDays);

// 🆕 Manual cron job trigger
router.post("/slots/trigger-cron", isAuth, isAdmin, adminController.triggerCronJob);

// Update slot capacity across all dates
router.patch("/slots/update-capacity", isAuth, isAdmin, adminController.updateSlotCapacity);

module.exports = router;

