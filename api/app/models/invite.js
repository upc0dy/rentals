const httpStatus = require('http-status');
const mongoose = require('mongoose');
const ApiError = require('./error');

const inviteSchema = new mongoose.Schema({
  email: {
    type: String,
    match: /^\S+@\S+\.\S+$/,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  registered: { type: Boolean, default: false },
});

inviteSchema.static({
  checkEmail: function(error, email) {
    if (error.name === 'MongoError' && error.code === 11000) {
      return new ApiError({
        message: `Invitation already sent to ${email}`,
        status: httpStatus.CONFLICT,
      });
    }
    return error;
  },
});

module.exports = mongoose.model('Invite', inviteSchema);
