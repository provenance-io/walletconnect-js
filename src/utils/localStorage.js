// Get one or more values from localStorage
export const getFromLocalStorage = (name, key) => {
  // Look for the item in the current localStorage, if found, add to results
  const rawData = window.localStorage.getItem(name) || '{}';
  const data = JSON.parse(rawData);
  // If no specific key is passed, just return the entire object
  return key ? data[key] : data;
};

// Ability to add single or array of items into current localStorage
export const addToLocalStorage = (name, key, value) => {
  // Pull from localStorage
  const rawData = window.localStorage.getItem(name) || '{}';
  // Parse to edit
  const data = JSON.parse(rawData);
  // Update key/value
  data[key] = value;
  // Stringify to save
  const stringData = JSON.stringify(data);
  // Save
  window.localStorage.setItem(name, stringData);
};

// Clear out all of the current localStorage for a specific name
export const clearLocalStorage = (name) => {
  localStorage.removeItem(name);
};
