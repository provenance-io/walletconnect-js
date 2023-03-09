module.exports.versionUp = function () {
  const fs = require('fs');
  const { Select } = require('enquirer');
  const PrettyError = require('pretty-error');

  // npm_package_version comes from package.json "version"
  // Pull the app version and apply it to other files in this repo as needed
  const APP_VERSION = process.env.npm_package_version;
  const APP_NAME = process.env.npm_package_name;

  const regularExpressionMatch = /"version":(.+),|version:(.+),/i;
  const filesToChange = [
    'examples/example-react/package.json',
    'examples/example-js-es6/package.json',
    'examples/example-react-vite/package.json',
    'package.json',
  ];

  // Style the look of the console logs/message output
  const createPrettyError = function (
    message,
    bgColor = 'red',
    textColor = 'bright-white'
  ) {
    /*
    type PrettyErrorColors =
    'black' | 'red' | 'green' | 'yellow' | 'blue' |
    'magenta' | 'cyan' | 'white' | 'grey' | 'bright-red' |
    'bright-green' | 'bright-yellow' | 'bright-blue' |
    'bright-magenta' | 'bright-cyan' | 'bright-white';
  */

    const pe = new PrettyError();
    const peGenericStyle = {
      'pretty-error > header > title > kind': { display: 'none' },
      'pretty-error > header > colon': { display: 'none' },
      'pretty-error > trace > item': { display: 'none' },
    };
    pe.appendStyle({
      ...peGenericStyle,
      'pretty-error > header > message': {
        color: textColor,
        background: bgColor,
        padding: '0 1',
      },
    });
    const renderedError = pe.render(new Error(message));
    console.log(renderedError);
  };

  const init = function () {
    const currentVersionSplit = APP_VERSION.split('.');
    let versionMajor = Number(currentVersionSplit[0]);
    let versionMinor = Number(currentVersionSplit[1]);
    let versionPatch = Number(currentVersionSplit[2]);
    let finalVersion = APP_VERSION;
    createPrettyError(
      `-------------------------------------------------------- \n Current ${APP_NAME} version is ${APP_VERSION}   \n --------------------------------------------------------`,
      'cyan'
    );
    // Prompt the user to determine what kind of version up this is (major, minor, or patch)
    const prompt = new Select({
      name: 'versionType',
      message: 'Select the version type',
      choices: ['Major', 'Minor', 'Patch', 'Cancel'],
    });
    prompt
      .run()
      .then((answer) => {
        switch (answer) {
          case 'Major':
            finalVersion = `${versionMajor + 1}.0.0`;
            break;
          case 'Minor':
            finalVersion = `${versionMajor}.${versionMinor + 1}.0`;
            break;
          case 'Patch':
            finalVersion = `${versionMajor}.${versionMinor}.${versionPatch + 1}`;
            break;
          default:
            break;
        }
        if (answer !== 'Cancel') {
          // Loop through each file location
          filesToChange.forEach((fileLocation) => {
            // Get all data as string from file location
            const data = fs.readFileSync(fileLocation, 'utf-8');
            // data is a string containing the fields we want to change
            // find the fields and change them
            const updatedData = data.replace(
              regularExpressionMatch,
              `"version": "${finalVersion}",`
            );
            fs.writeFileSync(fileLocation, updatedData);
            createPrettyError(`Changed version within "${fileLocation}"`, 'blue');
          });
          createPrettyError(
            `--------------------------------------------------- \n New ${APP_NAME} version is now ${finalVersion}   \n ---------------------------------------------------`,
            'green'
          );
        } else {
          createPrettyError(
            'Version change canceled, no files/versions changed',
            'yellow'
          );
        }
      })
      .catch(console.error);
  };
  init();
};
