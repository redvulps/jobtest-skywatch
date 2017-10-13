/**
 * SkyWatch
 * @flow
 */

import React, { Component } from 'react';
import {
  Text,
  View,
  Image
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as locationsActions from '../actions/locations';

const mapStateToProps = (state, ownProps) => {
  return {
    defaultLocation: state.locations.locations.find((l) => l.default),
    otherLocations: state.locations.locations.filter((l) => !l.default),
    shouldRequestForGeolocationPermission: state.locations.shouldRequestForGeolocationPermission,
    defaultLocationError: state.locations.defaultLocationError,
    defaultLocationErrorMessage: state.locations.defaultLocationErrorMessage
  }
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(locationsActions, dispatch)
	};
}

class HomeScreen extends Component {
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

    this.state = {
      loading: !props.defaultLocation
    };

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({ loading: false }, () => {
        this.props.actions.setDefaultLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
      });
    }, (error) => {
      this.setState({ loading: false }, () => {
        this.props.actions.setDefaultLocation({ error: error });
      });
    }, { enableHighAccuracy: !__DEV__, timeout: 3000 });
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

  renderLoading() {
    if (this.state.loading) {
      return (
        <Text>Getting information</Text>
      );
    }
  }

  renderDefaultLocation() {
    const {
      defaultLocation,
      defaultLocationErrorMessage,
      shouldRequestForGeolocationPermission
    } = this.props;

    if (defaultLocation) {
      return (
        <View>
          <Text>{ defaultLocation.name }</Text>
        </View>
      );
    } else {
      if (this.state.loading) {
        return;
      }

      return (
        <View>
          <Image source={ require('../../assets/icons/sad-cloud.png') } />
          <Text>{ defaultLocationErrorMessage }</Text>
        </View>
      );
    }
  }

  renderOtherLocations() {
    const {
      otherLocations
    } = this.props;

    if (otherLocations.length) {
      return <Text>Other component list</Text>;
    }
  }

  render() {
    return (
      <View>
        { this.renderLoading() }
        { this.renderDefaultLocation() }
        { this.renderOtherLocations() }
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
