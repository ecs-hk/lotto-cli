'use strict';

// ---------------------------------------------------------------------------
//                  GLOBAL VARIABLE DEFINITION
// ---------------------------------------------------------------------------

const appDebug = require('debug')('lotto:pbpro');
const h = require('../helpers');

const DEFAULT_DATE = new Date('1969-01-01');

// ---------------------------------------------------------------------------
//                  HELPER FUNCTIONS
// ---------------------------------------------------------------------------

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
 * Calculate mean number of odd balls and even balls.
 *
 * @param {object[]} numbers - Winning numbers.
 * @returns {string} Mean information.
 */
function calculateOddEvenData(numbers) {
  let odds = 0;
  let evens = 0;
  numbers.forEach(x => {
    x.white.forEach(white => {
      if (h.isOddNumber(white)) odds += 1;
      else evens += 1;
    });
    if (h.isOddNumber(x.hued)) odds += 1;
    else evens += 1;
  });
  const l = numbers.length;
  return `Mean ${odds/l} odd balls : ${evens/l} even balls`;
}

/**
 * Calculate white balls range (diff between highest and lowest number).
 *
 * @param {object[]} numbers - Winning numbers.
 * @returns {string} Range information.
 */
function calculateRangeData(numbers) {
  const ranges = numbers.map(x => h.range(x.white));
  const min = Math.min(...ranges);
  const max = Math.max(...ranges);
  const mean = h.sum(ranges) / ranges.length;
  return `Range min: ${min}, max: ${max}, mean: ${mean}`;
}

/**
 * Calculate all balls sum (adding winning numbers together).
 *
 * @param {object[]} numbers - Winning numbers.
 * @returns {string} Mean information.
 */
function calculateSumData(numbers) {
  const sums = numbers.map(x => h.sum([x.white, x.hued].flat()));
  const min = Math.min(...sums);
  const max = Math.max(...sums);
  const mean = h.sum(sums) / numbers.length;
  return `Sum min: ${min}, max: ${max}, mean: ${mean}`;
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
      return h.stringToD(x['draw_date']) >= startFrom;
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
    whiteBallRange: calculateRangeData(balls),
    allBallOddEven: calculateOddEvenData(balls),
    allBallSum: calculateSumData(balls),
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
      return h.stringToD(x['draw_date']) >= startFrom;
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
    whiteBallRange: calculateRangeData(balls),
    allBallOddEven: calculateOddEvenData(balls),
    allBallSum: calculateSumData(balls),
  };
}

// ---------------------------------------------------------------------------
//                  EXPORTS
// ---------------------------------------------------------------------------

exports.makeMMReport = makeMMReport;
exports.makePBallReport = makePBallReport;
