import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

const WeatherCover = ({ defaultLocation, name, weather, id, removeLocation } = {}) => {
  const removeButton = (
    <View style={ Styles.buttonContainer }>
      <TouchableOpacity style={ Styles.removeButton } onPress={ () => removeLocation() }>
        <Text style={ Styles.removeButtonText }>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={ Styles.wrapper }>
      <Text>{ name }</Text>
      <View>
        <Text>{ weather.item.condition.text }</Text>
        <Text>{ weather.item.condition.temp }{ weather.units.temperature }</Text>
      </View>
      { id && ! defaultLocation ? removeButton : null }
    </View>
  );
};

const Styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB'
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  removeButton: {
    backgroundColor: '#c62828',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  removeButtonText: {
    color: '#fff'
  },
});

export default WeatherCover;
