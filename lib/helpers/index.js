'use strict';

// ---------------------------------------------------------------------------
//                  GLOBAL VARIABLE DEFINITION
// ---------------------------------------------------------------------------

const appDebug = require('debug')('lotto:h');

const DEFAULT_DATE = new Date('1969-01-01');

// ---------------------------------------------------------------------------
//                  FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Convert a datestring to a Date object.
 *
 * @param {string} s - Datetime string.
 * @returns {Date|null} Date.
 */
function stringToD(s) {
  const d = new Date(s);
  if (d instanceof Date && !isNaN(d)) return d;
  return null;
}

/**
 * Determine if a number is odd.
 *
 * @param {string} num - Number represented as string.
 * @returns {boolean} True if odd, false if even.
 */
function isOddNumber(num) {
  if ((parseInt(num, 10) % 2) === 1) return true;
  return false;
}

/**
 * Calculate sum.
 *
 * @param {string[]} l - Array of string numbers.
 * @returns {number} Sum.
 */
function sum(l) {
  if (!l || !Array.isArray(l)) {
    throw new Error('Not an array');
  }
  const nums = l.map(x => parseInt(x, 10));
  let sum = 0;
  nums.forEach(x => sum += x);
  return sum;
}

/**
 * Calculate range.
 *
 * @param {string[]} l - Array of string numbers.
 * @returns {number} Range.
 */
function range(l) {
  if (!l || !Array.isArray(l)) {
    throw new Error('Not an array');
  }
  const nums = l.map(x => parseInt(x, 10));
  return Math.max(...nums) - Math.min(...nums);
}

// ---------------------------------------------------------------------------
//                  EXPORTS
// ---------------------------------------------------------------------------

exports.isOddNumber = isOddNumber;
exports.range = range;
exports.sum = sum;
exports.stringToD = stringToD;
