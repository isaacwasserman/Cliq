import React from 'react';
import { Animated, StyleSheet, Text, View, Image, TouchableWithoutFeedback } from 'react-native';

import SOCButton from './SOCButton';

import fb from '../FirebaseConfig';



const StarShape = {
  Full: require('../Resources/Images/Images_Full-Stars.png'),
  Empty: require('../Resources/Images/Images_No-Stars.png')
};

export default class RecentPOV extends React.Component {
  state = {
    toProfile: {},
    fromProfile: {},
    FitImageJSX: <Text>Hello</Text>
  }
  constructor(props) {
    super(props);
    this.GETProfile = this.GETProfile.bind(this);
    this.GETFromProfile = this.GETFromProfile.bind(this);
  }
  GETProfile() {
    fb.database().ref('/Users/' + this.props.POV.To).once('value').then(function(snapshot) {
      var response = snapshot.val();
      this.setState({toProfile:response});
    }.bind(this));
  }
  GETFromProfile(){
    fb.database().ref('/Users/' + this.props.POV.From).once('value').then(function(snapshot) {
      var response = snapshot.val();
      this.setState({fromProfile:response});
    }.bind(this));
  }

  componentWillMount(){
    this.GETProfile();
    this.GETFromProfile();
  }

  render() {
    let StarMaskWidth = {
        width: (100 - (((this.props.POV.Stars)/5) * 100)) + "%",
        backgroundColor:'#e8e8e8',
        position: 'absolute',
        right: 0,
        height: '100%',
    };

    return (
      <SOCButton>
        <View style={styles.RecentPOV}>
          <View style={styles.RecentPOVProfilePicContainer}>
            <Image style={styles.RecentPOVProfilePic} source={{uri:this.state.fromProfile.ProfilePicUrl}}/>
            <Text style={styles.RecentPOVUserRating}>{this.state.fromProfile.Stars}</Text>
          </View>
          <View style={styles.RecentPOVInfoContainer}>
            <Text style={styles.RecentPOVUser}>{this.state.fromProfile.Name}</Text>
            <View style={styles.RecentPOVStars}>
                <View style={styles.FullStarsContainer}>
                  <Image style={styles.FullStars} source={StarShape.Full}/>
                  <View style={StarMaskWidth}></View>
                </View>
                <Image style={styles.EmptyStars} source={StarShape.Empty}/>
            </View>
            <Text style={styles.RecentPOVTimestamp} numberOfLines={1}>{new Date(this.props.POV.Timestamp).toDateString()}</Text>
          </View>
        </View>
      </SOCButton>
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
    marginTop: 15,
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
    fontSize: 12
  }
});
