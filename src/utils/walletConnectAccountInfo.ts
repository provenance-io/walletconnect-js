import type {
  AccountAttribute,
  WalletConnectAccountInfo,
  WalletInfo,
} from '../types';

export const walletConnectAccountInfo = (accounts: WalletConnectAccountInfo) => {
  const defaultAccountInfo = {
    address: '',
    attributes: [] as AccountAttribute[],
    jwt: '',
    publicKey: '',
    representedGroupPolicy: undefined,
    walletInfo: {} as WalletInfo,
  } as const;

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
      attributes: defaultAccountInfo.attributes,
      publicKey,
      jwt,
      walletInfo: defaultAccountInfo.walletInfo,
      representedGroupPolicy: defaultAccountInfo.representedGroupPolicy,
    };
  }
  // Data is in an object, pull keys from first item
  const {
    address = defaultAccountInfo.address,
    attributes = defaultAccountInfo.attributes,
    publicKey = defaultAccountInfo.publicKey,
    jwt = defaultAccountInfo.jwt,
    walletInfo = defaultAccountInfo.walletInfo,
    representedGroupPolicy = defaultAccountInfo.representedGroupPolicy,
  } = firstAccount;
  return { address, attributes, publicKey, jwt, walletInfo, representedGroupPolicy };
};
