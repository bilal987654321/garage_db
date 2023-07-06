const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const validateTelephone = (phone) => {
    return String(phone)
      .toLowerCase()
      .match(
        /^(0[1-9]([-. ]?[0-9]{2}){4})$/
      );
  };

  
function move(oldPath, newPath) {
  const fs = require('fs')

  fs.rename(oldPath, newPath, function (err) {
      if (err) {
          if (err.code === 'EXDEV') {
              copy();
          } else {
              console.log(err);
          }
          return;
      }
  });

  function copy() {
      var readStream = fs.createReadStream(oldPath);
      var writeStream = fs.createWriteStream(newPath);

      readStream.on('error');
      writeStream.on('error');

      readStream.on('close', function () {
          fs.unlink(oldPath);
      });

      readStream.pipe(writeStream);
  }
}

  
function extractParamsFromObject(body, ...params){
  let res = {};
  params.forEach(param => {
    res[param] = body[param];
  });
  return res;
}

module.exports = {
  validateEmail,
  validateTelephone,
  extractParamsFromObject,
  move
}