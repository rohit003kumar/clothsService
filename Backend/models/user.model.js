




const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true // recommended
  },
  password: {
    type: String,
    required: true
  },

  // Products posted by washerman (array)
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  }],

  // Bookings made by customer (array)
  bookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking"
  }],

  role: {
    type: String,
    enum: ['customer', 'washerman','admin'],
    required: true
  },

  contact: String,

  address: {
    street: String,
    city: String,
    state: String,
    zip: String
  },

  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [lng, lat]
      default: [0, 0]
    }
  },

  range: {
    type: Number,
    default: function () {
      return this.role === 'washerman' ? 500 : null;
    }
  },

    resetPasswordToken: String,
  resetPasswordExpire: Date,
  //  // ✅ Additional fields for laundryman dashboard
  // status: {
  //   type: String,
  //   enum: ['Active', 'Inactive'],
  //   default: 'Active'
  // },

  // completedOrders: {
  //   type: Number,
  //   default: 0
  // },
  // currentOrders: {
  //   type: Number,
  //   default: 0
  // },

  // earnings: {
  //   type: Number,
  //   default: 0
  // },
  // specialties: {
  //   type: [String],
  //   default: []
  // },



  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for geolocation-based querying
userSchema.index({ location: '2dsphere' });

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
