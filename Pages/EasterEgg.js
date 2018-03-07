import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, Image, ScrollView, TextInput, TouchableOpacity, WebView} from 'react-native';

export default class EasterEgg extends React.Component {
  state = {
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <WebView
        source={{uri: 'https://google.com'}}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
});
