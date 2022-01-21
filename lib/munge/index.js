'use strict';

// ---------------------------------------------------------------------------
//                  GLOBAL VARIABLE DEFINITION
// ---------------------------------------------------------------------------

const appDebug = require('debug')('lotto:pbpro');

const DEFAULT_DATE = new Date('1969-01-01');

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
 * @param {object[]} data - Lottery data.
 * @returns {string} Date range.
 */
function getDateRange(data) {
  let start;
  let end;
  data.forEach(x => {
    const d = new Date(x['date']);
    if (!start || d < start) start = d;
    if (!end || d > end) end = d;
  });
  return `${start} to ${end}`
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
    x.white.forEach(ball => {
      if (ball in hot) hot[ball] += 1;
      else hot[ball] = 1;
    });
  });
  return Object.entries(hot).sort((a, b) => b[1] - a[1]);
}

/**
 * Calculate hottest hued balls.
 *
 * @param {object[]} numbers - Winning numbers.
 * @returns {object[]} Hued balls sorted by frequency.
 */
function findHotHuedNumbers(numbers) {
  const hot = {};
  numbers.forEach(x => {
    if (x.hued in hot) hot[x.hued] += 1;
    else hot[x.hued] = 1;
  });
  return Object.entries(hot).sort((a, b) => b[1] - a[1]);
}

/**
 * Calculate average odd and even balls per drawing.
 *
 * @param {object[]} numbers - Winning numbers.
 * @returns {string} Averages.
 */
function findOddEvenAverages(numbers) {
  let odds = 0;
  let evens = 0;
  numbers.forEach(x => {
    x.white.forEach(white => {
      if (isOddNumber(white)) odds += 1;
      else evens += 1;
    });
    if (isOddNumber(x.hued)) odds += 1;
    else evens += 1;
  });
  const l = numbers.length;
  return `Average ${odds/l} odd : ${evens/l} even`;
}

// ---------------------------------------------------------------------------
//                  FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Process and report on Mega Millions data.
 *
 * @param {object[]} data - Mega Millions data.
 * @param {Date|null} startFrom - Start date for analysis.
 * @returns {object} Report.
 */
function makeMMReport(data, startFrom = DEFAULT_DATE) {
  const balls = data
    .filter(x => {
      return stringToD(x['draw_date']) >= startFrom;
    })
    .map(x => {
      return {
        'date': x['draw_date'],
        'white': x['winning_numbers'].split(' ').slice(0, 5),
        'hued': x['mega_ball']
      };
    })
  return {
    dateRange: getDateRange(balls),
    totalDrawings: balls.length,
    whiteBalls: findHotWhiteNumbers(balls),
    goldBalls: findHotHuedNumbers(balls),
    oddEvenAvg: findOddEvenAverages(balls),
  };
}

/**
 * Process and report on Powerball data.
 *
 * @param {object[]} data - Powerball data.
 * @param {Date|null} startFrom - Start date for analysis.
 * @returns {object} Report.
 */
function makePBallReport(data, startFrom = DEFAULT_DATE) {
  const balls = data
    .filter(x => {
      return stringToD(x['draw_date']) >= startFrom;
    })
    .map(x => {
      return {
        'date': x['draw_date'],
        'white': x['winning_numbers'].split(' ').slice(0, 5),
        'hued': x['winning_numbers'].split(' ')[5],
      };
    })
  return {
    dateRange: getDateRange(balls),
    totalDrawings: balls.length,
    whiteBalls: findHotWhiteNumbers(balls),
    redBalls: findHotHuedNumbers(balls),
    oddEvenAvg: findOddEvenAverages(balls),
  };
}

// ---------------------------------------------------------------------------
//                  EXPORTS
// ---------------------------------------------------------------------------

exports.makeMMReport = makeMMReport;
exports.makePBallReport = makePBallReport;
exports.stringToD = stringToD;
