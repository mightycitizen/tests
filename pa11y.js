const pa11y = require('pa11y');
const fs          = require('fs');
const rimraf      = require('rimraf');

const { baseUrl, urls } = require('./urls');
const runPa11y = async (path, index) => {
    const url = baseUrl + path;

    const results = await pa11y(url, {
      runners: [
          'axe'
      ]
    });
    let fileName = path.replace(/\//g, '-');
    if (fileName === "") fileName = "home";
    let violations = results.issues.filter(issue => {
      return issue.type === 'error' && ['serious','critical'].includes(issue.runnerExtras.impact)
    });
    if (violations.length > 0){
      fs.writeFile('./pa11y/'+index+'-'+fileName+'.json', JSON.stringify(violations, null, 4), err => {
        if (err) {
          console.error(err)
          return
        }
        //file written successfully
      })
    }

}


const runPa11yTests = () => {
  let index = 0;
  for (const path of urls) {
      runPa11y(path, index);
      index++;
  }

}
rimraf('./pa11y/*', runPa11yTests);
