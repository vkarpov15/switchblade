'use strict';

const co = require('co');
const ssh = require('co-ssh');
const scp = require('scp3');

module.exports = function(host, credentials, options) {
  return co(function*() {
    const conn = ssh({
      host: host,
      user: options.user || 'ubuntu',
      key: credentials
    });

    const scpClient = new scp.Client({
      host: host,
      port: 22,
      privateKey: credentials,
      username: options.user || 'ubuntu'
    });

    yield conn.connect();
    yield conn.exec(`cd ${options.projectName}`);
    yield conn.exec(`sudo npm run ${options.stopScript}`);
    for (var path of options.files) {
      const dest = `${options.projectName}/${path}`;
      yield callback => scpClient.upload(path, dest, callback);
    }
    yield conn.exec(`npm install`);
    yield conn.exec(`sudo npm run ${options.startScript}`);
  });
};
