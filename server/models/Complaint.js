const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    email:       { type: String, required: true },
    firstName:   { type: String, required: true },
    lastName:    { type: String, required: true },
    roomNumber:  { type: String, required: true },
    type:        {
      type: String,
      required: true,
      enum: ['Plumbing Issue', 'Ragging Issue', 'Cleaning Problem', 'Electricity Issue', 'Other'],
    },
    complaint:   { type: String, required: true },
    status:      { type: String, enum: ['Pending', 'In Progress', 'Resolved'], default: 'Pending' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Complaint', complaintSchema);
