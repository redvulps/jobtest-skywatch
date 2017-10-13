import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import loggerMiddleware from 'redux-logger';
import locations from './locations';

const allReducers = combineReducers({
  locations
});

let middleware = [thunkMiddleware];

if (__DEV__) {
  middleware = [...middleware, loggerMiddleware];
} else {
  middleware = [...middleware];
}

export default function configureStore(initialState) {
  return createStore(
    allReducers,
    initialState,
    applyMiddleware(...middleware)
  );
}
