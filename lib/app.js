'use strict';

/* eslint "jsdoc/require-jsdoc": 0 */
/* eslint no-process-exit: "off" */

// Simple utility for getting and analyzing lottery data.

// ---------------------------------------------------------------------------
//                  GLOBAL VARIABLE DEFINITION
// ---------------------------------------------------------------------------

const process = require('process');
const appDebug = require('debug')('lotto:app');
const fetch = require('./powerball/fetch.js');
const munge = require('./powerball/munge.js');

// ---------------------------------------------------------------------------
//                  CLI HANDLING
// ---------------------------------------------------------------------------

const cliArgs = process.argv.slice(2);

const cliOpts = {
  'print-hot-numbers': {
    desc: 'Display numbers most frequently picked',
    args: '[yyyy-mm-dd]',
  },
};

// ---------------------------------------------------------------------------
//                  HELPER FUNCTIONS
// ---------------------------------------------------------------------------

function printUsageAndExit() {
  console.error('Usage:');
  Object.keys(cliOpts).forEach(x => {
    console.error(`# ${cliOpts[x].desc}`);
    let cmd = `./run-cli ${x}`;
    if (cliOpts[x].args) cmd = `${cmd} ${cliOpts[x].args}`;
    console.error(cmd);
    console.error();
  });
  process.exit(1);
}

function errout(err) {
  console.error(err);
  process.exit(1);
}

function auditUserInput(action, optArg) {
  if (!cliOpts.hasOwnProperty(action)) printUsageAndExit();
  if (action === 'print-hot-numbers') return;
  printUsageAndExit();
}

// ---------------------------------------------------------------------------
//                  MAIN LOGIC
// ---------------------------------------------------------------------------

const action = cliArgs[0];
const optArg = cliArgs[1];

auditUserInput(action, optArg);

if (action === 'print-hot-numbers') {

  const startDate = munge.stringToD(optArg);

  fetch.getPBallData()
    .then(data => munge.makePBallReport(JSON.parse(data), startDate))
    .then(report => console.log(report))
    .catch(err => errout(err));

}
