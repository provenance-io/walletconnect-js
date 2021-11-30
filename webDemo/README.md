# Provenance.io | WalletConnect-JS | WebDemo

## Run a web demo straight from this application to test out new and existing features of the parent walletconnect-js module

### Get Started:

1) Run `npm i` within the `walletconnect-js`
  - Note:
    - This should run a build and create 3 untracked folders within the base directory, `esm`, `lib`, and `node_modules`
2) Run `npm run start` to run a file watch + local server with webDemo.
  - Note:
    - It will also build the untracked `node_modules` folder within this directory `/webDemo`
    - If it doesn't automatically, navigate to `http://localhost:3000/walletconnect`

* At this point, any changes you make to the walletconnect-js files should kick off a rebuilt and be visible in the webDemo application
  - The webDemo links to the parent folder similar to how `npm link` works.  Look within `package.json` for more information.
