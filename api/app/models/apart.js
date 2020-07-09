const httpStatus = require('http-status');
const mongoose = require('mongoose');
const ApiError = require('./error');
const User = require('./user');

const apartSchema = new mongoose.Schema(
  {
    realtor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: { type: String, required: true },
    description: { type: String, required: true },
    areaSize: { type: Number, required: true },
    price: { type: Number, required: true },
    roomCount: { type: Number, required: true },
    latitude: { type: Number, required: true, default: 1.379883 },
    longitude: { type: Number, required: true, longitude: 103.744178 },
    status: { type: Boolean, default: true, required: true },
  },
  { timestamps: true },
);

apartSchema.static({
  get: async function(id) {
    let apart;

    if (mongoose.Types.ObjectId.isValid(id)) {
      apart = await this.findById(id).exec();
    }
    if (apart) {
      if (mongoose.Types.ObjectId.isValid(apart.realtor)) {
        apart.realtor = await User.findById(apart.realtor);
        if (!apart.realtor) {
          return null;
        }
      }
      return apart;
    }

    throw new ApiError({
      message: 'Apartment does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },
});

module.exports = mongoose.model('Apart', apartSchema);
