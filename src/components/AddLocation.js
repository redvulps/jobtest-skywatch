/**
 * SkyWatch
 * @flow
 */

import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AutocompleteInput from 'react-native-autocomplete-input';

import * as locationsActions from '../actions/locations';

import WeatherCover from './WeatherCover';


function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(locationsActions, dispatch)
	};
}

class AddLocation extends Component {
  static navigatorButtons = {
    leftButtons: [
      {
        title: 'Cancel',
        id: 'cancel'
      }
    ]
  };

  constructor(props) {
    super(props);

    this.timeout = null;
    this.state = {
      data: [],
      location: null
    };

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    if (event.type == 'NavBarButtonPress') {
      if (event.id == 'cancel') {
        this.props.navigator.dismissModal();
      }
    }
  }

  searchForPlace(text) {
    clearTimeout(this.timeout);

    setTimeout(() => {
      const url = `https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(5) where text="${text}")&format=json&env=store://datatables.org/alltableswithkeys`

      fetch(url)
        .then((response) => response.json())
        .then((responseJSON) => {
          if (responseJSON.query.count) {
            this.setState({ data: responseJSON.query.count == 1 ? [responseJSON.query.results.channel] : responseJSON.query.results.channel });
          } else {
            this.setState({ data: [] });
          }
        });
    }, 300)
  }

  setLocation(location) {
    this.setState({
      data: [],
      location: location
    });
  }

  clearYahooApiTitle(title) {
    return title.replace('Yahoo! Weather - ', '');
  }

  renderSelectedLocation() {
    const { location } = this.state;

    if (!location) {
      return;
    }

    return (
      <WeatherCover name={ this.clearYahooApiTitle(location.title) } weather={ location } />
    )
  }

  renderAddButton() {
    const { location } = this.state;

    if (!location) {
      return;
    }

    const addLocation = () => {
      this.props.actions.addLocation({ name: this.clearYahooApiTitle(location.title), location: location });
      this.props.navigator.dismissModal();
    };

    return (
      <View style={ Styles.buttonContainer }>
        <TouchableOpacity style={ Styles.addButton } onPress={ () => addLocation() }>
          <Text style={ Styles.addButtonText }>Add this location</Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { location } = this.state;

    return (
      <View style={ Styles.container }>
        <View style={ Styles.autoCompleteWrapper }>
          <AutocompleteInput
            style={ Styles.autoComplete }
            inputContainerStyle={ Styles.autoCompleteContainer }
            data={ this.state.data }
            onChangeText={ (text) => this.searchForPlace(text) }
            placeholder="Search for a place"
            renderItem={ (data) => (
              // Small workaroud to show a better text
              <TouchableOpacity onPress={ () => this.setLocation(data) }>
                <Text>{ this.clearYahooApiTitle(data.title) }</Text>
              </TouchableOpacity>
            ) }
          />
        </View>
        <View style={ Styles.wrapper }>
          { this.renderSelectedLocation() }
        </View>
        { this.renderAddButton() }
      </View>
    );
  }
}

const Styles = StyleSheet.create({
  container: {
    flex: 1
  },
  autoCompleteWrapper: {
    flex: 1,
    zIndex: 1,
    justifyContent: 'center',
  },
  autoComplete: {
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 10,
    left: 0,
    right: 0,
  },
  autoCompleteContainer: {
    borderWidth: 0
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  addButton: {
    backgroundColor: '#1976d2',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  addButtonText: {
    color: '#fff'
  },
  wrapper: {
    flex: 10,
    zIndex: 0
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(AddLocation);
