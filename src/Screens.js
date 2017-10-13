/**
 * SkyWatch
 * @flow
 */

import { Navigation } from 'react-native-navigation';
import { AsyncStorage } from 'react-native'
import { compose, createStore } from 'redux';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';

import HomeScreen from './components/HomeScreen';
import AddLocation from './components/AddLocation';

import configureStore from './reducers/configureStore';

const store = configureStore();

persistStore(store, { storage: AsyncStorage }).purge();

export function registerScreens() {
  Navigation.registerComponent('home', () => HomeScreen, store, Provider);
  Navigation.registerComponent('locations.add', () => AddLocation, store, Provider);
}
