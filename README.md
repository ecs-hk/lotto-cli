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

### Run it

```bash
# Report on all available data
./bin/run-report mega-millions

# Report on data from Feb. 14, 2005 onward
./bin/run-report mega-millions 2005-02-14
```

## Powerball

Source data for Powerball winning numbers:
* https://data.ny.gov/Government-Finance/Lottery-Powerball-Winning-Numbers-Beginning-2010/d6yy-54nr

### Run it

```bash
# Report on all available data
./bin/run-report powerball

# Report on data from Oct. 1, 2018 onward
./bin/run-report powerball 2018-10-01
```

## Example report

Mega Millions report snippet with comments:

```
  # Winning numbers from 2,054 drawings were analyzed.
  totalDrawings: 2054,

  # In the analyzed data, the '31' white ball appeared 203 times;
  # the '10' white ball apeared 198 times; and so on.
  whiteBalls: [
    [ '31', 203 ], [ '10', 198 ], [ '17', 195 ], [ '14', 193 ],
    [ '20', 192 ], [ '48', 187 ], [ '46', 186 ], [ '39', 185 ],

  # The '10' gold ball (i.e. the Mega Ball) appeared 83 times;
  # the '15' gold ball appeared 78 times; etc.
  goldBalls: [
    [ '10', 83 ], [ '15', 78 ], [ '7', 76 ],  [ '9', 74 ],
    [ '13', 74 ], [ '11', 72 ], [ '3', 70 ],  [ '6', 69 ],

  # The range (i.e. the difference between the largest and smallest
  # winning number for a given drawing) min, max, and mean for white
  # balls only. It may make sense to choose numbers with ranges that
  # are within the min and max.
  whiteBallRange: 'Range min: 12, max: 74, mean: 42.02726387536514',

  # The average number of odd balls (of any color) for each drawing
  # was ~2.95; the average number of even balls for each drawing was
  # ~3.05. (Not super interesting, but it does show that winning
  # tickets tend to have a pretty even mix of odd and even numbers.)
  allBallOddEven: 'Mean 2.954722 odd balls : 3.045277 even balls',

  # The sum of all balls' min, max, and mean. It may make sense to
  # choose numbers with sums that are within the min and max.
  allBallSum: 'Sum min: 59, max: 322, mean: 174.8846153846154'
```

# Crypto love

If, for some inexplicable reason, you find this information useful, there is an XLM wallet that happily accepts inbound transfers:

`GBFJKUDOD5YER4TAMFFU5CAHY7OEQAUZYJSWRCRRGSGUERW6BRNNPXNF` (memo ID: `-`)
