const validator = require('html-validator');
const fs          = require('fs');
const rimraf      = require('rimraf');

const { baseUrl, urls } = require('./urls');
const validate = async (path, index) => {

    const queryString =  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const options = {
      url: baseUrl + path + "?v=" + queryString,
      format: 'json',
      isLocal: true
    }



    try {
      const results = await validator(options)
      let fileName = path.replace(/\//g, '-');
      if (fileName === "") fileName = "home";

      let violations = results.messages.filter(message => {
        //console.log(message);
        return message.type === 'error' && message.message !== 'Element “img” is missing required attribute “src”.'
      });

      if (violations.length > 0){
        fs.writeFile('./validator/'+index+'-'+fileName+'.json', JSON.stringify(violations, null, 4), err => {
          if (err) {
            console.error(err)
            return
          }
          //file written successfully
        })
      }

    } catch (error) {
      console.error(error)
    }

}


const runValidation = () => {
  let index = 0;
  for (const path of urls) {
      validate(path, index);
      index++;
  }

}

rimraf('./validator/*', runValidation);
