const mongoose = require('mongoose');

// Comment schema
const CommentSchema = new mongoose.Schema({
  user: { type: String, required: true },
  comment: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

// Main Post schema
const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  topics: [{ 
    type: String, 
    enum: ['Politics', 'Health', 'Sport', 'Tech'], 
    required: true 
  }],
  body: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  ownerName: { type: String, required: true },

  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },

  comments: { type: [CommentSchema], default: [] },

  createdAt: { type: Date, default: Date.now }
});

// Virtual field for post status
PostSchema.virtual('status').get(function () {
  return new Date() < this.expiresAt ? 'Live' : 'Expired';
});

// Include virtuals when converting to JSON
PostSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Post', PostSchema);
