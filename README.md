# Mighty Citizen Testing Scripts

## Setup

The `urls.js` controls which pages and what site url to test against. All of the following testing suites allow for local urls to be tested.

## Percy Visual Regression Testing
You'll need to get a percy token for this project first before you can run this

### To run
`npm run percy` (runs using snapshots via Cypress)

## Cypress Functional Testing
Tests are written in the `cypress/integration` folder

### To run

```npx cypress open```

### Axe Accessibility

Axe accessibility testing is run through Cypress - run the command above and then choose the a11y script. Cypress will show which templates have errors.

## HTML Validation

### To run
Run `npm run validation` in command line in this `test` folder. Results will output in the `validator` folder.
