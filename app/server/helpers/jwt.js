import JWT from 'jsonwebtoken';
const jwtSecret = require('../../config/secrets').jwtSecret;

export default {
  getLoginToken: user => {
    return JWT.sign(user, jwtSecret, {});
  }
};
