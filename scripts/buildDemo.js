// Clone the react example to build out the walletconnect demo app for deployment
module.exports.buildDemo = function () {
  // IMPORTS
  const fs = require('fs');
  const path = require('path');
  // CONSTANTS
  const exampleDirectory = 'examples/example-react';
  const demoFileName = 'figure-tech-walletconnect';
  const packageJsonFile = require(`../${exampleDirectory}/package.json`);
  const version = packageJsonFile.version;
  // FUNCTIONS
  async function copyDir(src, dest) {
    await fs.promises.mkdir(dest, { recursive: true });
    let entries = await fs.promises.readdir(src, { withFileTypes: true });

    for (let entry of entries) {
      let srcPath = path.join(src, entry.name);
      // Don't copy any node_modules
      if (!srcPath.includes('node_modules')) {
        let destPath = path.join(dest, entry.name);

        entry.isDirectory()
          ? await copyDir(srcPath, destPath)
          : await fs.promises.copyFile(srcPath, destPath);
      }
    }
  }

  // Change package.json to use latest version value (both example and wcjs use same version)
  const updatePackageJson = async () => {
    const regularExpressionStartScript = /"start":(.+),/i;
    const regularExpressionWcjsPackage = /"@provenanceio\/walletconnect-js":(.+),/i;
    const packageLocations = ['package.json', 'package-lock.json'];

    // Loop through each package location to update the wcjs import
    packageLocations.forEach((packageLocation) => {
      const packageFileData = fs.readFileSync(
        `${exampleDirectory}/${packageLocation}`,
        'utf-8'
      );
      if (packageFileData) {
        let updatedPackageData = '';
        // find the package import and update the version
        updatedPackageData = packageFileData.replace(
          regularExpressionWcjsPackage,
          `"@provenanceio/walletconnect-js": "${version}",`
        );
        if (packageLocation.includes('package.json')) {
          // find the start script and update it
          updatedPackageData = updatedPackageData.replace(
            regularExpressionStartScript,
            `"start": "react-scripts start",`
          );
        }
        fs.writeFileSync(`${demoFileName}/${packageLocation}`, updatedPackageData);
      }
    });

    return;
  };

  const cloneExampleApp = async () => {
    await copyDir(exampleDirectory, demoFileName);
    await updatePackageJson();
    return;
  };
  // INIT
  cloneExampleApp();
};

/*
  DIFFERENCES BETWEEN EXAMPLE APP AND DEMO APP:
  - Package.json
    - "@provenanceio/walletconnect-js" import version needs to match wcjs latest version
*/
