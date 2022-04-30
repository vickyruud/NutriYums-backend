const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create schema for USer
const UserSchema = new Schema({
  username: {
    type: String,
    required: true 
  },
  email: {
    type: String,
    required: true 
  }, 
  password: {
    type: String,
    required: true 
  },
  id: {
    type: String,
    required: true
  }
});

// hash the password
UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

// Create model for USer
const User = mongoose.model('user', UserSchema);

module.exports = User;