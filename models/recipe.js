const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create schema for Recipe
const RecipeSchema = new Schema({
  user_id: {
    type: Number,
    required: true 
  },
  name: {
    type: String,
    required: true 
  },
  description: {
    type: String,
    required: true 
  },
  ingredients:{
    type: Object,
    required: true 
  },
  steps:{
    type: String,
    required: true 
  },
  servings:{
    type: Object,
    required: true 
  },
  time:{
    type: Number,
    required: true 
  },
  rating:{
    type: Number,
    required: true 
  },
  image:{
    type: String,
    required: true 
  },
  id: {
    type: String,
    required: true
  }
});

// Create model for Recipe
const Recipe = mongoose.model('recipe', RecipeSchema);

module.exports = Recipe;