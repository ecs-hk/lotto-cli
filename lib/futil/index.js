'use strict';

// ---------------------------------------------------------------------------
//                  GLOBAL VARIABLE DEFINITION
// ---------------------------------------------------------------------------

const appDebug = require('debug')('lotto:fs');
const fs = require('fs');

const HOURS_TO_CACHE = 6;

// ---------------------------------------------------------------------------
//                  FILESYSTEM FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Get last modified time for file.
 *
 * @param {string} file - File path/name.
 * @returns {Date} Modified time.
 */
async function getCacheMtime(file) {
  try {
    const {mtime} = await fs.promises.stat(file);
    appDebug(`Cache last modified: ${mtime}`);
    return mtime;
  } catch (err) {
    console.error('Thrown during local file stat');
    throw err;
  }
}

/**
 * Read local file data.
 *
 * @param {string} file - File path/name.
 * @returns {string} Data.
 */
async function readCache(file) {
  try {
    const data = await fs.promises.readFile(file, {encoding: 'utf8'});
    return data;
  } catch (err) {
    console.error('Thrown during local file read');
    throw err;
  }
}

/**
 * Write local file data.
 *
 * @param {string} file - File path/name.
 * @param {string} data - File data.
 */
async function writeCache(file, data) {
  try {
    await fs.promises.writeFile(file, data);
  } catch (err) {
    console.error('Thrown during local file write');
    throw err;
  }
}

/**
 * Check if file is stale / needs refreshing.
 *
 * @param {string} file - File path/name.
 * @returns {boolean} True if stale.
 */
async function isStaleCache(file) {
  try {
    const now = new Date();
    const cacheTime = await getCacheMtime(file);
    const diff = now - cacheTime;
    const hoursDiff = diff / (1000 * 60 * 60);
    appDebug(`Cache age: ${diff} milliseconds (${hoursDiff} hours)`);
    if (hoursDiff > HOURS_TO_CACHE) return true;
    return false;
  } catch (err) {
    if (err.code === 'ENOENT') {
      appDebug(`${file} does not exist, will create it..`);
      return true;
    }
    console.error('Thrown during stale file check');
    throw err;
  }
}

// ---------------------------------------------------------------------------
//                  EXPORTS
// ---------------------------------------------------------------------------

exports.isStaleCache = isStaleCache;
exports.readCache = readCache;
exports.writeCache = writeCache;
