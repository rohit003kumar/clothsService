

const mongoose = require("mongoose");

const slotTemplateSchema = new mongoose.Schema({
  date: { type: String, required: true }, // "2025-07-01"
  slots: [{
    label: String,              // e.g., "Morning"
    range: String               // e.g., "07:00-09:00"
  }],
});

module.exports = mongoose.model("SlotTemplate", slotTemplateSchema);
