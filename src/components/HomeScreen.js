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
import Swiper from 'react-native-swiper';
import * as locationsActions from '../actions/locations';

import WeatherCover from './WeatherCover';

const mapStateToProps = (state, ownProps) => {
  return {
    locations: state.locations.locations,
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

  renderWeatherList() {
    const { locations, defaultLocationError } = this.props

    if (this.state.loading && !locations.length) {
      return (
        <View>
          <Text>Loading...</Text>
        </View>
      )
    } else {
      if (!locations.length && defaultLocationError) {
        return (
          <View>
            <Image source={ require('../../assets/icons/sad-cloud.png') } />
            <Text>{ defaultLocationErrorMessage }</Text>
          </View>
        );
      } else {
        return locations.map((location, index) => {
          return <WeatherCover key={ `weather.${index}` } name={ location.name } weather={ location.weather } />
        });
      }
    }
  }

  render() {
    return (
      <Swiper showsButtons={ false } showsPagination={ true }>
        { this.renderWeatherList() }
      </Swiper>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
