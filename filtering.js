const { absentInIdMap } = require('./id_map');

const ofInterest = (tweet) => {
  if (new Date(tweet.timestamp_ms) < Date.parse('2020-10-16')) {
    return false;
  }

  if (tweet.retweeted) {
    return false;
  }
  if (tweet.favorited) {
    return false;
  }

  if (!tweet.user.verified) {
    return false;
  }
  if (tweet.text.length < 80) {
    return false;
  }

  if (absentInIdMap(tweet.user.screen_name)) {
    return false;
  }
  return true;
};

module.exports = {
  ofInterest,
};
