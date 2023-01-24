import { AccountInfo } from '../types';

export const getAccountInfo = (accounts: AccountInfo) => {
  const defaultAccountInfo = {
    address: '',
    publicKey: '',
    jwt: '',
    walletInfo: {},
    representedGroupPolicy: null,
  };

  if (!accounts || !Array.isArray(accounts) || !accounts.length)
    return defaultAccountInfo;
  const firstAccount = accounts[0];
  // Accounts can either be an array of strings or an array of objects
  // Check the first value in the array to determine to type of data
  const isString = typeof firstAccount === 'string';
  // If it's a string, return data in the form of [address, publicKey, lastConnectJWT] from accounts
  if (isString) {
    const [
      address = defaultAccountInfo.address,
      publicKey = defaultAccountInfo.publicKey,
      jwt = defaultAccountInfo.jwt,
    ] = accounts as string[];
    // No walletInfo will be available on the old accounts array
    return {
      address,
      publicKey,
      jwt,
      walletInfo: defaultAccountInfo.walletInfo,
      representedGroupPolicy: defaultAccountInfo.walletInfo,
    };
  }
  // Data is in an object, pull keys from first item
  const {
    address = defaultAccountInfo.address,
    publicKey = defaultAccountInfo.publicKey,
    jwt = defaultAccountInfo.jwt,
    walletInfo = defaultAccountInfo.walletInfo,
    representedGroupPolicy = defaultAccountInfo.representedGroupPolicy,
  } = firstAccount;
  return { address, publicKey, jwt, walletInfo, representedGroupPolicy };
};
