const {
  lookupUserIds,
  filterStream,
  retweet,
  createFilterStreamParams,
} = require('./lib/twitter');
const { config, watchForChangesToConfig } = require('./config');
const {
  getId,
  updateIdMap,
  absentInIdMap,
  presentInIdMap,
  watchForChangesToIdMap,
} = require('./id_map');
const { ofInterest } = require('./filtering');
const logger = require('./logging');

async function start(config) {
  const unidentifiedAccounts = config.screen_names.filter(absentInIdMap);
  let identifiedAccounts = config.screen_names.filter(presentInIdMap);

  if (unidentifiedAccounts.length > 0) {
    try {
      const newlyIdentifiedAccounts = await lookupUserIds(unidentifiedAccounts);
      await updateIdMap(newlyIdentifiedAccounts);
    } catch (err) {
      logger.error(JSON.stringify(err));
    }
  }
  const retweetAndLog = async (tweet) => {
    if (!ofInterest(tweet)) {
      return;
    }
    try {
      console.log(`retweeting from ${tweet.user.screen_name} \n ${tweet.text}`);
      const r = await retweet(tweet.id_str);
      const ts = Date.now();
      logger.info(`${ts},${tweet.id_str},${r.id_str}\n`);
    } catch (err) {
      console.log(`retweeting failed from ${tweet.user.screen_name}`);
      const ts = Date.now();
      logger.info(`${ts},${tweet.id_str},0\n`);
      logger.error(JSON.stringify(err));
    }
  };
  
  const accountIds = identifiedAccounts.map(getId);
  const sleep = () => new Promise((resolve, reject) => {
    setTimeout(resolve, 3 * 1000);
  });

  let stream = filterStream(
    createFilterStreamParams(accountIds),
    retweetAndLog,
  );

  watchForChangesToConfig().then(() => {
    process.nextTick(() => {
      stream.destroy();
    });
    return sleep();
  }).then(() => {
    start(config);
  });

  process.on('SIGINT', async (code) => {
    process.nextTick(stream.destroy);
    await sleep();
    process.exit();
  });
}

start(config);
