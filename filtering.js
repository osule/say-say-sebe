const { absentInIdMap } = require('./id_map');
const { config } = require('./config');

const ofInterest = (tweet) => {
  if (tweet.delete) {
    return false;
  }
  
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
  const optionalKeywords = config.keywords.join('|');
  const re = new RegExp(optionalKeywords, 'i');
  if (!re.test(tweet.text)) {
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
