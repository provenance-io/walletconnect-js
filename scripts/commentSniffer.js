'use strict';
exports.__esModule = true;
module.exports.commentSniffer = function () {
  var glob = require('glob'); // eslint-disable-line @typescript-eslint/no-var-requires
  var fs = require('fs'); // eslint-disable-line @typescript-eslint/no-var-requires
  var PrettyError = require('pretty-error'); // eslint-disable-line @typescript-eslint/no-var-requires
  var getDirectories = function (src, callback) {
    var res = glob.sync(src + '/**/*');
    callback(res);
  };
  var fileTypes = ['.ts', '.tsx', '.js', '.jsx', '.md', '.mdx'];
  var comments = [
    '// TEMP:',
    '// TEMPONLY:',
    '// TESTING:',
    '// TEST:',
    '// TESTONLY:',
    '// TESTINGONLY:',
    '// REMOVEME:',
    '// REMOVE:',
    '// HACK:',
  ];
  var rootDirs = ['src', 'webDemo/src'];
  var checkIfValidFile = function (fileSrc) {
    var valid = false;
    fileTypes.forEach(function (fileType) {
      if (fileSrc.includes(fileType)) {
        valid = true;
      }
    });
    return valid;
  };
  var checkIfCommentMatches = function (fileData) {
    var commentExists = false;
    comments.forEach(function (comment) {
      if (fileData.includes(comment)) {
        commentExists = true;
      }
    });
    return commentExists;
  };
  var runSniffer = function () {
    var allErrors = [];
    rootDirs.forEach(function (rootDir) {
      getDirectories(rootDir, function (res) {
        // Look at each file
        res.forEach(function (fileLocation) {
          var valid = checkIfValidFile(fileLocation);
          if (valid) {
            var data = fs.readFileSync(fileLocation);
            var hasComment = checkIfCommentMatches(data);
            if (hasComment) {
              allErrors.push(fileLocation);
            }
          }
        });
      });
    });
    if (allErrors.length) {
      var message_1 =
        'Dev Local Only Comments Found!  Please Fix/Remove:\n --------------------------------------------------\n';
      allErrors.forEach(function (msg) {
        message_1 += ' \n \u2022 '.concat(msg);
      });
      var pe = new PrettyError();
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
      var renderedError = pe.render(new Error(message_1));
      console.log(renderedError); // eslint-disable-line no-console
      process.exit(1);
    } else {
      var pe = new PrettyError();
      pe.appendStyle({
        'pretty-error > header > title > kind': { display: 'none' },
        'pretty-error > header > colon': { display: 'none' },
        'pretty-error > header > message': {
          color: 'bright-white',
          background: 'green',
          padding: '0 1',
        },
        'pretty-error > trace > item': { display: 'none' },
      });
      var renderedSuccess = pe.render(new Error('All comment checks passed'));
      console.log(renderedSuccess); // eslint-disable-line no-console
    }
  };
  runSniffer();
};
