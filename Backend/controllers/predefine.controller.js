

const SlotTemplate = require("../models/predefine.model");

// POST /api/admin/slot-template
exports.createSlotTemplate = async (req, res) => {
  try {
    const { dates, slots } = req.body;

    // Validate input
    if (!Array.isArray(dates) || dates.length === 0) {
      return res.status(400).json({ error: "Dates are required." });
    }
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

    // Upsert each date
    for (const date of dates) {
      await SlotTemplate.updateOne(
        { date },
        { $set: { slots } },
        { upsert: true }
      );
    }

    res.status(200).json({ message: "Slot templates created/updated successfully." });
  } catch (error) {
    console.error("Error creating slot templates:", error);
    res.status(500).json({ error: "Internal server error while creating slot templates." });
  }
};




// GET /api/admin/slot-templates
exports.getAllSlotTemplates = async (req, res) => {
  try {
    const templates = await SlotTemplate.find().sort({ date: 1 });
    res.status(200).json(templates);
  } catch (error) {
    console.error("Error fetching all slot templates:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// DELETE /api/admin/slot-template/:date
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

