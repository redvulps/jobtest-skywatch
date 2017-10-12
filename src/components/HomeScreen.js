/**
 * SkyWatch
 * @flow
 */

import React, { Component } from 'react';
import {
  Text,
  View
} from 'react-native';

export default class HomeScreen extends Component {
  static navigatorButtons = {
    rightButtons: [
      {
        title: 'Add Location',
        id: 'add_location'
      }
    ]
  };

  constructor(props) {
    super(props);

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    if (event.type == 'NavBarButtonPress') {
      if (event.id == 'add_location') {
        this.props.navigator.push({
          screen: 'locations.add'
        });
      }
    }
  }

  render() {
    return (
      <View>
        <Text>HomeScreen</Text>
      </View>
    );
  }
}
