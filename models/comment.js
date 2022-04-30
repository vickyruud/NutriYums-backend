const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create schema for Comments
const CommentSchema = new Schema({
  user_id: {
    type: Number,
    required: true 
  },
  recipe_id: {
    type: Number,
    required: true 
  }, 
  value: {
    type: String,
    required: true 
  },
  id: {
    type: String,
    required: true
  }
});


// Create model for USer
const Comment = mongoose.model('comment', CommentSchema);

module.exports = Comment;