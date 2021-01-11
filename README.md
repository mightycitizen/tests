# Mighty Citizen Testing Scripts

## Setup

Run `npm install` in this directory
The `urls.js` controls which pages and what site url to test against. All of the following testing suites allow for local urls to be tested.

## Percy Visual Regression Testing

### Setup
You'll need the Percy token from the Project Settings tab in Percy. Once you have it, you'll run `EXPORT PERCY_TOKEN=XXX` (where XXX is the token value from Percy.io)
### To run
`npm run percy` will create the build and push it to Percy.io.

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
