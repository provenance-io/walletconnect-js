import { LOCALSTORAGENAME } from '../consts';

// Get one or more values from sessionStorage
export const getFromLocalStorage = (key) => {
  // Look for the item in the current session, if found, add to results
  const rawData = window.localStorage.getItem(LOCALSTORAGENAME) || '{}';
  const data = JSON.parse(rawData);
  // If no specific key is passed, just return the entire object
  return key ? data[key] : data;
};

// Ability to add single or array of items into current session
export const addToLocalStorage = (key, value) => {
  // Pull from session
  const rawData = window.localStorage.getItem(LOCALSTORAGENAME) || '{}';
  // Parse to edit
  const data = JSON.parse(rawData);
  // Update key/value
  data[key] = value;
  // Stringify to save
  const stringData = JSON.stringify(data);
  // Save
  window.localStorage.setItem(LOCALSTORAGENAME, stringData);
};
