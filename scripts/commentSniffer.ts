const glob = require('glob');
const fs = require('fs');
const PrettyError = require('pretty-error');

const getDirectories = function (src, callback) {
  const res = glob.sync(src + '/**/*');
  callback(res);
};

const fileTypes = ['.ts', '.tsx', '.js', '.jsx'];
const comments = [
  'TEMP:',
  'TEMPONLY:',
  'TESTING:',
  'TEST:',
  'TESTONLY:',
  'TESTINGONLY:',
  'REMOVEME:',
  'REMOVE:',
  'HACK:',
];
const rootDirs = ['src', 'webDemo/src', 'README.md'];

const checkIfValidFile = function (fileSrc) {
  let valid = false;
  fileTypes.forEach((fileType) => {
    if (fileSrc.includes(fileType)) {
      valid = true;
    }
  });
  return valid;
}

const checkIfCommentMatches = function (fileData) {
  let commentExists = false;
  comments.forEach((comment) => {
    if (fileData.includes(comment)) {
      commentExists = true;
    }
  });
  return commentExists;
}

module.exports.commentSniffer = function () {
  const allErrors = [];
  rootDirs.forEach(rootDir => {
    getDirectories(rootDir, function (res) {
      // Look at each file
      res.forEach(fileLocation => {
        const valid = checkIfValidFile(fileLocation);
        if (valid) {
          const data = fs.readFileSync(fileLocation);
          const hasComment = checkIfCommentMatches(data);
          if (hasComment) {
            allErrors.push(fileLocation);
          }
        };
      });
    });
  })
  if (allErrors.length) {
    let message = 'Dev Local Only Comments Found!  Please Fix/Remove:\n --------------------------------------------------\n';
    allErrors.forEach(msg => {
      message += ` \n • ${msg}`;
    });
    const pe = new PrettyError();
    pe.appendStyle({
      'pretty-error > header > title > kind': { display: 'none' },
      'pretty-error > header > colon': { display: 'none' },
      'pretty-error > header > message': {
        color: 'bright-white',
        background: 'red',
        padding: '0 1',
      },
      'pretty-error > trace > item': { display: 'none' },
    });
    const renderedError = pe.render(new Error(message));
    console.log(renderedError);
    process.exit(1);
  }
};
