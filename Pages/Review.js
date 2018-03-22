import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, Image, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, StatusBar, Alert, FlatList, TouchableWithoutFeedback, AsyncStorage, ActivityIndicator } from 'react-native';

import fb from '../FirebaseConfig';

import Touchable from 'react-native-touchable-safe'

import AutocompleteOption from '../Components/AutocompleteOption';

import algoliasearch from 'algoliasearch/reactnative';
var client = algoliasearch('KWELHTLEC3', 'd61f683228ca54c031f62eac964cd904');
var index = client.initIndex('Cliq');

export default class ReviewPage extends React.Component {
  state = {
    AutoCompleteListData: [],
    StarStatus: [
      require('../Resources/Images/SingleStar_Full.png'),
      require('../Resources/Images/SingleStar_Empty.png'),
      require('../Resources/Images/SingleStar_Empty.png'),
      require('../Resources/Images/SingleStar_Empty.png'),
      require('../Resources/Images/SingleStar_Empty.png')
    ],
    StarScore: 1,
    SearchText: null,
    ToChosen: 0,
    ToUser: {
      Name: null,
      Username: null,
      ProfilePicUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Default_profile_picture_%28male%29_on_Facebook.jpg/600px-Default_profile_picture_%28male%29_on_Facebook.jpg',
      UID: null,
      Stars: null,
      POVCount: null
    },
    FromUID: null,
  }

  constructor(props) {
    super(props);
    this.handler = this.handler.bind(this);
    this.UserSearch = this.UserSearch.bind(this);
    this.ClearSearch = this.ClearSearch.bind(this);
    this.UpdateStars = this.UpdateStars.bind(this);
    this.Review = this.Review.bind(this);
    AsyncStorage.getItem('UID').then(function(UserUID){
      this.setState({UserUID: UserUID});
      this.setState({FromUID: UserUID});
    }.bind(this));
  }

  componentWillMount(){
    if(this.props.navigation.state.params){
      this.setState({ToUser:this.props.navigation.state.params.User, ToChosen: 1});
    }
  }

  handler(data) {
    this.setState(data);
  }

