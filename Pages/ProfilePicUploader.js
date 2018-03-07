import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, Image, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, WebView, Alert } from 'react-native';

import fb from '../FirebaseConfig';

export default class ProfilePicUploaderPage extends React.Component {
  constructor(props) {
    super(props);
    this.getNavigationParams = this.getNavigationParams.bind(this);
    this.Continue = this.Continue.bind(this);
  }

  getNavigationParams() {
    // return {UID:'something'}
    return this.props.navigation.state.params || {}
  }

  state = {
    ProfilePicLocalSource: null,
    ProfilePicRemoteSource: null,
    UID: this.getNavigationParams().UID
  }

  Continue() {
    var nav = this.props.navigation;
    var path = fb.storage().ref('ProfilePics/');
    path.child(this.state.UID + ".jpeg").getDownloadURL().then(onResolve, onReject);
    //if file is in the bucket
    function onResolve(foundURL) {
      nav.navigate('Me');
      console.log('filefound');
    }
    //if not
    function onReject(error) {
      console.log(error);
      Alert.alert('Oops',"It looks like you did't upload a profile pic. That's an issue.",[{text: 'OK', onPress: () => console.log('OK Pressed')}], { cancelable: false });
    }
  }

  render() {
    // let WebViewURI = {uri:'http://localhost:8000/ChangeProfilePic.html?UID=' + this.state.UID};
    let WebViewURI = {uri:'https://cliq-50ded.firebaseapp.com/ChangeProfilePic.html?UID=' + this.state.UID};
    return (
      <View style={styles.Page}>
          <WebView
            javaScriptEnabled={true}
            domStorageEnabled={true}
            source={WebViewURI} style={styles.WebView}/>
          <TouchableOpacity style={styles.ContinueContainer} onPress={this.Continue}>
            <View style={styles.ContinueButton}>
              <Text style={styles.ContinueText}>Continue ></Text>
            </View>
          </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  Page: {
    backgroundColor: '#151E3F',
    height: '100%',
    width: '100%',
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center'
  },

  Header: {
    color: 'white',
    fontSize: 40,
    fontWeight: '900',
    margin: 10,
    textAlign: 'center'
  },

  SubHeader: {
    color: 'white',
    fontSize: 20,
    margin: 10,
    textAlign: 'center'
  },

  PreviewContainer: {
    height: 200,
    width: 200,
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 8,
    marginVertical: 20,
    backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },

  ImagePreview: {
    height: 200,
    width: 200
  },

  ChooseButton: {
    height: 50,
    width: '100%',
    backgroundColor: '#1ED13F',
    marginTop: 20,
    justifyContent: 'center'
  },

  ChooseButtonText: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 20
  },

  SwitchToRegister: {
    color: '#bbbbbb',
    textDecorationLine: 'underline',
    marginVertical: 10,
    textAlign: 'center'
  },

  WebView: {
    height: '100%',
    backgroundColor: '#151E3F'
  },

  ContinueContainer: {
    width: '100%',
    overflow: 'hidden'
  },

  ContinueButton: {
    backgroundColor: '#893168',
    width: '100%',
    height: 50,
    justifyContent: 'center',
  },

  ContinueText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '900',
    fontFamily: 'Helvetica'
  }
});
