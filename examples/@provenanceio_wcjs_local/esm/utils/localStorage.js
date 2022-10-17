import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

// Get one or more values from localStorage
export var getFromLocalStorage = function getFromLocalStorage(name, key) {
  // Look for the item in the current localStorage, if found, add to results
  var rawData = window.localStorage.getItem(name) || '{}';
  var data = JSON.parse(rawData); // If no specific key is passed, just return the entire object

  return key ? data[key] : data;
}; // Ability to add single or array of items into current localStorage

export var addToLocalStorage = function addToLocalStorage(name, newData) {
  // eslint-disable-line @typescript-eslint/no-explicit-any
  // Pull from localStorage
  var rawData = window.localStorage.getItem(name) || '{}'; // Parse to edit

  var data = JSON.parse(rawData); // Update key/value

  var finalData = _objectSpread(_objectSpread({}, data), newData); // Stringify to save


  var stringFinalData = JSON.stringify(finalData); // Save

  window.localStorage.setItem(name, stringFinalData);
}; // Clear out all of the current localStorage for a specific name

export var clearLocalStorage = function clearLocalStorage(name) {
  localStorage.removeItem(name);
};