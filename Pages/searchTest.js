import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, Image, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, StatusBar, Alert, FlatList } from 'react-native';

import fb from '../FirebaseConfig';
import { InstantSearch } from 'react-instantsearch/native';
import { connectInfiniteHits } from 'react-instantsearch/connectors';

export default class searchTest extends React.Component {
  state = {
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <InstantSearch
          appId="KWELHTLEC3"
          apiKey="d61f683228ca54c031f62eac964cd904"
          indexName="Cliq"
        >
          <Text>
            Congrats 🎉! Your application is now connected to Algolia!
          </Text>
        </InstantSearch>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
});
