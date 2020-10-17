require('dotenv').config();

const Twitter = require('twitter-lite');

const T = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000,
  strictSSL: true,
});

async function lookupUserIds(screenNames) {
  const users = await T.get('users/lookup', {
    screen_name: screenNames.join(','),
  });

  const userIds = users.map((user) => ({
    id: user.id_str,
    screen_name: user.screen_name,
  }));
  return userIds;
}

function filterStream(params, action) {
  if (params.follow.length < 0) {
    return {
      destroy: () => {},
    };
  }

  const stream = T.stream('statuses/filter', params);

  stream.on('start', (response) => console.log('start'));
  stream.on('data', async (tweet) => await action(tweet));
  stream.on('error', (error) => console.log('error', error));
  stream.on('end', (response) => console.log('end'));

  return stream;
}

async function retweet(id) {
  const response = await T.post('statuses/retweet', {
    id,
  });
  return response;
}

const createFilterStreamParams = (accountIds) => ({
  follow: accountIds.join(','),
});

module.exports = {
  lookupUserIds,
  filterStream,
  createFilterStreamParams,
  retweet,
};
