import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, Image, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, StatusBar, Alert, FlatList, TouchableWithoutFeedback, AsyncStorage } from 'react-native';

import Touchable from 'react-native-touchable-safe';

import AutocompleteOption from '../Components/AutocompleteOption';
import DiscoverPageUser from '../Components/DiscoverPageUser';


import algoliasearch from 'algoliasearch/reactnative';
var client = algoliasearch('KWELHTLEC3', 'd61f683228ca54c031f62eac964cd904');
var index = client.initIndex('Cliq');

export default class DiscoverPage extends React.Component {
  state = {
    AutoCompleteListData: [],
  }

  constructor(props) {
    super(props);
    this.handler = this.handler.bind(this);
    this.UserSearch = this.UserSearch.bind(this);
    AsyncStorage.getItem('UID').then(function(UserUID){
      this.setState({UserUID: UserUID});
    }.bind(this));
  }

  handler(data) {
    this.setState(data);
  }

  UserSearch(text){
    this.setState({SearchText: text});
    let page = this;
    if(text != '' ){
      index.search({ query: text, hitsPerPage: 4, }, function searchDone(err, content) {
        if (err) {
          console.error(err);
          return;
        }
        let filteredHits = [];
        for (var h in content.hits) {
          if(content.hits[h].objectID != page.state.UserUID){
            console.log(content.hits[h]);
            filteredHits.push(content.hits[h]);
          }
        }
        page.setState({AutoCompleteListData: filteredHits.splice(0, 3)});
      });
    }
    else {
      this.setState({AutoCorrectListData: []});
    }
  }

  testData = [
    {"Name":"Isabela Patron","ProfilePicUrl":"https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Default_profile_picture_%28male%29_on_Facebook.jpg/600px-Default_profile_picture_%28male%29_on_Facebook.jpg","Stars":0,"Username":"isapatron","objectID":"SfzTLmv0PCXks0LjCxvhB5eDmOu1"},
    {"Name":"Isaac Wasserman","POVCount":0,"ProfilePicUrl":"https://firebasestorage.googleapis.com/v0/b/cliq-50ded.appspot.com/o/ProfilePics%2F6rvyUE51RuSiDu2CfLrGkmGUdP42.jpeg?alt=media&token=088eec35-7d45-48d1-9e2e-ac38a4eb220e","Stars":3.7,"Username":"isaacis","objectID":"6rvyUE51RuSiDu2CfLrGkmGUdP42"},
    {"Name":"Yung Isaac","ProfilePicUrl":"https://firebasestorage.googleapis.com/v0/b/cliq-50ded.appspot.com/o/ProfilePics%2FEEsC2nQcxdbF9IPTCMeTfcmplI03.jpeg?alt=media&token=ba567977-a624-4504-97e0-11271d285a95","Stars":0,"Username":"iwasserman","objectID":"EEsC2nQcxdbF9IPTCMeTfcmplI03"}
  ]

  render() {
    let assets = {
      DarkCancelButton: require('../Resources/Images/DarkCancelButton.png'),
    }
    return (
      <View style={styles.Page}>
        <StatusBar barStyle="light-content"/>
        <View style={styles.TitleBar}>
          <Text style={styles.TitleText} numberOfLines={1}>Discover</Text>
        </View>
        <ScrollView style={styles.PageBody} keyboardShouldPersistTaps={'always'}>
          <View style={styles.SearchContainer}>
            <TextInput style={styles.SearchInput} ref={component => this._SearchInput = component} onChangeText={(text) => this.UserSearch(text)} placeholder={'Search...'}/>
            <FlatList keyboardShouldPersistTaps={'always'} style={styles.AutoCompleteContainer} data={this.state.AutoCompleteListData} keyExtractor={(item, index) => item.Name} renderItem={({item}) => <AutocompleteOption User={item} parentState={this.handler} parentNavigation={this.props.navigation}/>}/>
          </View>
          <View style={styles.NearbyContainer}>
            <Text style={styles.NearbyHeader}>Nearby</Text>
            <Text>coming soon...</Text>
            {/*<FlatList style={styles.NearbyList} data={this.testData} keyExtractor={(item, index) => item.objectID} renderItem={({item}) => <DiscoverPageUser User={item}/>}/>*/}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  Page: {
    height: '100%',
    width: '100%',
    flex: 1,
    backgroundColor: 'white'
  },
  TitleBar: {
    width: '100%',
    backgroundColor: '#1daeff',
    shadowOpacity: .5,
    shadowOffset: {height:0,width:0},
    shadowRadius: 10,
    shadowColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'row',
    alignItems: 'center'
  },
  TitleText: {
    fontSize: 30,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    color: 'white',
    marginVertical:30,
    top: 5,
    marginHorizontal:20,
    maxWidth: '100%',
    alignSelf: 'flex-start',
    flex: 1,
  },
  CancelButton: {
    height: 30,
    width: 30,
    alignSelf: 'flex-end',
    marginVertical:30,
    top: 5,
    marginHorizontal:20,
  },
  CancelButtonImage: {
    height: '100%',
    width: '100%',
  },
  PageBody: {
    marginTop: 10,
    paddingHorizontal: 20
  },
  SearchContainer: {
    paddingHorizontal: 0,
  },
  AutoCompleteContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    borderColor: '#e8e8e8',
    borderLeftWidth: 1,
    borderRightWidth: 1
  },
  SearchInput: {
    color: '#2b2b2b',
    fontSize: 40,
    fontWeight: '900',
    fontFamily: 'Helvetica',
    height: 50,
    borderBottomWidth: 5,
    borderColor: '#1daeff',
    marginTop: 20
  },
  NearbyContainer: {
    width: '100%',
    marginTop: 30
  },
  NearbyHeader: {
    color: '#2b2b2b',
    fontSize: 50,
    fontWeight: '900',
    fontFamily: 'Helvetica',
  },
});
