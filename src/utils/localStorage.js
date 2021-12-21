// Get one or more values from sessionStorage
export const getFromLocalStorage = key => {
  // Look for the item in the current session, if found, add to results
  const data = window.localStorage.getItem(key);
  return data ? JSON.parse(data) : {};
};
