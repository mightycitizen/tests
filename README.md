# Mighty Citizen Testing Scripts

## Setup

Git clone this repository at the root of your project folder. Remove the .git folder once you have cloned the repo. 
Run `npm install` in the `tests` directory to install node modules. 

The `urls.js` controls which pages and what site url to test against. All of the following testing suites allow for local urls to be tested.

## Percy Visual Regression Testing
You'll need to get a percy token for this project first before you can run this

### To run
`npm run percy` (runs using snapshots via Cypress)

## Cypress Functional Testing
Tests are written in the `cypress/integration` folder

### To run

```npx cypress open```

## Axe Accessibility

### To run
`node pa11y.js`

## HTML Validation

### To run
`node validator.js`
