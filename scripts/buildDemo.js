// Clone the react example to build out the walletconnect demo app for deployment
module.exports.buildDemo = function () {
  // IMPORTS
  const { promises: fs } = require('fs');
  const path = require('path');
  // CONSTANTS
  const exampleDirectory = 'examples/example-react';
  const demoFileName = 'figure-tech-walletconnect';
  // FUNCTIONS
  async function copyDir(src, dest) {
    await fs.mkdir(dest, { recursive: true });
    let entries = await fs.readdir(src, { withFileTypes: true });

    for (let entry of entries) {
      let srcPath = path.join(src, entry.name);
      // Don't copy any node_modules
      if (!srcPath.includes('node_modules')) {
        let destPath = path.join(dest, entry.name);

        entry.isDirectory()
          ? await copyDir(srcPath, destPath)
          : await fs.copyFile(srcPath, destPath);
      }
    }
  }
  const cloneExampleApp = async () => {
    await copyDir(exampleDirectory, demoFileName);
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
