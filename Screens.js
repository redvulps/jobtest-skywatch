/**
 * SkyWatch
 * @flow
 */

import { Navigation } from 'react-native-navigation';
import { AsyncStorage } from 'react-native'
import { compose, createStore } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist';

import allReducers from './src/reducers';

import HomeScreen from './src/components/HomeScreen';
import AddLocation from './src/components/AddLocation';

const store = createStore(allReducers, undefined, compose(autoRehydrate()));

persistStore(store, { storage: AsyncStorage });

export function registerScreens() {
  Navigation.registerComponent('home', () => HomeScreen);
  Navigation.registerComponent('locations.add', () => AddLocation);
}
