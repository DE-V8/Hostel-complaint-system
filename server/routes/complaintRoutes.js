const express = require('express');
const router  = express.Router();
const {
  submitComplaint, getMyComplaints,
  getAllComplaints, updateComplaintStatus, deleteComplaint,
  getStats, getAllStudents,
} = require('../controllers/complaintController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Student routes
router.post('/',       protect, submitComplaint);
router.get('/mine',    protect, getMyComplaints);

// Admin routes
router.get('/all',     protect, adminOnly, getAllComplaints);
router.get('/stats',   protect, adminOnly, getStats);
router.get('/students',protect, adminOnly, getAllStudents);
router.patch('/:id/status', protect, adminOnly, updateComplaintStatus);
router.delete('/:id',  protect, adminOnly, deleteComplaint);

module.exports = router;
