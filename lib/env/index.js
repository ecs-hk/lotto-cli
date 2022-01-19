'use strict';

// ---------------------------------------------------------------------------
//                  GLOBAL VARIABLE DEFINITION
// ---------------------------------------------------------------------------

const process = require('process');

// ---------------------------------------------------------------------------
//                  HELPER FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Check whether variable is set in the environment.
 *
 * @param {string} name - Name of environment variable.
 * @returns {boolean} True if variable is set and has a truthy value.
 */
function isSetInEnv(name) {
  if (!process.env.hasOwnProperty(name)) {
    return false;
  }
  if (!process.env[name]) {
    return false;
  }
  return true;
}

/**
 * Return the value of an environment variable.
 *
 * @param {string} name - Name of environment variable.
 * @returns {string} Environment variable value.
 */
function getEnvValue(name) {
  if (isSetInEnv(name)) return process.env[name];
  throw new Error(`Set ${name} in your environment`);
}

// ---------------------------------------------------------------------------
//                  ENVIRONMENT VARIABLE FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Read Powerball app token from environment.
 *
 * @returns {string} Token.
 */
function getPBallToken() {
  const name = 'POWERBALL_APP_TOKEN';
  return getEnvValue(name);
}

/**
 * Read Powerball URI from environment.
 *
 * @returns {string} URI.
 */
function getPBallUri() {
  const name = 'POWERBALL_URI';
  return getEnvValue(name);
}

// ---------------------------------------------------------------------------
//                  EXPORTS
// ---------------------------------------------------------------------------

exports.getPBallToken = getPBallToken;
exports.getPBallUri = getPBallUri;
