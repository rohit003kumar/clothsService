

// const SlotTemplate = require("../models/predefine.model");

// // POST /api/admin/slot-template
// exports.createSlotTemplate = async (req, res) => {
//   try {
//     const { dates, slots } = req.body;

//     // Validate input
//     if (!Array.isArray(dates) || dates.length === 0) {
//       return res.status(400).json({ error: "Dates are required." });
//     }
//     if (!Array.isArray(slots) || slots.length === 0) {
//       return res.status(400).json({ error: "At least one slot is required." });
//     }

//     for (const slot of slots) {
//       if (!slot.label || !slot.range) {
//         return res.status(400).json({ error: "Each slot must have a label and range." });
//       }

//       const rangeRegex = /^[0-9]{2}:[0-9]{2}-[0-9]{2}:[0-9]{2}$/;
//       if (!rangeRegex.test(slot.range)) {
//         return res.status(400).json({ error: `Invalid range format: ${slot.range}` });
//       }
//     }

//     // Upsert each date
//     for (const date of dates) {
//       await SlotTemplate.updateOne(
//         { date },
//         { $set: { slots } },
//         { upsert: true }
//       );
//     }

//     res.status(200).json({ message: "Slot templates created/updated successfully." });
//   } catch (error) {
//     console.error("Error creating slot templates:", error);
//     res.status(500).json({ error: "Internal server error while creating slot templates." });
//   }
// };




// // GET /api/admin/slot-templates
// exports.getAllSlotTemplates = async (req, res) => {
//   try {
//     const templates = await SlotTemplate.find().sort({ date: 1 });
//     res.status(200).json(templates);
//   } catch (error) {
//     console.error("Error fetching all slot templates:", error);
//     res.status(500).json({ error: "Internal server error." });
//   }
// };

// // DELETE /api/admin/slot-template/:date
// exports.deleteSlotTemplateByDate = async (req, res) => {
//   try {
//     const { date } = req.params;

//     const result = await SlotTemplate.deleteOne({ date });

//     if (result.deletedCount === 0) {
//       return res.status(404).json({ error: "No template found to delete for this date." });
//     }

//     res.status(200).json({ message: "Slot template deleted successfully." });
//   } catch (error) {
//     console.error("Error deleting slot template:", error);
//     res.status(500).json({ error: "Internal server error." });
//   }
// };










const SlotTemplate = require("../models/predefine.model");
const GlobalSlotTemplate = require("../models/globalSlotTemplate.model"); // Added GlobalSlotTemplate model

/**
 * Create / Update / Append Slot Templates with enhanced auto-generation
 */
exports.createSlotTemplate = async (req, res) => {
  try {
    let { dates, slots, autoGenerate, append, maxBookings = 5, saveAsGlobal = false } = req.body;

    // Validate slots
    if (!Array.isArray(slots) || slots.length === 0) {
      return res.status(400).json({ error: "At least one slot is required." });
    }

    for (const slot of slots) {
      if (!slot.label || !slot.range) {
        return res.status(400).json({ error: "Each slot must have a label and range." });
      }
      const rangeRegex = /^[0-9]{2}:[0-9]{2}-[0-9]{2}:[0-9]{2}$/;
      if (!rangeRegex.test(slot.range)) {
        return res.status(400).json({ error: `Invalid range format: ${slot.range}` });
      }
    }

    // If saveAsGlobal is true, save slots as global template
    if (saveAsGlobal) {
      await GlobalSlotTemplate.findOneAndUpdate(
        {},
        { slots: slots },
        { upsert: true, new: true }
      );
    }

    // Auto-generate if requested or only 1 date given
    if (autoGenerate || (!dates || dates.length === 1)) {
      const startDate = dates && dates.length === 1 ? new Date(dates[0]) : new Date();
      dates = [];
      for (let i = 0; i < 10; i++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        dates.push(d.toISOString().split("T")[0]);
      }
    }

    if (!Array.isArray(dates) || dates.length === 0) {
      return res.status(400).json({ error: "Dates are required." });
    }

    // Save for each date
    for (const date of dates) {
      if (append) {
        await SlotTemplate.updateOne(
          { date },
          { 
            $push: { slots: { $each: slots } }, 
            $setOnInsert: { isDateClosed: false } 
          },
          { upsert: true }
        );
      } else {
        await SlotTemplate.updateOne(
          { date },
          { $set: { slots, isDateClosed: false } },
          { upsert: true }
        );
      }
    }

    res.status(200).json({
      message: `Slot templates ${append ? "appended" : "created/updated"} for ${dates.length} date(s).`,
      dates,
      slots,
      savedAsGlobal: saveAsGlobal
    });
  } catch (error) {
    console.error("Error creating slot template:", error);
    res.status(500).json({ error: "Internal server error while creating slot template." });
  }
};

/**
 * Get all slot templates
 */
