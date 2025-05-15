const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EstimateSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    itemName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    photos: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['new', 'in_progress', 'completed', 'declined'],
      default: 'new',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    adminNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Estimate', EstimateSchema);
