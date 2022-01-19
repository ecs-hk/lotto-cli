# lotto-cli

Simple and unsophisticated lottery analysis utility.

* For informational and entertainment purposes only.
* Not financial advice.
* [National Problem Gambling Helpline](https://www.ncpgambling.org/).

This utility requires [Node.js](https://nodejs.org/en/) and `bash` to work correctly.

## Powerball

Currently Powerball analysis is the only supported feature. The latest, continuously-updated source data for past Powerball winning numbers is provided by a [State of New York Open Data API](https://data.ny.gov/Government-Finance/Lottery-Powerball-Winning-Numbers-Beginning-2010/d6yy-54nr).

### Pre-flight setup

After cloning this repo:

1. At the root of the cloned repo, create an `.env` file
2. Create a [NY Open Data account](https://data.ny.gov/login) (it's easy)
3. Log in with your new account and "Create New App Token"
4. Copy your "App Token", and then paste it into your `.env` file along with the following:

```bash
POWERBALL_APP_TOKEN='your-app-token-goes-here'
POWERBALL_URI='https://data.ny.gov/resource/d6yy-54nr.json'
```

### Run it

Powerball report using all available data:

```bash
./bin/powerball print-hot-numbers
```

Powerball report using data from Oct. 1, 2018 onward:

```bash
./bin/powerball print-hot-numbers 2018-10-01
```

### Example data

Snippet with comments:

```
  # Numbers from 1,000 drawings were analyzed.
  totalDrawings: 1000,

  # In the analyzed data, the '23' white ball appeared 97 times;
  # the '32' white ball apeared 93 times; and so on.
  whiteBalls: [
    [ '23', 97 ], [ '32', 93 ], [ '28', 88 ], [ '54', 88 ],
    [ '39', 86 ], [ '21', 85 ], [ '03', 84 ], [ '08', 84 ],

  # In the analyzed data, the '24' red ball (i.e. the Powerball)
  # appeared 50 times; the '18' red ball appeared 45 times; etc.
  redBalls: [
    [ '24', 50 ], [ '18', 45 ], [ '19', 40 ],
    [ '17', 39 ], [ '10', 37 ], [ '13', 37 ],

  # In the analyzed data, the average number of odd white balls
  # for each drawing was 2.544; the average number of even white
  # balls for each drawing was 2.456. (Not very interesting, but
  # it does show that winning tickets tend to have a pretty even
  # mix of odd and even numbers.)
  oddEvenAvg: 'Average 2.544 odd : 2.456 even'
```

## Crypto love

If, for some inexplicable reason, you find this information useful, there is an XLM wallet that happily accepts inbound transfers:

`GBFJKUDOD5YER4TAMFFU5CAHY7OEQAUZYJSWRCRRGSGUERW6BRNNPXNF` (memo ID: `-`)
