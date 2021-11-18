import { applyMiddleware, createStore, combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';
import { rootReducer } from 'redux/reducers';

const middleware = [thunk];

let composeEnhancers = compose;

if (process.env.REACT_APP_ENV !== 'production') {
  /* eslint-disable no-underscore-dangle */
  // Note: Really awesome Redux dev tools for Chrome - https://github.com/zalmoxisus/redux-devtools-extension
  if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({});
  }
  /* eslint-enable no-underscore-dangle */
}

const enhancers = [];
const composedEnhancers = composeEnhancers(applyMiddleware(...middleware), ...enhancers);
export const store = createStore(combineReducers({ ...rootReducer }), composedEnhancers);
