const PercyScript = require('@percy/script');
const fs          = require('fs');

const { baseUrl, urls } = require('./urls');
for (const path of urls) {
  PercyScript.run( async (page, percySnapshot) => {
    const url = baseUrl + path;
    await page.goto(url);
    await page.waitFor(5000);

    let percyOptions = {};
    await percySnapshot(path, percyOptions);
  });
}
