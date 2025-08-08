

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

/**
 * Create / Update / Append Slot Templates
 */
exports.createSlotTemplate = async (req, res) => {
  try {
    let { dates, slots, autoGenerate, append } = req.body;

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
      dates
    });
  } catch (error) {
    console.error("Error creating slot templates:", error);
    res.status(500).json({ error: "Internal server error while creating slot templates." });
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

