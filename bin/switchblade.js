'use strict';

const commander = require('commander');
const fs = require('fs');
const packageJson = require('./package.json');
const switchblade = require('../');

commander.
  usage('switchblade --file <file> --host <host>').
  option('-f, --file <file>', 'File(s) to push to server').
  option('-h, --host <host>', 'Host to deploy to').
  option('-s, --start <start>', 'npm script to run to start server').
  option('-t, --stop <stop>', 'npm script to run to stop server').
  parse(process.argv);

const files = Array.isArray(commander.file) ? commander.file : [commander.file];
const host = commander.host;
const credentials = fs.readFileSync(process.env.SWITCHBLADE_CREDENTIALS);

const options = {};
options.projectName = packageJson.name;
options.files = files;
options.startScript = commander.start;
options.stopScript = commander.stop;

switchblade(host, credentials, options).
  then(() => { console.log('Success!'); process.exit(0); }).
  catch(error => { console.error(error); process.exit(1); });
