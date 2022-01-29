'use strict';

/* eslint "jsdoc/require-jsdoc": 0 */
/* eslint no-process-exit: "off" */

// Simple utility for getting and analyzing lottery data.

// ---------------------------------------------------------------------------
//                  GLOBAL VARIABLE DEFINITION
// ---------------------------------------------------------------------------

const process = require('process');
const appDebug = require('debug')('lotto:app');
const fetch = require('./fetch');
const h = require('./helpers');
const munge = require('./munge');

// ---------------------------------------------------------------------------
//                  CLI HANDLING
// ---------------------------------------------------------------------------

const cliArgs = process.argv.slice(2);

const cliOpts = {
  'mega-millions': {
    desc: 'Generate report on Mega Millions winning numbers',
    args: '[yyyy-mm-dd]',
  },
  'powerball': {
    desc: 'Generate report on Powerball winning numbers',
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
  if (action === 'mega-millions') return;
  if (action === 'powerball') return;
  printUsageAndExit();
}

// ---------------------------------------------------------------------------
//                  MAIN LOGIC
// ---------------------------------------------------------------------------

const action = cliArgs[0];
const optArg = cliArgs[1];

auditUserInput(action, optArg);

const startDate = h.stringToD(optArg);

if (action === 'mega-millions') {

  fetch.getMMData()
    .then(data => munge.makeMMReport(JSON.parse(data), startDate))
    .then(report => console.log(report))
    .catch(err => errout(err));

} else if (action === 'powerball') {

  fetch.getPBallData()
    .then(data => munge.makePBallReport(JSON.parse(data), startDate))
    .then(report => console.log(report))
    .catch(err => errout(err));

}
