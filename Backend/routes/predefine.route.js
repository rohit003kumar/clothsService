





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
// router.patch("/slot-template/:date/close", isAuth, isAdmin, adminController.toggleDateClosed);

// 📌 Close or open a specific slot inside a date
router.patch("/slot-template/:date/slot/:slotLabel/close", isAuth, isAdmin, adminController.toggleSlotClosed);

module.exports = router;





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
