const yaml = require('js-yaml');
const fs = require('fs');

const ID_FILE = 'id_map.yml';
const idMap =
  yaml.safeLoad(fs.readFileSync(ID_FILE, { encoding: 'utf8', flag: 'a+' })) ||
  {};

const toIdMapFormat = (users) =>
  users
    .map((user) => ({
      [user.screen_name]: user.id,
    }))
    .reduce((start, curr) => Object.assign(start, curr));

const updateIdMap = (users) => {
  fs.writeFileSync(
    ID_FILE,
    yaml.safeDump(Object.assign({}, idMap, toIdMapFormat(users))),
    'utf8'
  );
};

const absentInIdMap = (screenName) => idMap[screenName] === undefined;

const presentInIdMap = (screenName) => idMap[screenName] !== undefined;

const watchForChangesToIdMap = () =>
  new Promise((resolve, reject) => {
    fs.watch(ID_FILE, (eventType, filename) => {
      resolve();
    });
  });

const getId = (screenName) => idMap[screenName];

module.exports = {
  getId,
  updateIdMap,
  presentInIdMap,
  absentInIdMap,
  watchForChangesToIdMap,
};
