export const ADD_LOCATION = 'ADD_LOCATION';
export const ADD_LOCATION_ERROR = 'ADD_LOCATION_ERROR';
export const REMOVE_LOCATION = 'REMOVE_LOCATION';

export function setDefaultLocation({lat = null, lng = null, error = false} = {}) {
  let payload = { default: true, lat: lat, lng: lng };

  if (error) {
    payload.errorCode = error.code;

    switch (error.code) {
      case 1:
        payload.errorMessage = "We don't have permission to access you location";
        break;

      case 2:
      case 3:
        payload.errorMessage = 'Location not available in the moment';
        break;
    }

    return {
      type: ADD_LOCATION_ERROR,
      payload: payload
    };
  } else {
    return (dispatch, getState) => {
      console.log('aeooo pego')
      payload.name = 'GET API NIGGA';

      dispatch({
        type: ADD_LOCATION,
        payload: payload
      })
    };
  }
}

export function addLocation() {

}

export function removeLocation(locationId) {

}
