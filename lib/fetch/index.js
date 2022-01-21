'use strict';

// ---------------------------------------------------------------------------
//                  GLOBAL VARIABLE DEFINITION
// ---------------------------------------------------------------------------

const axios = require('axios');
const path = require('path');
const appDebug = require('debug')('lotto:mmfetch');
const env = require('../env');
const futil = require('../futil');

const MM_DATA = path.join(__dirname, '../../data/mega-millions.json');
const PBALL_DATA = path.join(__dirname, '../../data/powerball.json');
const RES_LIMIT = 5000;

// ---------------------------------------------------------------------------
//                  HELPER FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Download data.
 *
 * @param {string} uri - URI.
 * @param {string} token - app token.
 * @returns {Promise<object[]>} Response.
 */
async function download(uri, token) {
  try {
    const conf = {
      method: 'get',
      url: `${uri}?$limit=${RES_LIMIT}`,
      headers: {'X-App-Token': token},
    };
    appDebug(`GET ${conf.url}`);
    const res = await axios(conf);
    return res.data;
  } catch (err) {
    console.error('Thrown during HTTP GET');
    throw err;
  }
}

// ---------------------------------------------------------------------------
//                  FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Get latest Mega Millions data.
 *
 * @returns {Promise<object[]>} Data.
 */
async function getMMData() {
  try {
    const stale = await futil.isStaleCache(MM_DATA);
    if (stale) {
      appDebug(`Stale local data, refreshing ${MM_DATA}`);
      const data = await download(env.getMMUri(), env.getAppToken());
      await futil.writeCache(MM_DATA, JSON.stringify(data));
    } else {
      appDebug(`Using local cache: ${MM_DATA}`);
    }
    const data = await futil.readCache(MM_DATA);
    return data;
  } catch (err) {
    console.error('Thrown while getting Mega Millions data');
    throw err;
  }
}

/**
 * Get latest Powerball data.
 *
 * @returns {Promise<object[]>} Data.
 */
async function getPBallData() {
  try {
    const stale = await futil.isStaleCache(PBALL_DATA);
    if (stale) {
      appDebug(`Stale local data, refreshing ${PBALL_DATA}`);
      const data = await download(env.getPBallUri(), env.getAppToken());
      await futil.writeCache(PBALL_DATA, JSON.stringify(data));
    } else {
      appDebug(`Using local cache: ${PBALL_DATA}`);
    }
    const data = await futil.readCache(PBALL_DATA);
    return data;
  } catch (err) {
    console.error('Thrown while getting Powerball data');
    throw err;
  }
}

// ---------------------------------------------------------------------------
//                  EXPORTS
// ---------------------------------------------------------------------------

exports.getMMData = getMMData;
exports.getPBallData = getPBallData;
