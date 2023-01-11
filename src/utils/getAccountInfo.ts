import { AccountInfo } from '../types';

export const getAccountInfo = (accounts: AccountInfo) => {
  if (!accounts || !Array.isArray(accounts) || !accounts.length) return {};
  const firstAccount = accounts[0];
  // Accounts can either be an array of strings or an array of objects
  // Check the first value in the array to determine to type of data
  const isString = typeof firstAccount === 'string';
  // If it's a string, return data in the form of [address, publicKey, lastConnectJWT] from accounts
  if (isString) {
    const [address, publicKey, jwt] = accounts as string[];
    // No walletInfo will be available on the old accounts array
    return {
      address,
      publicKey,
      jwt,
      walletInfo: {},
      representedGroupPolicy: null,
    };
  }
  // Data is in an object, pull keys from first item
  const {
    address,
    publicKey,
    jwt,
    walletInfo,
    representedGroupPolicy = null,
  } = firstAccount;
  return { address, publicKey, jwt, walletInfo, representedGroupPolicy };
};
