const Complaint = require('../models/Complaint');
const User      = require('../models/User');

// ─── SUBMIT COMPLAINT (Student) ───────────────────────────────────────────────
exports.submitComplaint = async (req, res) => {
  try {
    const { roomNumber, type, complaint } = req.body;
    if (!roomNumber || !type || !complaint)
      return res.status(400).json({ message: 'All fields are required.' });

    const newComplaint = await Complaint.create({
      userId:    req.user._id,
      email:     req.user.email,
      firstName: req.user.firstName,
      lastName:  req.user.lastName,
      roomNumber,
      type,
      complaint,
    });

    res.status(201).json({ message: 'Complaint submitted successfully!', complaint: newComplaint });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error submitting complaint.' });
  }
};

// ─── GET MY COMPLAINTS (Student) ──────────────────────────────────────────────
exports.getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(complaints);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching your complaints.' });
  }
};

// ─── GET ALL COMPLAINTS (Admin) ───────────────────────────────────────────────
exports.getAllComplaints = async (req, res) => {
  try {
    const { status, type, search } = req.query;
    const filter = {};
    if (status && status !== 'All') filter.status = status;
    if (type   && type   !== 'All') filter.type   = type;
    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [
        { firstName: regex }, { lastName: regex },
        { email: regex }, { roomNumber: regex },
        { complaint: regex },
      ];
    }

    const complaints = await Complaint.find(filter).sort({ createdAt: -1 });
    res.status(200).json(complaints);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching complaints.' });
  }
};

// ─── UPDATE COMPLAINT STATUS (Admin) ─────────────────────────────────────────
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Pending', 'In Progress', 'Resolved'].includes(status))
      return res.status(400).json({ message: 'Invalid status value.' });

    const updated = await Complaint.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Complaint not found.' });

    res.status(200).json({ message: 'Status updated.', complaint: updated });
  } catch (err) {
    res.status(500).json({ message: 'Error updating status.' });
  }
};

// ─── DELETE COMPLAINT (Admin) ─────────────────────────────────────────────────
exports.deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Complaint.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Complaint not found.' });
    res.status(200).json({ message: 'Complaint deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting complaint.' });
  }
};

// ─── GET STATS (Admin) ────────────────────────────────────────────────────────
exports.getStats = async (req, res) => {
  try {
    const [total, pending, inProgress, resolved, byType, students] = await Promise.all([
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: 'Pending' }),
      Complaint.countDocuments({ status: 'In Progress' }),
      Complaint.countDocuments({ status: 'Resolved' }),
      Complaint.aggregate([{ $group: { _id: '$type', count: { $sum: 1 } } }]),
      User.countDocuments({ role: 'student', isVerified: true }),
    ]);

    // Weekly trend (last 7 weeks)
    const weeklyTrend = await Complaint.aggregate([
      {
        $group: {
          _id: { $isoWeek: '$createdAt' },
          count: { $sum: 1 },
          week: { $first: '$createdAt' },
        },
      },
      { $sort: { '_id': 1 } },
      { $limit: 7 },
    ]);

    res.status(200).json({ total, pending, inProgress, resolved, byType, students, weeklyTrend });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stats.' });
  }
};

// ─── GET ALL STUDENTS (Admin) ─────────────────────────────────────────────────
exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student', isVerified: true })
      .select('-password -otp -otpExpiry')
      .sort({ createdAt: -1 });

    // Attach complaint count
    const withCounts = await Promise.all(
      students.map(async (s) => {
        const count = await Complaint.countDocuments({ userId: s._id });
        return { ...s.toObject(), complaintCount: count };
      })
    );

    res.status(200).json(withCounts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching students.' });
  }
};
