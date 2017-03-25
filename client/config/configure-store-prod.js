import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';

const rootReducer = require('../reducers');

const createStoreWithMiddleware = compose(
  applyMiddleware(thunk)(createStore)
);

module.exports = function configure(initialState) {

  // Create the redux store and add middleware to it
  const store = createStoreWithMiddleware(rootReducer, initialState);

  return store;
};
