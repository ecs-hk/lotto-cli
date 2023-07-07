# lotto-cli

Simple and unsophisticated lottery analysis utility.

* For informational and entertainment purposes only.
* Not financial advice.
* [National Problem Gambling Helpline](https://www.ncpgambling.org/).

This utility requires [Node.js](https://nodejs.org/en/) and `bash` to work correctly.

## Pre-flight setup

After cloning this repo:

1. At the root of the cloned repo, create an `.env` file
2. Sign up for a [NY Open Data account](https://data.ny.gov/login) (it's easy)
3. Using your new account, access [Developer Settings](https://data.ny.gov/profile/edit/developer_settings) and "Create New App Token"
4. Copy your "App Token", and then paste it into your `.env` file along with the following:

```bash
NYDATA_APP_TOKEN='your-app-token-here'
MEGA_MILLIONS_URI='https://data.ny.gov/resource/5xaw-6ayf.json'
POWERBALL_URI='https://data.ny.gov/resource/d6yy-54nr.json'
```

## Mega Millions

Source data for Mega Millions winning numbers:
* https://data.ny.gov/Government-Finance/Lottery-Mega-Millions-Winning-Numbers-Beginning-20/5xaw-6ayf

**NB**: Mega Millions changed the ball ranges on Oct. 31, 2017

### Run it

```bash
# Report on all available data (across range changes)
./bin/run-report mega-millions

# Report on data from Oct. 31, 2017 onward
./bin/run-report mega-millions 2017-10-31
```

## Powerball

Source data for Powerball winning numbers:
* https://data.ny.gov/Government-Finance/Lottery-Powerball-Winning-Numbers-Beginning-2010/d6yy-54nr

**NB**: Powerball changed the ball ranges on Oct. 4, 2015

### Run it

```bash
# Report on all available data (across range changes)
./bin/run-report powerball

# Report on data from Oct. 4, 2015 onward
./bin/run-report powerball 2015-10-04
```

## Example report

Mega Millions report snippet with comments:

```
  dateRange: 'Tue Oct 31 2017 to Fri Nov 04 2022',

  # Winning numbers from 524 drawings were analyzed.
  totalDrawings: 524,

  # In the analyzed data, the '14' white ball appeared 50 times;
  # the '17' white ball apeared 50 times; and so on.
  whiteBalls: [
    [ '14', 50 ], [ '17', 50 ], [ '10', 49 ], [ '31', 48 ],

  # The '22' gold ball (i.e. the Mega Ball) appeared 31 times;
  # the '11' gold ball appeared 26 times; etc.
  goldBalls: [
    [ '22', 31 ], [ '11', 26 ], [ '10', 25 ],

  # The range (i.e. the difference between the largest and smallest
  # winning number for a given drawing) min, max, and mean for white
  # balls only. It may make sense to choose numbers with ranges that
  # are within the min and max.
  whiteBallRange: 'Range min: 12, max: 69, mean: 47.12022900763359',

  # The average number of odd balls (of any color) for each drawing was
  # ~2.9; the average number of even balls for each drawing was ~3.1.
  allBallOddEven: 'Mean 2.898854961832061 odd balls : 3.101145038167939 even balls',

  # The sum of all balls' min, max, and mean. It may make sense to
  # choose numbers with sums that are within the min and max.
  allBallSum: 'Sum min: 70, max: 291, mean: 186.61641221374046',

  # Lucky fun pseudo-random pick. For informational and entertainment
  # purposes only.
  luckyFunPick: { white: [ '51', '38', '02', '15', '18' ], gold: [ '18' ] }
```

