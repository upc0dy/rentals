const fs = require('fs');
const path = require('path');
const httpStatus = require('http-status');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const ApiError = require('./error');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, minlength: 3, maxlength: 30, required: true },
    email: {
      type: String,
      match: /^\S+@\S+\.\S+$/,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, maxlength: 128 },
    role: { type: Number, enum: [1, 2, 3], default: 1 },
    social: { type: String },
    avatar: { type: String, trim: true, default: 'default.jpg' },
    approved: { type: Boolean, default: false },
    blocked: { type: Boolean, default: false },
    danger: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', function(next) {
  if (!this.isModified('password')) {
    next();
    return;
  }

  bcrypt
    .hash(this.password, 10)
    .then(hash => {
      this.password = hash;
      next();
    })
    .catch(error => next(error));
});

userSchema.method({
  extract: function() {
    const extracted = {};
    const fields = [
      '_id',
      'username',
      'email',
      'avatar',
      'role',
      'approved',
      'blocked',
      'createdAt',
    ];

    fields.forEach(field => {
      extracted[field] = this[field];
    });

    return extracted;
  },

  token: function() {
    return `${jwt.sign({ _id: this._id }, 'rentals', {
      expiresIn: 3600,
    })}`;
  },

  validPassword: async function(password) {
    return await bcrypt.compare(password, this.password);
  },
});

userSchema.static({
  get: async function(id) {
    let user;

    if (mongoose.Types.ObjectId.isValid(id)) {
      user = await this.findById(id).exec();
    }
    if (user) {
      return user;
    }

    throw new ApiError({
      message: 'User does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },

  checkEmail: function(error, email) {
    if (error.name === 'MongoError' && error.code === 11000) {
      return new ApiError({
        message: `A user existing with ${email}`,
        status: httpStatus.CONFLICT,
      });
    }
    return error;
  },

  getSocialUser: async function({ type, username, email, avatar, id }) {
    const newId = (type === 'facebook' ? 'fb' : 'gl') + id;
    const user = await this.findOne({
      $or: [{ social: newId }, { email }],
    });
    if (user) {
      if (!user.avatar.includes('default')) {
        fs.unlinkSync(path.join(__dirname, '../../avatars/', user.avatar));
      }
      user.social = newId;
      user.avatar = avatar;
      return user.save();
    }
    return this.create({
      social: newId,
      username,
      email,
      avatar,
      approved: true,
    });
  },
});

module.exports = mongoose.model('User', userSchema);
