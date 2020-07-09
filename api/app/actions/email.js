const crypto = require('crypto');
const mailer = require('nodemailer').createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});
const Token = require('../models/token');

const invite = (email, cb) => {
  mailer.sendMail(
    {
      from: 'Rental Invitation Center <no-reply@rentals.com>',
      to: email,
      subject: 'Invitation received',
      html:
        '<p><h1>Welcome to Rentals!</h1></p><p><h3>You have been invited to our application by one of our administrators. Please follow our enrollment process. You will get directly into our application without email verification process.</h3></p>',
    },
    error => cb(!error, error && error.message),
  );
};

const verify = (email, user, cb) => {
  const token = crypto.randomBytes(16).toString('hex');
  new Token({ user, token })
    .save()
    .then(_ => {
      mailer.sendMail(
        {
          from: 'Rental Verification Center <no-reply@rentals.com>',
          to: email,
          subject: 'Verify your email address',
          html: `<p><h1>Welcome to Rentals!</h1></p><p><h3>Your account has been created - now it will be easier to manage rentals through this application. Please follow the below link to verify your account.</h3></p><br/><a href='http://192.168.1.55:5000/api/auth/verify/${token}'><h3>Verify Account</h3></a>`,
        },
        error => cb(!error, error && error.message),
      );
    })
    .catch(err => cb(false, err));
};

module.exports = { invite, verify };
