import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

const rootReducer = require('../reducers');

// Configure the logger middleware
const logger = createLogger({
  level: 'info',
  collapsed: true,
});

const createStoreWithMiddleware = compose(
  applyMiddleware(thunk, logger)(createStore)
);

module.exports = function configure(initialState) {

  // Create the redux store and add middleware to it
  const store = createStoreWithMiddleware(rootReducer, initialState);

  //Snippet to allow hot reload to work with reducers
  if(module.hot) {
    module.hot.accept(function _() {
      store.replaceReducer(rootReducer);
    });
  }

  return store;
};
