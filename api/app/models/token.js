const httpStatus = require('http-status');
const mongoose = require('mongoose');
const ApiError = require('./error');

const tokenSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  token: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now, expires: 3600 },
});

tokenSchema.statics = {
  get: async function(tok) {
    const token = await this.findOne({ token: tok }).populate(['user']);

    if (token) {
      if (token.user) {
        return token;
      }
      throw new ApiError({
        message: 'User does not exist.',
        status: httpStatus.NOT_FOUND,
      });
    } else {
      throw new ApiError({
        message:
          'Invalid or expired token. Please try login again to get a new one.',
        status: httpStatus.NOT_FOUND,
      });
    }
  },
};

module.exports = mongoose.model('Token', tokenSchema);
