const fs = require('fs');

const logStream = fs.createWriteStream('retweets.log', {
  flag: 'a',
  encoding: 'utf8'
});

const errorStream = fs.createWriteStream('err.log', {
  flag: 'a',
  encoding: 'utf8'
});

const info = (message) => logStream.write(message);
const error = (message) => errorStream.write(message);

process.on('beforeExit', (code) => {
  logStream.end();
  errorStream.end();
});

module.exports = {
  error,
  info,
};
