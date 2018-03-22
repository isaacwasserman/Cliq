import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, Image, ScrollView, FlatList, TouchableOpacity } from 'react-native';

import SOCButton from '../Components/SOCButton';
import RecentPOV from '../Components/RecentPOV';
import ImageLoad from 'react-native-image-placeholder';
import Touchable from 'react-native-touchable-safe'

import fb from '../FirebaseConfig';

import algoliasearch from 'algoliasearch/reactnative';
var client = algoliasearch('KWELHTLEC3', 'd61f683228ca54c031f62eac964cd904');
var index = client.initIndex('POVS');

export default class UserPage extends React.Component {
  state = {
    User: {
      Name: '...',
      Stars: '...',
      Username: null,
      ProfilePicUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Default_profile_picture_%28male%29_on_Facebook.jpg/600px-Default_profile_picture_%28male%29_on_Facebook.jpg',
      POVCount: '...',
      UID: null
    },
    FollowButtonText: 'Follow +',
    FollowButtonFunction: this.Follow,
    RecentPOVS: []
  }

  componentWillMount(){
    if(this.props.navigation.state.params != null){
      let User = this.props.navigation.state.params.User;
      this.setState({User: User});
      this.FetchRecentPOVS(User);
    }
  }

  constructor(props){
    super(props);
    this.Review = this.Review.bind(this);
    this.Follow = this.Follow.bind(this);
    this.FetchRecentPOVS = this.FetchRecentPOVS.bind(this);
  }

  FetchRecentPOVS(User){
    let page = this;
    console.log(User)
    index.search({ query: User.UID, hitsPerPage: 3, }, function searchDone(err, content) {
      if (err) {
        console.error(err);
        return;
      }
      else {
        console.log(content.hits);
        page.setState({RecentPOVS: content.hits});
      }
    });
  }

  LogOut(){
    fb.auth().signOut().then(function() {
      // Sign-out successful.
    }).catch(function(error) {
      Alert.alert("Something's wrong here", error.message, [{text: 'OK', onPress: () => console.log('OK Pressed')}], { cancelable: false });
    });
  }

  static navigationOptions = {
    title: 'Me',
    headerTintColor: 'white',
    headerStyle: {
      shadowOpacity: 0.1,
      shadowOffset: {height:0},
      backgroundColor: 'transparent',
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      fontWeight:'900',
      fontSize:24,
      fontFamily:'Helvetica',
    },
  };

  Review(){
    this.props.navigation.navigate('Review', {User: this.state.User});
  }

  Follow(){
    this.setState({FollowButtonText: 'Unfollow'});
    this.setState({FollowButtonFunction: this.Unfollow});
  }

  Unfollow(){
    this.setState({FollowButtonText: 'Follow +'});
    this.setState({FollowButtonFunction: this.Follow});
  }

