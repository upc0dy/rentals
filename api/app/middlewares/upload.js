const multer = require('multer');

module.exports = multer({
  storage: multer.diskStorage({
    destination: 'avatars/',
    filename: (_, __, cb) => cb(null, `avatar_${Date.now()}.jpg`),
  }),
}).single('avatar');
