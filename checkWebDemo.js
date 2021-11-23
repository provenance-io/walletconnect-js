const fs = require('fs');

if (!fs.existsSync('./webDemo'))
  throw new Error(
    'Error: webDemo directory missing'
  );
