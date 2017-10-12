import { Navigation } from 'react-native-navigation';

import { registerScreens } from './Screens';

registerScreens();

Navigation.startSingleScreenApp({
  screen: {
    screen: 'home',
    title: 'SkyWatch'
  }
});
