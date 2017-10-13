import uuidv4 from 'uuid/v4';
import { REHYDRATE } from 'redux-persist/constants';
import {
  ADD_LOCATION,
  ADD_LOCATION_ERROR,
  REMOVE_LOCATION
} from '../actions/locations';

const initialState = {
  locations: [],
  lastApiCall: null,
  hasDefaultBefore: false,
  defaultLocationError: false,
  defaultLocationErrorMessage: null,
  shouldRequestForGeolocationPermission: false
};

export default function(state = initialState, action) {
  const cloneState = (defaults = {}) => Object.assign({}, state, defaults);
  const payload = action && action.payload;
  let newState;

  switch(action.type) {
    case ADD_LOCATION:
      const defaultLocationAt = state.locations.findIndex((location) => location.default)
      newState = cloneState({ shouldRequestForGeolocationPermission: false });
      payload.id = uuidv4();

      if (defaultLocationAt != -1 && payload.default) {
        newState.locations[defaultLocationAt] = payload;
        newState.hasDefaultBefore = true;
        newState.defaultLocationError = false;
        newState.defaultLocationErrorMessage = null;
      } else {
        newState.locations = newState.locations.concat([payload]);
      }

      break;

    case ADD_LOCATION_ERROR:
      newState = cloneState({
        defaultLocationError: true,
        defaultLocationErrorMessage: payload.errorMessage,
        hasDefaultBefore: !!state.locations.findIndex((location) => location.default),
        shouldRequestForGeolocationPermission: payload.errorCode == 1
      });

      break;
    case REMOVE_LOCATION:
      newState = cloneState();
      newState.locations.splice(payload, 1);

      break;

    case REHYDRATE:
      if (payload.locations) {
        newState = payload.locations;
      }
  }

  if (newState) {
    return newState;
  } else {
    return state;
  }
}
