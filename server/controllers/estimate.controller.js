const Estimate = require('../models/estimate.model');

// Try to require nodemailer, but don't crash if it's not available
let nodemailer, transporter, config;
try {
  nodemailer = require('nodemailer');
  config = require('../config/email.config');

  // Create a transport for sending emails if nodemailer is available
  transporter = nodemailer.createTransport({
    service: config.EMAIL_SERVICE,
    auth: {
      user: config.EMAIL_USER,
      pass: config.EMAIL_PASSWORD,
    },
  });
} catch (error) {
  console.warn('Nodemailer not available, email functions will be disabled');
}

// Create a new estimate
exports.createEstimate = async (req, res) => {
  try {
    const newEstimate = new Estimate({
      ...req.body,
      isRead: false,
      status: 'new',
    });

    const savedEstimate = await newEstimate.save();

    // Only send emails if nodemailer is available
    if (transporter) {
      try {
        // Send email notification to admin
        const adminEmail = {
          from: config.EMAIL_USER,
          to: config.ADMIN_EMAIL,
          subject: 'New Estimate Request',
          html: `
            <h2>New Estimate Request</h2>
            <p><strong>From:</strong> ${req.body.firstName} ${req.body.lastName}</p>
            <p><strong>Email:</strong> ${req.body.email}</p>
            <p><strong>Item:</strong> ${req.body.itemName}</p>
            <p><strong>Category:</strong> ${req.body.category}</p>
            <p><strong>Description:</strong> ${req.body.description}</p>
            <p>Please login to the admin dashboard to see the full request.</p>
          `,
        };

        // Send confirmation email to customer
        const customerEmail = {
          from: config.EMAIL_USER,
          to: req.body.email,
          subject: 'Your Estimate Request - Pischetola Antiques',
          html: `
            <h2>Thank You for Your Estimate Request</h2>
            <p>Dear ${req.body.firstName},</p>
            <p>We have received your estimate request for ${req.body.itemName}.</p>
            <p>Our team of experts will review your information and get back to you soon.</p>
            <p>If you have any questions in the meantime, please don't hesitate to contact us.</p>
            <p>Best regards,<br>Pischetola Antiques Team</p>
          `,
        };

        // Send both emails
        await transporter.sendMail(adminEmail);
        await transporter.sendMail(customerEmail);
      } catch (emailError) {
        console.error('Failed to send email notifications:', emailError);
        // Continue with the response even if emails fail
      }
    }

    res.status(201).json(savedEstimate);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all estimates (with optional filters)
exports.getAllEstimates = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = '-createdAt', status, isRead, search } = req.query;

    // Build the query
    let query = {};

    if (status) {
      query.status = status;
    }

    if (isRead !== undefined) {
      query.isRead = isRead === 'true';
    }

    if (search) {
      query.$or = [
        { itemName: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const options = {
      sort: sort,
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
    };

    const [estimates, total] = await Promise.all([
      Estimate.find(query, null, options),
      Estimate.countDocuments(query),
    ]);

    res.status(200).json({
      estimates,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      totalEstimates: total,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get estimate statistics
exports.getEstimateStats = async (req, res) => {
  try {
    const total = await Estimate.countDocuments();
    const unread = await Estimate.countDocuments({ isRead: false });
    const new_status = await Estimate.countDocuments({ status: 'new' });
    const in_progress = await Estimate.countDocuments({ status: 'in_progress' });
    const completed = await Estimate.countDocuments({ status: 'completed' });
    const declined = await Estimate.countDocuments({ status: 'declined' });

    res.status(200).json({
      total,
      unread,
      by_status: {
        new: new_status,
        in_progress,
        completed,
        declined,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single estimate by ID
exports.getEstimateById = async (req, res) => {
  try {
    const estimate = await Estimate.findById(req.params.id);
    if (!estimate) {
      return res.status(404).json({ message: 'Estimate not found' });
    }
    res.status(200).json(estimate);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Reply to an estimate
exports.replyToEstimate = async (req, res) => {
  try {
    const estimate = await Estimate.findById(req.params.id);
    if (!estimate) {
      return res.status(404).json({ message: 'Estimate not found' });
    }

    // Mark as read and update status
    estimate.isRead = true;
    estimate.status = 'in_progress';
    await estimate.save();

    // Send email to customer if nodemailer is available
    if (transporter) {
      try {
        const customerEmail = {
          from: config.EMAIL_USER,
          to: estimate.email,
          subject: `RE: Your Estimate Request for ${estimate.itemName} - Pischetola Antiques`,
          html: `
            <h2>Response to Your Estimate Request</h2>
            <p>Dear ${estimate.firstName},</p>
            <div>${req.body.reply}</div>
            <p>If you have any questions, please don't hesitate to contact us.</p>
            <p>Best regards,<br>Pischetola Antiques Team</p>
          `,
        };

        await transporter.sendMail(customerEmail);
      } catch (emailError) {
        console.error('Failed to send reply email:', emailError);
        // Continue with the response even if email fails
      }
    }

    res.status(200).json({ message: 'Reply sent successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update estimate status
exports.updateEstimateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['new', 'in_progress', 'completed', 'declined'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updatedEstimate = await Estimate.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedEstimate) {
      return res.status(404).json({ message: 'Estimate not found' });
    }

    res.status(200).json(updatedEstimate);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Toggle read status
exports.toggleReadStatus = async (req, res) => {
  try {
    const estimate = await Estimate.findById(req.params.id);

    if (!estimate) {
      return res.status(404).json({ message: 'Estimate not found' });
    }

    estimate.isRead = !estimate.isRead;
    await estimate.save();

    res.status(200).json(estimate);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add admin notes
exports.addAdminNotes = async (req, res) => {
  try {
    const { notes } = req.body;

    const updatedEstimate = await Estimate.findByIdAndUpdate(
      req.params.id,
      { adminNotes: notes },
      { new: true }
    );

    if (!updatedEstimate) {
      return res.status(404).json({ message: 'Estimate not found' });
    }

    res.status(200).json(updatedEstimate);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete an estimate
exports.deleteEstimate = async (req, res) => {
  try {
    const deletedEstimate = await Estimate.findByIdAndDelete(req.params.id);

    if (!deletedEstimate) {
      return res.status(404).json({ message: 'Estimate not found' });
    }

    res.status(200).json({ message: 'Estimate deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
