const authJwt = require('./auth.middleware');
const upload = require('./upload.middleware');

module.exports = {
  authJwt,
  upload,
};
