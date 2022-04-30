const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create schema for Ratings
const RatingSchema = new Schema({
  user_id: {
    type: Number,
    required: true 
  },
  recipe_id: {
    type: Number,
    required: true 
  }, 
  value: {
    type: Number,
    required: true 
  },
  id: {
    type: Number,
    required: true
  }
});


// Create model for USer
const Rating = mongoose.model('rating', RatingSchema);

module.exports = Rating;