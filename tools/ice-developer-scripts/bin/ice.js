#!/usr/bin/env node

'use strict';

const program = require('commander');
const spawn = require('cross-spawn');
const path = require('path');
const packageInfo = require('../package.json');
const getTypes = require('../lib/getTypes');

console.log(packageInfo.name, packageInfo.version);

program
  .version(packageInfo.version)
  .command('component', 'commands for component')
  .command('block', 'commands for blocks or layout')
  .parse(process.argv);

const proc = program.runningCommand;

if (proc) {
  proc.on('close', process.exit.bind(process));
  proc.on('error', () => {
    process.exit(1);
  });
}

const subCmd = program.args[0];

// 获取项目类型,
// project | block | layout | component
const type = getTypes();

switch (type) {
  case 'component':
    invoke('component', subCmd);
    break;
  case 'block':
  case 'layout':
    break;

  default:
    // for project and unknown
    // 透传给 ice-scripts
    const ice = require.resolve('ice-scripts/bin/ice');
    spawn.sync(ice, program.args, { stdio: 'inherit' });
}

function invoke(type, cmd) {
  const entry = path.join(__dirname, '../lib/component-' + subCmd);
  try {
    require(entry);
  } catch (err) {
    console.log(err);
    console.error('Current Command not exists');
    process.exit(1);
  }
}
