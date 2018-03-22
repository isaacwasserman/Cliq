import React from 'react';
import { Animated, StyleSheet, Text, View, Image, TouchableWithoutFeedback } from 'react-native';

import fb from '../FirebaseConfig';

const StarShape = {
  Full: require('../Resources/Images/Images_Full-Stars.png'),
  Empty: require('../Resources/Images/Images_No-Stars.png')
};

export default class FeedPOV extends React.Component {
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
      this.setState({FitImageJSX: FitImage});
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
        width: (100 - (((this.props.POV.Stars)/5) * 100)) + "%"
    };

    return (
      <View style={styles.FeedEntry}>
        <View style={styles.FeedEntryPicContainer}>
          <Image style={{borderRadius:10, width: '100%', aspectRatio: 1}} source={{uri:this.state.toProfile.ProfilePicUrl}}/>
          <Text style={styles.Score}>{this.state.toProfile.Stars}</Text>
        </View>
        <Text style={styles.FeedEntryText}>{this.state.toProfile.Name} got</Text>
        <View style={styles.FeedEntryStars}>
          <View style={styles.FullStarsContainer}>
            <Image style={styles.FullStars} source={StarShape.Full}/>
            <View style={[styles.StarMask,StarMaskWidth]}></View>
          </View>
          <Image style={styles.EmptyStars} source={StarShape.Empty}/>
        </View>
        <Text style={styles.FeedEntryText}>from {this.state.fromProfile.Name}</Text>
        <Text style={styles.FeedEntryTimestamp}>{new Date(this.props.POV.Timestamp).toDateString()}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  FeedEntry: {
    borderRadius:20,
    backgroundColor: '#e8e8e8',
    width: '100%',
    padding:17,
    alignItems:'stretch',
    flex:1,
    overflow:'hidden',
    marginBottom: 25
  },
  FeedEntryPicContainer: {
    borderRadius:10,
    backgroundColor:'black',
    overflow:'hidden',
  },
  FeedEntryPic: {
  },
  Score: {
    fontSize:80,
    fontFamily:'Helvetica',
    color:'white',
    fontWeight: 'bold',
    alignSelf: 'flex-end',
    position:'absolute',
    bottom: 0,
    right: 10,
  },
  FeedEntryText: {
    fontSize:30,
    fontWeight:'bold',
    fontFamily:'Helvetica',
    color: '#2b2b2b',
    marginVertical: 10,
  },
  FeedEntryStars: {
    width: '100%',
    flex: 1,
    zIndex:-3,
    position: 'relative',
    padding:20,
    marginVertical: 10,
    justifyContent:'center',
  },
  EmptyStars: {
    flex: 1,
    width: '100%',
    resizeMode: 'contain',
    position:'absolute',
    justifyContent:'center'
  },
  FullStarsContainer: {
    flex: 1,
    width: '100%',
    position:'absolute',
    overflow: 'hidden'
  },
  FullStars: {
    width: null,
    resizeMode:'contain',
    flex:1
  },
  FeedEntryTimestamp: {
    flex: 1,
    color: '#636363',
    fontSize:10,
    left: 5,
  },
  StarMask: {
    height: '100%',
    backgroundColor:'#e8e8e8',
    position: 'absolute',
    right: 0
  },
});
