



const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
  label: { type: String, required: true },   // e.g., "Morning"
  range: { type: String, required: true },   // e.g., "07:00-09:00"
  isClosed: { type: Boolean, default: false } // Whether this slot is closed
});

const slotTemplateSchema = new mongoose.Schema({
  date: { type: String, required: true },       // "2025-07-01"
  isDateClosed: { type: Boolean, default: false }, // Whether the whole date is closed
  slots: [slotSchema]
});

module.exports = mongoose.model("SlotTemplate", slotTemplateSchema);





// const mongoose = require("mongoose");

// const slotTemplateSchema = new mongoose.Schema({
//   date: { type: String, required: true }, // "2025-07-01"
//   slots: [{
//     label: String,              // e.g., "Morning"
//     range: String               // e.g., "07:00-09:00"
//   }],
// });

// module.exports = mongoose.model("SlotTemplate", slotTemplateSchema);