exports.getAllSlotTemplates = async (req, res) => {
  try {
    const templates = await SlotTemplate.find().sort({ date: 1 });
    res.status(200).json(templates);
  } catch (error) {
    console.error("Error fetching slot templates:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * Delete slot template for a date
 */
exports.deleteSlotTemplateByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const result = await SlotTemplate.deleteOne({ date });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "No template found to delete for this date." });
    }

    res.status(200).json({ message: "Slot template deleted successfully." });
  } catch (error) {
    console.error("Error deleting slot template:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * Close or open an entire date
 */
exports.toggleDateStatus = async (req, res) => {
  try {
    const { date } = req.params;
    const { isClosed } = req.body;

    const updated = await SlotTemplate.findOneAndUpdate(
      { date },
      { $set: { isDateClosed: isClosed } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Date not found." });
    }

    res.status(200).json({ message: `Date ${isClosed ? "closed" : "opened"} successfully.`, updated });
  } catch (error) {
    console.error("Error toggling date status:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * Close or open a specific slot in a date
 */
exports.toggleSlotStatus = async (req, res) => {
  try {
    const { date, slotLabel } = req.params;
    const { isClosed } = req.body;

    const template = await SlotTemplate.findOne({ date });
    if (!template) {
      return res.status(404).json({ error: "Date not found." });
    }

    const slotIndex = template.slots.findIndex(s => s.label === slotLabel);
    if (slotIndex === -1) {
      return res.status(404).json({ error: "Slot not found." });
    }

    template.slots[slotIndex].isClosed = isClosed;
    await template.save();

    res.status(200).json({ message: `Slot ${isClosed ? "closed" : "opened"} successfully.`, template });
  } catch (error) {
    console.error("Error toggling slot status:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * Add a new slot to all existing dates
 */
exports.addSlotToAllDates = async (req, res) => {
  try {
    const { label, range, maxBookings = 5 } = req.body;

    if (!label || !range) {
      return res.status(400).json({ error: "Label and range are required." });
    }

    const rangeRegex = /^[0-9]{2}:[0-9]{2}-[0-9]{2}:[0-9]{2}$/;
    if (!rangeRegex.test(range)) {
      return res.status(400).json({ error: `Invalid range format: ${range}` });
    }

    // Add slot to all existing templates
    const result = await SlotTemplate.updateMany(
      {},
      { 
        $push: { 
          slots: { 
            label, 
            range, 
            maxBookings,
            isClosed: false 
          } 
        } 
      }
    );

    res.status(200).json({
      message: `Slot "${label}" added to ${result.modifiedCount} date(s) successfully.`,
      slot: { label, range, maxBookings },
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error("Error adding slot to all dates:", error);
    res.status(500).json({ error: "Internal server error while adding slot to all dates." });
  }
};

/**
 * Remove a slot from all dates
 */
exports.removeSlotFromAllDates = async (req, res) => {
  try {
    const { label } = req.body;

    if (!label) {
      return res.status(400).json({ error: "Slot label is required." });
    }

    // Remove slot from all existing templates
    const result = await SlotTemplate.updateMany(
      {},
      { $pull: { slots: { label } } }
    );

    res.status(200).json({
      message: `Slot "${label}" removed from ${result.modifiedCount} date(s) successfully.`,
      removedSlot: label,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error("Error removing slot from all dates:", error);
    res.status(500).json({ error: "Internal server error while removing slot from all dates." });
  }
};

/**
 * Get next 10 dates starting from today
 */
exports.getNextTenDates = async (req, res) => {
  try {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 10; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push(d.toISOString().split("T")[0]);
    }

    res.status(200).json({ dates });
  } catch (error) {
    console.error("Error generating next 10 dates:", error);
    res.status(500).json({ error: "Internal server error while generating dates." });
  }
};

/**
 * Auto-generate templates for next N days using global template
 */
exports.autoGenerateNextNDays = async (req, res) => {
  try {
    const { days = 10, startDate } = req.body;

    // Get the global template
    const globalTemplate = await GlobalSlotTemplate.findOne();
    
    if (!globalTemplate || !globalTemplate.slots || globalTemplate.slots.length === 0) {
      return res.status(400).json({ 
        error: "No global slot template found. Please create a global template first." 
      });
    }

    const dates = [];
    const start = startDate ? new Date(startDate) : new Date();

    for (let i = 0; i < days; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      dates.push(d.toISOString().split("T")[0]);
    }

    // Create templates for each date with the global slots
    let createdCount = 0;
    let updatedCount = 0;

    for (const date of dates) {
      const existingTemplate = await SlotTemplate.findOne({ date });
      
      if (existingTemplate) {
        // Update existing template
        await SlotTemplate.updateOne(
          { date },
          { 
            $set: { 
              slots: globalTemplate.slots,
              isDateClosed: false 
            } 
          }
        );
        updatedCount++;
      } else {
        // Create new template
        await SlotTemplate.create({
          date,
          slots: globalTemplate.slots,
          isDateClosed: false
        });
        createdCount++;
      }
    }

    res.status(200).json({
      message: `Auto-generated templates for next ${days} days using global template.`,
      dates,
      slots: globalTemplate.slots,
      created: createdCount,
      updated: updatedCount,
      total: dates.length
    });
  } catch (error) {
    console.error("Error auto-generating templates:", error);
    res.status(500).json({ error: "Internal server error while auto-generating templates." });
  }
};

/**
 * Auto-generate templates for next 10 days with existing slots (legacy function)
 */
exports.autoGenerateNextTenDays = async (req, res) => {
  try {
    // Get the most recent template to copy slots from
    const latestTemplate = await SlotTemplate.findOne().sort({ date: -1 });
    
    if (!latestTemplate || !latestTemplate.slots || latestTemplate.slots.length === 0) {
      return res.status(400).json({ 
        error: "No existing slot templates found. Please create at least one template first." 
      });
    }

    const dates = [];
    const today = new Date();

    for (let i = 0; i < 10; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push(d.toISOString().split("T")[0]);
    }

    // Create templates for each date with the same slots
    for (const date of dates) {
      await SlotTemplate.updateOne(
        { date },
        { 
          $set: { 
            slots: latestTemplate.slots,
            isDateClosed: false 
          } 
        },
        { upsert: true }
      );
    }

    res.status(200).json({
      message: `Auto-generated templates for next 10 days with ${latestTemplate.slots.length} slots.`,
      dates,
      slots: latestTemplate.slots
    });
  } catch (error) {
    console.error("Error auto-generating templates:", error);
    res.status(500).json({ error: "Internal server error while auto-generating templates." });
  }
};

/**
 * Update slot capacity for all dates
 */
exports.updateSlotCapacity = async (req, res) => {
  try {
    const { label, maxBookings } = req.body;

    if (!label || !maxBookings || maxBookings < 1) {
      return res.status(400).json({ error: "Label and valid maxBookings are required." });
    }

    // Update maxBookings for the specified slot across all dates
    const result = await SlotTemplate.updateMany(
      { "slots.label": label },
      { $set: { "slots.$.maxBookings": maxBookings } }
    );

    res.status(200).json({
      message: `Slot "${label}" capacity updated to ${maxBookings} across ${result.modifiedCount} date(s).`,
      slot: { label, maxBookings },
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error("Error updating slot capacity:", error);
    res.status(500).json({ error: "Internal server error while updating slot capacity." });
  }
};

/**
 * Get global slot template (master template)
 */
exports.getGlobalSlotTemplate = async (req, res) => {
  try {
    const globalTemplate = await GlobalSlotTemplate.findOne();
    
    if (!globalTemplate) {
      return res.status(200).json({ 
        message: "No global template found. Create one first.",
        slots: [] 
      });
    }

    res.status(200).json({
      message: "Global slot template retrieved successfully",
      slots: globalTemplate.slots
    });
  } catch (error) {
    console.error("Error fetching global slot template:", error);
    res.status(500).json({ error: "Internal server error while fetching global template." });
  }
};

/**
 * Update global slot template
 */
exports.updateGlobalSlotTemplate = async (req, res) => {
  try {
    const { slots } = req.body;

    if (!Array.isArray(slots) || slots.length === 0) {
      return res.status(400).json({ error: "At least one slot is required." });
    }

    // Validate slots
    for (const slot of slots) {
      if (!slot.label || !slot.range) {
        return res.status(400).json({ error: "Each slot must have a label and range." });
      }
      const rangeRegex = /^[0-9]{2}:[0-9]{2}-[0-9]{2}:[0-9]{2}$/;
      if (!rangeRegex.test(slot.range)) {
        return res.status(400).json({ error: `Invalid range format: ${slot.range}` });
      }
    }

    const globalTemplate = await GlobalSlotTemplate.findOneAndUpdate(
      {},
      { slots: slots },
      { upsert: true, new: true }
    );

    res.status(200).json({
      message: "Global slot template updated successfully",
      slots: globalTemplate.slots
    });
  } catch (error) {
    console.error("Error updating global slot template:", error);
    res.status(500).json({ error: "Internal server error while updating global template." });
  }
};

/**
 * Manually trigger cron job for slot generation
 */
exports.triggerCronJob = async (req, res) => {
  try {
    const cronService = require('../services/cronService');
    const result = await cronService.generateSlotsManually(10);
    
    res.status(200).json({
      message: "Cron job triggered successfully",
      ...result
    });
  } catch (error) {
    console.error("Error triggering cron job:", error);
    res.status(500).json({ 
      error: "Internal server error while triggering cron job.",
      details: error.message 
    });
  }
};

