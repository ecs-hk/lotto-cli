'use strict';

// ---------------------------------------------------------------------------
//                  GLOBAL VARIABLE DEFINITION
// ---------------------------------------------------------------------------

const appDebug = require('debug')('lotto:pbpro');

// ---------------------------------------------------------------------------
//                  HELPER FUNCTIONS
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
 * Determine start and end date.
 *
 * @param {object[]} data - Powerball data.
 * @returns {string} Date range.
 */
function getDateRange(data) {
  let start;
  let end;
  data.forEach(x => {
    const d = new Date(x['draw_date']);
    if (!start || d < start) start = d;
    if (!end || d > end) end = d;
  });
  return `${start} to ${end}`
}

/**
 * Split all winning numbers, e.g. "21 38 49 54 60 14".
 *
 * @param {object[]} data - Powerball data.
 * @returns {object[]} White balls and red balls.
 */
function splitWinningNumbers(data) {
  return data.map(x => {
    const n = x['winning_numbers'].split(' ');
    return {
      whiteBalls: n.slice(0, 5),
      redBall: n[5],
    };
  });
}

/**
 * Calculate hottest white balls.
 *
 * @param {object[]} numbers - Winning numbers.
 * @returns {object[]} White balls sorted by frequency.
 */
function findHotWhiteNumbers(numbers) {
  const hot = {};
  numbers.forEach(x => {
    x.whiteBalls.forEach(ball => {
      if (ball in hot) hot[ball] += 1;
      else hot[ball] = 1;
    });
  });
  return Object.entries(hot).sort((a, b) => b[1] - a[1]);
}

/**
 * Calculate hottest red balls.
 *
 * @param {object[]} numbers - Winning numbers.
 * @returns {object[]} Red balls sorted by frequency.
 */
function findHotRedNumbers(numbers) {
  const hot = {};
  numbers.forEach(x => {
    if (x.redBall in hot) hot[x.redBall] += 1;
    else hot[x.redBall] = 1;
  });
  return Object.entries(hot).sort((a, b) => b[1] - a[1]);
}

/**
 * Calculate hottest pairs of red and white balls.
 *
 * @param {object[]} numbers - Winning numbers.
 * @returns {object[]} Pairs sorted by frequency.
 */
function findHotPairs(numbers) {
  const hot = {};
  numbers.forEach(x => {
    const red = x.redBall;
    x.whiteBalls.forEach(white => {
      const key = `red ${red}, white ${white}`;
      if (key in hot) hot[key] += 1;
      else hot[key] = 1;
    });
  });
  const sorted = Object.entries(hot).sort((a, b) => b[1] - a[1]);
  // Only return the top hits to avoid humongous output.
  return sorted.slice(0, 21);
}

/**
 * Calculate average odd and even white balls per drawing.
 *
 * @param {object[]} numbers - Winning numbers.
 * @returns {string} Averages.
 */
function findOddEvenAverages(numbers) {
  let odds = 0;
  let evens = 0;
  numbers.forEach(x => {
    x.whiteBalls.forEach(ball => {
      if (isOddNumber(ball)) odds += 1;
      else evens += 1;
    });
  });
  const l = numbers.length;
  return `Average ${odds/l} odd : ${evens/l} even`;
}

// ---------------------------------------------------------------------------
//                  FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Process and report on Powerball data.
 *
 * @param {object[]} data - Powerball data.
 * @param {Date|null} startFrom - Start date for analysis.
 * @returns {object} Report.
 */
function makePBallReport(data, startFrom = new Date('1969-01-01')) {
  const filtered = data.filter(x => stringToD(x['draw_date']) >= startFrom);
  const numbers = splitWinningNumbers(filtered);
  return {
    dateRange: getDateRange(filtered),
    totalDrawings: numbers.length,
    whiteBalls: findHotWhiteNumbers(numbers),
    redBalls: findHotRedNumbers(numbers),
    redWhitePairs: findHotPairs(numbers),
    oddEvenAvg: findOddEvenAverages(numbers),
  };
}

// ---------------------------------------------------------------------------
//                  EXPORTS
// ---------------------------------------------------------------------------

exports.makePBallReport = makePBallReport;
exports.stringToD = stringToD;