  render() {
    let ProfilePicPlaceholder = require('../Resources/Images/DefaultProfilePic.jpg');
    let StarShape = {
      Full: require('../Resources/Images/Images_Full-Stars.png'),
      Empty: require('../Resources/Images/Images_No-Stars.png')
    };
    let StarMaskPercentage = (100 * (1 - (this.state.User.Stars/5.0))) + "%";
    console.log(StarMaskPercentage);
    let StarMaskStyle = StyleSheet.create({
      StarMask: {
        height: '100%',
        width: StarMaskPercentage,
        backgroundColor:'white',
        position: 'absolute',
        right: 0
      },
      RecentPOVStarMask: {
        height: '100%',
        width: StarMaskPercentage,
        backgroundColor:'#e8e8e8',
        position: 'absolute',
        right: 0
      }
    });
    let assets = {
      CancelButton: require('../Resources/Images/CancelButton.png'),
      BackArrow: require('../Resources/Images/Back.png')
    }
    return (
      <View style={styles.Page}>
        <View style={styles.TitleBar}>
          <TouchableOpacity style={styles.CancelButton} onPress={() => this.props.navigation.goBack()}>
            <Image style={styles.CancelButtonImage} source={assets.BackArrow}/>
          </TouchableOpacity>
          <Text style={styles.TitleText} numberOfLines={1}>{this.state.User.Name}</Text>
        </View>
        <ScrollView contentContainerStyle={styles.ScrollContainer}>
          <View style={{width:'100%',flexDirection:'column',alignItems:'center',}}>
            <View style={styles.DropShadow}>
              <ImageLoad style={styles.ProfilePic} source={{uri:this.state.User.ProfilePicUrl}} placeholderSource={ProfilePicPlaceholder} loadingStyle={{size:'small', color:'rgba(0,0,0,0)'}}/>
              {/*<Image style={styles.ProfilePicPlaceholder} source={ProfilePicPlaceholder}/>*/}
            </View>
            <View style={styles.PageBody}>
              <View style={styles.StarContainer}>
                <View style={styles.FullStarsContainer}>
                  <Image style={styles.FullStars} source={StarShape.Full}/>
                  <View style={StarMaskStyle.StarMask}></View>
                </View>
                <Image style={styles.EmptyStars} source={StarShape.Empty}/>
              </View>
              <View style={styles.Statistics}>
                <View style={styles.StarCountContainer}>
                  <Text style={styles.StatisticsCounter}>{this.state.User.Stars}</Text>
                  <Text style={styles.StatisticsLabel}>STARS</Text>
                </View>
                <View style={styles.POVCountContainer}>
                  <Text style={styles.StatisticsCounter} numberOfLines={1}>{this.state.User.POVCount}</Text>
                  <Text style={styles.StatisticsLabel}>POVS</Text>
                </View>
              </View>
              <View style={styles.ActionButtonContainer}>
                <Touchable style={styles.ActionButton} onPress={this.Review}>
                  <Text style={styles.ActionButtonLabel}>Review</Text>
                </Touchable>
                <Touchable style={styles.ActionButton}>
                  <Text style={styles.ActionButtonLabel} onPress={this.Follow}>{this.state.FollowButtonText}</Text>
                </Touchable>
              </View>
              <View style={styles.RecentSection}>
                <Text style={styles.RecentLabel}>Recent:</Text>
                <FlatList style={styles.ListContainer} data={this.state.RecentPOVS} keyExtractor={(item, index) => item.Timestamp} renderItem={({item}) => <RecentPOV POV={item}/>}/>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  ScrollContainer: {
    marginTop: -55
  },
  LogOutButton: {
    height: 50,
    width: '100%',
    backgroundColor: '#ff5e73',
    marginTop: 20,
    justifyContent: 'center'
  },
  LogOutButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 24
  },
  Page: {
    height:'100%',
    width:'100%',
    backgroundColor:'#1daeff',
    flex: 1
  },
  ProfilePic: {
    width:175,
    height:175,
    borderRadius: 5
  },
  TitleBar: {
    width: '100%',
    backgroundColor: '#1daeff',
    flexDirection: 'row',
    alignItems: 'center'
  },
  TitleText: {
    fontSize: 30,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    color: 'white',
    marginVertical:20,
    top: 5,
    marginRight:50,
    maxWidth: '100%',
    alignSelf: 'center',
    textAlign: 'center',
    flex: 1,
  },
  CancelButton: {
    height: 20,
    width: 11,
    alignSelf: 'flex-start',
    marginVertical:30,
    top: 5,
    marginHorizontal:20,
  },
  CancelButtonImage: {
    height: '100%',
    width: '100%',
  },
  PageBody: {
    // top:-50,
    backgroundColor:'#FFFFFF',
    width:'100%',
    minHeight:'100%',
    zIndex:-1,
    shadowOpacity: .5,
    shadowOffset: {height:0,width:0},
    shadowRadius: 10,
    shadowColor: 'rgba(0,0,0,0.5)',
    paddingTop: 100,
    flexDirection: 'column',
    alignItems: 'center'
  },
  DropShadow: {
    shadowOpacity: .5,
    shadowOffset: {height:0,width:0},
    shadowRadius: 2,
    shadowColor: 'rgba(0,0,0,0.5)',
    top:75,
    borderRadius:5,
    overflow: 'hidden',
  },
  ProfilePicPlaceholder: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: '-25%',
    resizeMode: 'contain',
  },
  StarContainer: {
    height:100,
    width:'75%',
    marginTop: -30,
  },
  EmptyStars: {
    flex: 1,
    width: '100%',
    height: 100,
    resizeMode: 'contain',
    position:'absolute',
    justifyContent:'center'
  },
  FullStarsContainer: {
    flex: 1,
    width: '100%',
    height: 100,
    position:'absolute',
    overflow: 'hidden'
  },
  FullStars: {
    height:'100%',
    width: null,
    resizeMode:'contain',
    flex:1
  },
  Statistics: {
    height:150,
    width:"100%",
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20
  },
  StarCountContainer: {
    height:'100%',
    flex:1,
    flexDirection:'column',
    justifyContent:'center'
  },
  POVCountContainer: {
    height:'100%',
    flex:1,
    flexDirection:'column',
    justifyContent:'center'
  },
  StatisticsLabel: {
    color:'#2b2b2b',
    fontSize: 30,
    fontWeight:'900',
    textAlign:'center',
    fontFamily:'Helvetica'
  },
  StatisticsCounter: {
    color:'#2b2b2b',
    fontSize: 70,
    fontWeight:'900',
    textAlign:'center',
    fontFamily:'Helvetica'
  },
  ActionButtonContainer: {
    width: '100%',
    height: 45,
    marginVertical: 15,
    paddingHorizontal: '10%',
    flexDirection: 'row'
  },
  ActionButton: {
    flex: 1,
    height: '100%',
    backgroundColor: '#1daeff',
    justifyContent: 'center',
    marginHorizontal: 10
  },
  ActionButtonLabel: {
    color: 'white',
    fontFamily: 'Helvetica',
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center'
  },
  RecentSection: {
    width:'100%',
    padding: 20,
    marginTop: -15
  },
  RecentLabel: {
    fontFamily:'Helvetica',
    fontSize: 20,
    fontWeight:'bold',
    color: '#636363'
  },
  RecentPOV: {
    backgroundColor: '#e8e8e8',
    width: '100%',
    height: 130,
    marginVertical: 15,
    borderRadius: 20,
    padding: 15,
    flexDirection:'row',
  },
  RecentPOVProfilePic: {
    height: 100,
    aspectRatio: 1,
    borderRadius: 10,
    width: '100%'
  },
  RecentPOVProfilePicContainer: {
    alignItems: 'flex-end'
  },
  RecentPOVInfoContainer: {
    height: 100,
    flex: 2,
    paddingHorizontal: 15,
  },
  RecentPOVUserRating: {
    position:'absolute',
    fontSize:30,
    fontWeight: '900',
    color: 'white',
    top:62,
    right:4,
    textAlign:'right',
    flex: 1
  },
  RecentPOVStars: {
    flex: 2,
    top: -20,
    zIndex: -2
  },
  RecentPOVUser: {
    flex: 1,
    color: '#2b2b2b',
    fontSize: 20,
    fontWeight: 'bold',
    width: '100%'
  },
  RecentPOVTimestamp: {
    flex: 1,
    top: 10,
    color: '#636363',
    fontSize:15
  },
});
