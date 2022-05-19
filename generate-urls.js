var fs = require('fs');
var path = require('path');


const patternDir = '../src/_patterns/pages/';
let urls = []

const getFiles = (dir) => {
  fs.readdir(dir, (err, items) => {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const res = path.resolve(dir, item);

      fs.stat(res, function(err, stat) {
        if (stat && stat.isDirectory()) {
          getFiles(dir + item);
        } else {
          const extension = path.extname(res);
          const fileName = path.basename(res, extension);
          if (extension === '.twig' && fileName !== 'templates') {

            const parentDir = dir.replace(patternDir,'',).replace('/', '-');
            const path = (parentDir ? parentDir + '-' : '') + fileName;
            //console.log(dir.replace(patternDir,''));
            urls.push('pages-' + path + '/pages-'+ path + '.rendered.html');
            //pages-' + path + '/pages-'+ path + '.rendered.html
            //console.log(fileName);
            console.log(urls);
          }
        }
      });

    }

  });
}


getFiles(patternDir);
