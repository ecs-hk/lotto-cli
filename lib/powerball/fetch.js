'use strict';

// ---------------------------------------------------------------------------
//                  GLOBAL VARIABLE DEFINITION
// ---------------------------------------------------------------------------

const axios = require('axios');
const path = require('path');
const appDebug = require('debug')('lotto:pbfetch');
const env = require('../env');
const futil = require('../futil');

const LOCAL_DATA = path.join(__dirname, '../../data/powerball.json');
const RES_LIMIT = 5000;

// ---------------------------------------------------------------------------
//                  HELPER FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Download data from Powerball HTTP API.
 *
 * @returns {Promise<object[]>} Response.
 */
async function downloadPBallData() {
  try {
    const conf = {
      method: 'get',
      url: `${env.getPBallUri()}?$limit=${RES_LIMIT}`,
      headers: {'X-App-Token': env.getPBallToken()},
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
 * Get latest Powerball data. Refresh local file if it's stale.
 *
 * @returns {Promise<object[]>} Data.
 */
async function getPBallData() {
  try {
    const stale = await futil.isStaleCache(LOCAL_DATA);
    if (stale) {
      appDebug(`Stale local data, refreshing ${LOCAL_DATA}`);
      const data = await downloadPBallData();
      await futil.writeCache(LOCAL_DATA, JSON.stringify(data));
    } else {
      appDebug(`Using locally cached data in ${LOCAL_DATA}`);
    }
    const data = await futil.readCache(LOCAL_DATA);
    return data;
  } catch (err) {
    console.error('Thrown while getting Powerball data');
    throw err;
  }
}

// ---------------------------------------------------------------------------
//                  EXPORTS
// ---------------------------------------------------------------------------

exports.getPBallData = getPBallData;
