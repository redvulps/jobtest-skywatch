export const ADD_LOCATION = 'ADD_LOCATION';
export const ADD_LOCATION_ERROR = 'ADD_LOCATION_ERROR';
export const REMOVE_LOCATION = 'REMOVE_LOCATION';

function reverseGeocode(lat, lng, callback) {
  fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&sensor=true`)
    .then((response) => response.json())
    .then((responseJSON) => {
      callback(responseJSON.results[0]);
    })
    .catch((error) => {
      console.log(error)
      callback(null, error);
    });
}

function getWeatherFromLocation(locationName, callback) {
  const url = `https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="${locationName}")&format=json&env=store://datatables.org/alltableswithkeys`

  fetch(url)
    .then((response) => response.json())
    .then((responseJSON) => {
      if (responseJSON.query.count) {
        callback(responseJSON.query.results.channel);
      } else {
        callback(null, { locationNotFound: true });
      }
    })
    .catch((error) => {
      callback(null, error);
    })
}

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
      reverseGeocode(lat, lng, (location, err) => {
        if (err) {
          dispatch({
            type: ADD_LOCATION_ERROR,
            payload: {
              errorCode: -1,
              errorMessage: 'Could not get information of current location'
            }
          });
        } else {
          getWeatherFromLocation(location.formatted_address, (weather, error) => {
            if (error) {
              dispatch({
                type: ADD_LOCATION_ERROR,
                payload: {
                  errorCode: -1,
                  errorMessage: 'Could not get weather information of your current location'
                }
              });
            } else {
              payload.name = location.formatted_address;
              payload.weather = weather;

              dispatch({
                type: ADD_LOCATION,
                payload: payload
              });
            }
          });
        }
      });
    };
  }
}

export function addLocation({ name, location } = {}) {
  return {
    type: ADD_LOCATION,
    payload: {
      name: name,
      weather: location
    }
  }
}

export function removeLocation(locationId) {
  return {
    type: REMOVE_LOCATION,
    payload: locationId
  };
}