  UserSearch(text){
    this.setState({SearchText: text});
    let page = this;
    if(text != '' ){
      index.search({ query: text, hitsPerPage: 3, }, function searchDone(err, content) {
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
      this.setState({AutoCompleteListData: []});
    }
  }

  ClearSearch(){
    this._SearchInput.setNativeProps({text: ''});
  }

  UpdateStars(num){
    let finalArray = [];
    for(i = 0; i < num; i++){
      finalArray.push(require('../Resources/Images/SingleStar_Full.png'));
    }
    for(k = 0; k < (5 - num); k++){
      finalArray.push(require('../Resources/Images/SingleStar_Empty.png'));
    }
    this.setState({StarStatus: finalArray});
    this.setState({StarScore: num});
  }

  Review(){
    if(this.state.ToUser.UID != null){
      let CurrentPOVCount = this.state.ToUser.POVCount;
      let CurrentStarCount = this.state.ToUser.Stars;
      let CurrentStarTotal = CurrentStarCount * CurrentPOVCount;

      let ThisReviewStars = this.state.StarScore;

      let NewPOVCount = CurrentPOVCount + 1;
      let NewStarTotal = CurrentStarTotal + ThisReviewStars;
      let NewStarCount = Math.round((NewStarTotal / NewPOVCount) * 10) / 10;

      let NewPOV = {
        From: this.state.FromUID,
        To: this.state.ToUser.UID,
        Stars: ThisReviewStars,
        Timestamp: new Date().getTime(),
      }

      let NewPOVRef = fb.database().ref('POVS/').push();
      NewPOVRef.set(NewPOV);

      let ToUserRef = fb.database().ref('Users/' + this.state.ToUser.UID);
      let FromUserRef = fb.database().ref('Users/' + NewPOV.From);
      let Updates = {Stars: NewStarCount, POVCount: NewPOVCount};
      let navigate = this.props.navigation.navigate;
      ToUserRef.update(Updates).then(function(){
        ToUserRef.child('ReceivedPOVS').push().set(NewPOV).then(function(){
          FromUserRef.child('SentPOVS').push().set(NewPOV).then(function(){
            fetch('https://cliq-search-update.herokuapp.com/update').then(function(response){
              if(response){
                console.log('Posted!');
                navigate('Feed');
              }
            }.bind(this));
          });
        });
      });
    }
  }

  render() {
    let assets = {
      CancelButton: require('../Resources/Images/CancelButton.png'),
      DarkCancelButton: require('../Resources/Images/DarkCancelButton.png'),
      FullStar: require('../Resources/Images/SingleStar_Full.png'),
      EmptyStar: require('../Resources/Images/SingleStar_Empty.png'),
    }
    return (
      <View style={styles.Page}>
        <StatusBar barStyle="light-content"/>
        <View style={styles.TitleBar}>
          <Text style={styles.TitleText} numberOfLines={1}>New POV</Text>
        </View>
        <ScrollView style={styles.PageBody} keyboardShouldPersistTaps={'always'}>
          <View style={styles.WhoContainer}>
            <View style={[styles.ToBoxContainer, {opacity:this.state.ToChosen, zIndex:this.state.ToChosen}]}>
              <View style={styles.ToBox}>
                <Image style={styles.ToBoxImage} source={{uri: this.state.ToUser.ProfilePicUrl}}/>
                <View style={styles.ToBoxInfo}>
                  <Text style={styles.ToBoxName} numberOfLines={1}>{this.state.ToUser.Name}</Text>
                  <Text style={styles.ToBoxUsername}>@{this.state.ToUser.Username}</Text>
                </View>
              </View>
              <Touchable style={styles.ToBoxClearContainer} onPress={() => this.setState({ToChosen: 0})}>
                <Image style={styles.ToBoxClearImage} source={assets.DarkCancelButton}/>
              </Touchable>
            </View>
            <TextInput style={styles.ToInput} ref={component => this._SearchInput = component} onChangeText={(text) => this.UserSearch(text)} placeholder={'Who?'}/>
            <FlatList  keyboardShouldPersistTaps={'always'} style={styles.AutoCompleteContainer} data={this.state.AutoCompleteListData} keyExtractor={(item, index) => item.Name} renderItem={({item}) => <AutocompleteOption User={item} parentState={this.handler} ClearSearch={this.ClearSearch}/>}/>
          </View>
          <Text style={styles.PromptText}>How many stars do they get?</Text>
          <View style={styles.StarContainer}>
            <Touchable style={styles.SingleStarButton} onPress={() => this.UpdateStars(1)}>
              <Image style={styles.SingleStarImage} source={this.state.StarStatus[0]}/>
            </Touchable>
            <Touchable style={styles.SingleStarButton} onPress={() => this.UpdateStars(2)}>
              <Image style={styles.SingleStarImage} source={this.state.StarStatus[1]}/>
            </Touchable>
            <Touchable style={styles.SingleStarButton} onPress={() => this.UpdateStars(3)}>
              <Image style={styles.SingleStarImage} source={this.state.StarStatus[2]}/>
            </Touchable>
            <Touchable style={styles.SingleStarButton} onPress={() => this.UpdateStars(4)}>
              <Image style={styles.SingleStarImage} source={this.state.StarStatus[3]}/>
            </Touchable>
            <Touchable style={styles.SingleStarButton} onPress={() => this.UpdateStars(5)}>
              <Image style={styles.SingleStarImage} source={this.state.StarStatus[4]}/>
            </Touchable>
          </View>
          <Touchable style={styles.CliqSwipe} onPress={this.Review}>
            <Text style={styles.CliqSwipeText}>Cliq</Text>
          </Touchable>
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
  WhoContainer: {
    paddingHorizontal: 0,
    marginTop: 30
  },
  AutoCompleteContainer: {
    backgroundColor: 'white',
    borderColor: '#e8e8e8',
    borderWidth: 2,
    paddingHorizontal: 10,
  },
  ToInput: {
    color: '#2b2b2b',
    fontSize: 40,
    fontWeight: '900',
    fontFamily: 'Helvetica',
    height: 50,
    borderBottomWidth: 5,
    borderColor: '#1daeff',
    marginTop: 40
  },
  ToBoxContainer: {
    height: 75,
    width: '100%',
    position: 'absolute',
    bottom: 15,
    zIndex: 2,
    flexDirection: 'row'
  },
  ToBox: {
    height: 75,
    backgroundColor: 'rgb(210,210,210)',
    borderRadius: 15,
    padding: 10,
    flexDirection: 'row',
    maxWidth: '90%',
    overflow: 'hidden'
  },
  ToBoxImage: {
    height: '100%',
    aspectRatio: 1,
    borderRadius: 5
  },
  ToBoxInfo: {
    flexDirection: 'column',
    marginRight: 10,
    marginLeft: 20
  },
  ToBoxName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2b2b2b'
  },
  ToBoxUsername: {
    color: 'grey'
  },
  ToBoxClearContainer: {
    width: '10%',
    height: '100%',
    flexDirection: 'row',
    paddingLeft: 5
  },
  ToBoxClearImage: {
    width: '100%',
    aspectRatio: 1,
    alignSelf: 'center',
  },
  PromptText: {
    paddingHorizontal: 0,
    color: '#2b2b2b',
    fontSize: 36,
    fontWeight: '900',
    marginTop: 40,
    fontFamily: 'Helvetica'
  },
  StarContainer: {
    marginTop: 10,
    width: '100%',
    height: 80,
    flexDirection: 'row',
    paddingHorizontal: 20,
    backgroundColor: 'rgb(210,210,210)',
    borderRadius: 20,
    flex: 1
  },
  SingleStarButton: {
    height: '100%',
    width: 100,
    flex: 1,
  },
  SingleStarImage: {
    width: '100%',
    resizeMode: 'contain',
    flex: 1
  },
  CliqSwipe: {
    height: 60,
    width: '80%',
    marginHorizontal: 20,
    marginTop: 50,
    backgroundColor: '#1daeff',
    alignSelf: 'center',
    justifyContent: 'center'
  },
  CliqSwipeText: {
    color: 'white',
    fontSize: 36,
    fontWeight: '900',
    alignSelf: 'center',
    fontFamily: 'Helvetica'
  }
});
