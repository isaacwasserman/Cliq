import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';

import SOCButton from '../Components/SOCButton';
import ImageLoad from 'react-native-image-placeholder';

import fb from '../FirebaseConfig';

export default class Me extends React.Component {

  constructor(props){
    super(props);
    this.LogOut = this.LogOut.bind(this);

    let nav = this.props.navigation;
    let state = this;
    fb.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log("Nice, the user is already logged in.");
        var UserRef = fb.database().ref('Users/' + user.uid);
        UserRef.on('value', function(snapshot){
          var UserData = snapshot.val();
          state.setState({User: UserData});
        });
      }
      else {
        nav.navigate('Login');
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

  state = {
    User: {
      Name: '...',
      Stars: '...',
      Username: null,
      ProfilePicUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Default_profile_picture_%28male%29_on_Facebook.jpg/600px-Default_profile_picture_%28male%29_on_Facebook.jpg',
      POVCount: '...'
    }
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
    return (
      <View style={styles.Page}>
        <View style={styles.TitleBar}>
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
              <View style={styles.RecentSection}>
                <Text style={styles.RecentLabel}>Recent:</Text>
                <SOCButton>
                <View style={styles.RecentPOV}>
                  <View style={styles.RecentPOVProfilePicContainer}>
                    <Image style={styles.RecentPOVProfilePic} source={{uri:'https://pbs.twimg.com/profile_images/824476541384097793/qGw1Whej.jpg'}}/>
                    <Text style={styles.RecentPOVUserRating}>4.0</Text>
                  </View>
                  <View style={styles.RecentPOVInfoContainer}>
                    <Text style={styles.RecentPOVUser}>Jack Kalina</Text>
                    <View style={styles.RecentPOVStars}>
                        <View style={styles.FullStarsContainer}>
                          <Image style={styles.FullStars} source={StarShape.Full}/>
                          <View style={StarMaskStyle.RecentPOVStarMask}></View>
                        </View>
                        <Image style={styles.EmptyStars} source={StarShape.Empty}/>
                    </View>
                    <Text style={styles.RecentPOVTimestamp} numberOfLines={1}>February 2nd, 12:14 PM</Text>
                  </View>
                </View>
                </SOCButton>
              </View>
              <TouchableOpacity style={styles.LogOutButton} onPress={this.LogOut}><Text style={styles.LogOutButtonText}>Log Out</Text></TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  ScrollContainer: {
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
    // top:-50,
    width:175,
    height:175,
    borderRadius: 5
  },
  TitleBar: {
    width: '100%',
    backgroundColor: '#1daeff',
    marginBottom: -60,
    zIndex: 5,
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
    textAlign: 'center'
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
  RecentSection: {
    width:'100%',
    height:350,
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
  }
});
