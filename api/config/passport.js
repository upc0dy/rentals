const { Strategy: JWTStrategy, ExtractJwt } = require('passport-jwt');
const BearerStrategy = require('passport-http-bearer');
const download = require('download-file');
const Axios = require('axios');
const User = require('../app/models/user');

const downloadAvatar = (url, cb) => {
  const filename = 'avatar_' + Date.now() + '.jpg';
  download(
    url,
    {
      directory: './avatars/',
      filename,
    },
    err => cb(err ? null : filename),
  );
};

const jwtOptions = {
  secretOrKey: process.env.JWT_KEY,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwt = ({ _id }, done) => {
  User.findById(_id, (err, user) => {
    if (err) {
      return done(err, null);
    }
    if (user) {
      return done(null, user._doc);
    } else {
      return done(null, null);
    }
  });
};

const socialAuth = type => async (access_token, done) => {
  const url = {
    facebook: 'https://graph.facebook.com/me',
    google: 'https://www.googleapis.com/oauth2/v3/userinfo',
  }[type];
  const fields = 'id, name, email, picture';
  const params =
    type === 'facebook' ? { access_token, fields } : { access_token };
  try {
    const res = await Axios.get(url, { params });
    const { name, email, picture, id, sub } = res.data;
    const username = name.split(' ')[0];
    downloadAvatar(
      type === 'facebook' ? picture.data.url : picture,
      async avatar =>
        done(
          null,
          await User.getSocialUser({
            type,
            username,
            email,
            avatar,
            id: sub || id,
          }),
        ),
    );
  } catch (err) {
    done(err);
  }
};

module.exports = {
  jwt: new JWTStrategy(jwtOptions, jwt),
  facebook: new BearerStrategy(socialAuth('facebook')),
  google: new BearerStrategy(socialAuth('google')),
};
