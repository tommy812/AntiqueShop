const Message = require('../models/message.model');
const Product = require('../models/product.model');

// Get all messages with pagination and filtering
exports.getAllMessages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || '-createdAt';
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = {};
    
    // Filter by status
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    // Filter by read status
    if (req.query.isRead !== undefined) {
      filter.isRead = req.query.isRead === 'true';
    }
    
    // Search by name, email, or subject
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
        { subject: { $regex: req.query.search, $options: 'i' } },
        { message: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    // Count total matching documents
    const total = await Message.countDocuments(filter);
    
    // Get filtered messages
    const messages = await Message.find(filter)
      .populate('product')
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;
    
    // Count unread messages (for admin dashboard)
    const unreadCount = await Message.countDocuments({ isRead: false });
    
    res.json({
      messages,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        hasNext,
        hasPrev,
        limit
      },
      unreadCount
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get message by ID
exports.getMessageById = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id).populate('product');
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    // Mark as read if not already
    if (!message.isRead) {
      message.isRead = true;
      message.status = message.status === 'new' ? 'read' : message.status;
      await message.save();
    }
    
    res.json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new message (from contact form)
exports.createMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message, product } = req.body;
    
    // Check if product exists if provided
    if (product) {
      const productExists = await Product.findById(product);
      if (!productExists) {
        return res.status(404).json({ message: 'Product not found' });
      }
    }
    
    // Create new message
    const newMessage = new Message({
      name,
      email,
      phone,
      subject,
      message,
      product,
      status: 'new',
      isRead: false
    });
    
    await newMessage.save();
    
    res.status(201).json({
      message: 'Message sent successfully',
      id: newMessage._id
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update message status
exports.updateMessageStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['new', 'read', 'replied', 'closed'].includes(status)) {
      return res.status(400).json({ message: 'Valid status is required' });
    }
    
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    // Update status
    message.status = status;
    
    // If status is read or higher and message isn't marked as read yet
    if (['read', 'replied', 'closed'].includes(status) && !message.isRead) {
      message.isRead = true;
    }
    
    await message.save();
    
    res.json({
      message: 'Message status updated successfully',
      updatedMessage: message
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    await message.deleteOne();
    
    res.json({ message: 'Message deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mark message as read/unread
exports.toggleReadStatus = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    // Toggle read status
    message.isRead = !message.isRead;
    
    // Update status if needed
    if (message.isRead && message.status === 'new') {
      message.status = 'read';
    }
    
    await message.save();
    
    res.json({
      message: `Message marked as ${message.isRead ? 'read' : 'unread'}`,
      updatedMessage: message
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get message statistics (for admin dashboard)
exports.getMessageStats = async (req, res) => {
  try {
    const total = await Message.countDocuments();
    const unread = await Message.countDocuments({ isRead: false });
    const replied = await Message.countDocuments({ status: 'replied' });
    const closed = await Message.countDocuments({ status: 'closed' });
    
    // Count messages by day for the last 7 days
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    
    const dailyMessages = await Message.aggregate([
      {
        $match: {
          createdAt: { $gte: last7Days }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    res.json({
      total,
      unread,
      replied,
      closed,
      dailyMessages
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 