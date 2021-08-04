# Mighty Citizen Testing Scripts

## Setup

Clone this repo in your project `git clone git@github.com:mightycitizen/tests.git`

Remove the .git repo from the tests folder and install necessary node modules:
```
cd tests
rm -rf .git
npm install
```

The `urls.js` controls which pages and what site url to test against. All of the following testing suites allow for local urls to be tested.

## Percy Visual Regression Testing
You'll need to get a percy token for this project first before you can run this - to get a token, go to your Percy account, find the project (or create the project), then go to project settings. You'll find a PERCY_TOKEN there. Before running any Percy commands, you'll need to run

```EXPORT PERCY_TOKEN=[TOKEN HERE]```


### To run
`npm run percy` (runs using snapshots via Cypress)

## Cypress Functional Testing
Tests are written in the `cypress/integration` folder

### To run

```npx cypress open```

### Axe Accessibility

Axe accessibility testing is run through Cypress - run `npx cypress open` and then choose the `a11y.js` script. Cypress will show which templates have errors. If you have the javascript console open, and click the error, it'll give you more details (the testing has to be finished or stopped in order to do this).

## HTML Validation

### To run
Run `npm run validation` in command line in this `test` folder. Results will output in the `validator` folder.

### Alternate Cypress Validation
Validation testing can also be run through Cypress, which may be more accurate since it's run through browser emulation - run `npx cypress open` and then choose the `validation.js` script. Cypress will show which templates have errors. If you have the javascript console open, and click the error, it'll give you more details (the testing has to be finished or stopped in order to do this).

