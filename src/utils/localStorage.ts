import { LOCAL_STORAGE_NAMES } from '../consts';
import { WalletConnectClientType, WCJSLocalState } from '../types';

type StorageKeys = keyof typeof LOCAL_STORAGE_NAMES;
type StorageName = typeof LOCAL_STORAGE_NAMES[StorageKeys];

// Get one or more values from localStorage
export const getFromLocalStorage = (name: StorageName, key?: string) => {
  // Look for the item in the current localStorage, if found, add to results
  const rawData = window.localStorage.getItem(name) || '{}';
  const data = JSON.parse(rawData);
  // If no specific key is passed, just return the entire object
  return key ? data[key] : data;
};

// Pull out specific wc and wcjs localStorageValues
export const getLocalStorageValues = () => {
  // Check for existing values from localStorage
  const existingWCState: WalletConnectClientType = getFromLocalStorage(
    LOCAL_STORAGE_NAMES.WALLETCONNECT
  );
  const existingWCJSState: WCJSLocalState = getFromLocalStorage(
    LOCAL_STORAGE_NAMES.WALLETCONNECTJS
  );
  return { existingWCState, existingWCJSState };
};

// Ability to add single or array of items into current localStorage
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const addToLocalStorage = (name: StorageName, newData: any) => {
  // Pull from localStorage
  const rawData = window.localStorage.getItem(name) || '{}';
  // Parse to edit
  const data = JSON.parse(rawData);
  // Update key/value
  const finalData = { ...data, ...newData };
  // Stringify to save
  const stringFinalData = JSON.stringify(finalData);
  // Save
  window.localStorage.setItem(name, stringFinalData);
};

// Clear out all of the current localStorage for a specific name
export const clearLocalStorage = (name: StorageName) => {
  localStorage.removeItem(name);
};
