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
  # Winning numbers from 2,051 drawings were analyzed.
  totalDrawings: 2051,

  # In the analyzed data, the '31' white ball appeared 203 times;
  # the '10' white ball apeared 198 times; and so on.
  whiteBalls: [
    [ '31', 203 ], [ '10', 198 ], [ '17', 195 ], [ '14', 193 ],
    [ '20', 192 ], [ '48', 187 ], [ '39', 185 ], [ '46', 185 ],

  # In the analyzed data, the '10' gold ball (i.e. the Mega Ball)
  # appeared 83 times; the '15' gold ball appeared 78 times; etc.
  goldBalls: [
    [ '10', 83 ], [ '15', 78 ], [ '7', 76 ],  [ '9', 74 ],
    [ '11', 72 ], [ '13', 72 ], [ '3', 70 ],  [ '6', 69 ],

  # In the analyzed data, the average number of odd balls (of any
  # color) for each drawing was ~2.95; the average number of even
  # balls for each drawing was ~3.05. (Not super interesting, but
  # it does show that winning tickets tend to have a pretty even
  # mix of odd and even numbers.)
  oddEvenAvg: 'Average 2.954168698196002 odd : 3.045831301803998 even'
```

# Crypto love

If, for some inexplicable reason, you find this information useful, there is an XLM wallet that happily accepts inbound transfers:

`GBFJKUDOD5YER4TAMFFU5CAHY7OEQAUZYJSWRCRRGSGUERW6BRNNPXNF` (memo ID: `-`)
