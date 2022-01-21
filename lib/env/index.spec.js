'use strict';

/* eslint-env mocha */
/* eslint "jsdoc/require-jsdoc": 0 */

// --------------------------------------------------------------------------
//                      GLOBAL VAR DEFINITIONS
// --------------------------------------------------------------------------

const assert = require('assert');
const process = require('process');
const rewire = require('rewire');
const pf = rewire('./index.js');

// Map rewired, private functions to friendlier names
const getAppToken = pf.__get__('getAppToken');
const getMMUri = pf.__get__('getMMUri');
const getPBallUri = pf.__get__('getPBallUri');

const ENV_PLACEHOLDER = {};

// --------------------------------------------------------------------------
//                      HELPER FUNCTIONS
// --------------------------------------------------------------------------

function saveEnvVariable(name) {
  ENV_PLACEHOLDER[name] = process.env[name];
}

function restoreEnvVariable(name) {
  process.env[name] = ENV_PLACEHOLDER[name];
}

function deleteEnvVariable(name) {
  if (process.env.hasOwnProperty(name)) {
    delete process.env[name];
  }
}

function setEnvVariable(name, value) {
  process.env[name] = value;
}

// --------------------------------------------------------------------------
//                      MOCHA TESTS
// --------------------------------------------------------------------------

const throwers = [
  {name: 'NYDATA_APP_TOKEN', func: getAppToken},
  {name: 'MEGA_MILLIONS_URI', func: getMMUri},
  {name: 'POWERBALL_URI', func: getPBallUri},
];

throwers.forEach(x => {
  describe(x.name, function() {
    saveEnvVariable(x.name);
    it('should return a string with known value', function() {
      const val = 'nonsense';
      setEnvVariable(x.name, val);
      const result = x.func();
      restoreEnvVariable(x.name);
      assert.equal(result.includes(val), true);
    });
    it('should throw an exception', function() {
      deleteEnvVariable(x.name);
      assert.throws(x.func, Error);
      restoreEnvVariable(x.name);
    });
  });
});
