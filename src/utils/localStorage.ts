// Get one or more values from localStorage
export const getFromLocalStorage = (name: string, key: string) => {
  // Look for the item in the current localStorage, if found, add to results
  const rawData = window.localStorage.getItem(name) || '{}';
  const data = JSON.parse(rawData);
  // If no specific key is passed, just return the entire object
  return key ? data[key] : data;
};

// Ability to add single or array of items into current localStorage
export const addToLocalStorage = (name: string, newData: any) => {
  // Pull from localStorage
  const rawData = window.localStorage.getItem(name) || '{}';
  // Parse to edit
  const data = JSON.parse(rawData);
  // Update key/value
  const finalData = {...data, ...newData};
  // Stringify to save
  const stringFinalData = JSON.stringify(finalData);
  // Save
  window.localStorage.setItem(name, stringFinalData);
};

// Clear out all of the current localStorage for a specific name
export const clearLocalStorage = (name: string) => {
  localStorage.removeItem(name);
};
