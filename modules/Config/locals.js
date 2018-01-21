
const env = process.env.NODE_ENV || 'local';

const public = {
  isLocal: env === 'local',
  isLive: env === 'live',
  env: env
};

module.exports = public;