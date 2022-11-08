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

/**
 * Create pool of numbers that repeat n times, based on their count.
 *
 * @param {object[]} numbers - Winning numbers.
 * @returns {string[]} Expanded pool of repeating numbers.
 */
function makePool(numbers) {
  // In the finished pool, if ball '8' has a historical count of 100, then
  // ball '8' will be repeated 100 times. This means the odds of it being
  // selected "randomly" later are higher than a different ball with an
  // historical count of only 50.
  const pool = [];
  for (const pair of numbers) {
    const ball = pair[0];
    const count = pair[1];
    for(let i = 0; i < count; i++) {
      pool.push(ball);
    }
  }
  return pool;
}

/**
 * Select one or more unique elements randomly from an array.
 *
 * @param {string[]} a - Arbitrary array.
 * @param {number|null} n - Number of elements to select.
 * @returns {string[]} Selected elements.
 */
function selectUniqRandoElements(a, n = 1) {
  const maxIterations = 9999999;
  const selections = new Set();
  for (let i = 0; i < maxIterations; i++) {
    if (selections.size === n) {
      return Array.from(selections);
    }
    selections.add(a[Math.floor(Math.random() * a.length)]);
  }
  throw new Error(`Too costly to select ${n} unique/random elements`);
}

// ---------------------------------------------------------------------------
//                  FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Extract data per start date, and prepare Mega Millions balls.
 *
 * @param {object[]} data - Mega Millions data.
 * @param {Date} d - Start date.
 * @returns {object} Formatted balls.
 */
function prepMMBalls(data, d) {
  return data
    .filter(x => {
      return h.stringToD(x['draw_date']) >= d;
    })
    .map(x => {
      return {
        'date': x['draw_date'],
        'white': x['winning_numbers'].split(' ').slice(0, 5),
        'hued': x['mega_ball']
      };
    });
}

/**
 * Extract data per start date, and prepare Powerball balls.
 *
 * @param {object[]} data - Powerball data.
 * @param {Date} d - Start date.
 * @returns {object} Formatted balls.
 */
function prepPBallBalls(data, d) {
  return data
    .filter(x => {
      return h.stringToD(x['draw_date']) >= d;
    })
    .map(x => {
      return {
        'date': x['draw_date'],
        'white': x['winning_numbers'].split(' ').slice(0, 5),
        'hued': x['winning_numbers'].split(' ')[5],
      };
    });
}

/**
 * Process and report on Mega Millions data.
 *
 * @param {object[]} data - Mega Millions data.
 * @param {Date|null} startFrom - Start date for analysis.
 * @returns {object} Report.
 */
function makeMMReport(data, startFrom = DEFAULT_DATE) {
  const balls = prepMMBalls(data, startFrom);
  const white = findHotWhiteNumbers(balls);
  const gold = findHotHuedNumbers(balls);
  return {
    dateRange: getDateRange(balls),
    totalDrawings: balls.length,
    whiteBalls: white,
    goldBalls: gold,
    whiteBallRange: calculateRangeData(balls),
    allBallOddEven: calculateOddEvenData(balls),
    allBallSum: calculateSumData(balls),
    luckyFunPick: {
      white: selectUniqRandoElements(makePool(white), 5),
      gold: selectUniqRandoElements(makePool(gold), 1),
    },
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
  const balls = prepPBallBalls(data, startFrom);
  const white = findHotWhiteNumbers(balls);
  const red = findHotHuedNumbers(balls);
  return {
    dateRange: getDateRange(balls),
    totalDrawings: balls.length,
    whiteBalls: white,
    redBalls: red,
    whiteBallRange: calculateRangeData(balls),
    allBallOddEven: calculateOddEvenData(balls),
    allBallSum: calculateSumData(balls),
    luckyFunPick: {
      white: selectUniqRandoElements(makePool(white), 5),
      red: selectUniqRandoElements(makePool(red), 1),
    },
  };
}

// ---------------------------------------------------------------------------
//                  EXPORTS
// ---------------------------------------------------------------------------

exports.makeMMReport = makeMMReport;
exports.makePBallReport = makePBallReport;
