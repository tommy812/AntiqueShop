const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true
  },
  email: { 
    type: String, 
    required: true
  },
  phone: { 
    type: String
  },
  subject: { 
    type: String
  },
  message: { 
    type: String, 
    required: true
  },
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product'
  },
  status: { 
    type: String, 
    enum: ['new', 'read', 'replied', 'closed'],
    default: 'new'
  },
  isRead: { 
    type: Boolean, 
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Message', messageSchema); 