var env = require('./env');
const FACEBOOK_APP_ID = env === 'development' ? '1160840187372674' : '';
const FACEBOOK_SECRET = env === 'development' ? 'd89b518ebe4202799b0d6f475bbc555c' : '';

module.exports = {
  'appID' : FACEBOOK_APP_ID,
  'appSecret' : FACEBOOK_SECRET,
  'callbackUrl' : 'http://localhost:3000/login/facebook/callback'
}