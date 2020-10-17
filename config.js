const yaml = require('js-yaml');
const fs = require('fs');

const CONFIG_FILE = 'config.yml';
const config = yaml.safeLoad(fs.readFileSync(CONFIG_FILE, 'utf8'));

const watchForChangesToConfig = () => 
  new Promise((resolve, reject) => {
    fs.watch(CONFIG_FILE, (eventType, filename) => {
      resolve();
    });
  });
  
module.exports = {
    config,
    watchForChangesToConfig
};