# Provenance.io | WalletConnect-JS | WebDemo

## Run a web demo straight from this application to test out new and existing features of the parent walletconnect-js module

### Get Started:
 * The following is a one time setup to get a local working environment

1) Run `npm i` within the `walletconnect-js`
  - Note: This should run a build and create 3 untracked folders, `esm`, `lib`, and `node_modules`
2) Navigate to `walletconnect-js` and run `npm i` while in this folder
  - Note: This will create a new untracked `node_modules` folder
3) Start the local app with `npm run start`
  - Note: If it doesn't automatically, navigate to `http://localhost:3000/walletconnect`

* At this point, any changes you make to the walletconnect-js files should be visible in the webDemo application
  - The webDemo links to the parent folder similar to how `npm link` works.  Look within `package.json` for more information.
