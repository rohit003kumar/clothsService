const mongoose = require("mongoose");

const globalSlotSchema = new mongoose.Schema({
  label: { type: String, required: true },   // e.g., "Morning"
  range: { type: String, required: true },   // e.g., "07:00-09:00"
  maxBookings: { type: Number, default: 5, min: 1 }, // Maximum bookings allowed for this slot
  isClosed: { type: Boolean, default: false }, // Whether this slot is closed
  description: { type: String }, // Optional description
  color: { type: String, default: "#3B82F6" } // Color for UI display
});

const globalSlotTemplateSchema = new mongoose.Schema({
  name: { type: String, default: "Default Template" }, // Template name
  description: { type: String }, // Template description
  slots: [globalSlotSchema],
  isActive: { type: Boolean, default: true }, // Whether this template is active
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
globalSlotTemplateSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("GlobalSlotTemplate", globalSlotTemplateSchema);

