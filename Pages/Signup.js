import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, Image, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Alert} from 'react-native';

import fb from '../FirebaseConfig';

export default class SignupPage extends React.Component {
  state = {
    UsernameText: null,
    PasswordText: null,
    NameText: null,
    EmailText: null,
  }

  constructor(props) {
    super(props);
    this.IfValid = this.IfValid.bind(this);
    this.MakeAccount = this.MakeAccount.bind(this);
  }

  IfValid(actions){
    if(this.state.UsernameText.length >= 5){
      if(/^[a-zA-Z0-9- ]*$/.test(this.state.UsernameText) != false){
        if(this.state.PasswordText.length >= 8){
          if(/^[a-zA-Z0-9- ]*$/.test(this.state.PasswordText) != false){
            if(this.state.NameText.indexOf(' ') != -1 && this.state.NameText.length >= 5){
              if(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(this.state.EmailText.toLowerCase())){
                actions();
              }
              else {
                Alert.alert('Email invalid', "Bud, what kind of monkey business are you trying to pass off as an email address?", [{text: 'OK', onPress: () => console.log('OK Pressed')}], { cancelable: false });
              }
            }
            else {
              Alert.alert('Use your full name', "That doesn't look like a FULL name to me bud.", [{text: 'OK', onPress: () => console.log('OK Pressed')}], { cancelable: false });
            }
          }
          else {
            Alert.alert('No special characters', "You've got some funky looking characters in that password bud. Try to only use A-Z and 0-9.", [{text: 'OK', onPress: () => console.log('OK Pressed')}], { cancelable: false });
          }
        }
        else {
          Alert.alert('Password too short', "You really want to make it that easy for someone to hack you, bud? Take it from me, use at least 8 characters in your password.", [{text: 'OK', onPress: () => console.log('OK Pressed')}], { cancelable: false });
        }
      }
      else {
        Alert.alert('No special characters', "You've got some funky looking characters in that username bud. Try to only use A-Z and 0-9.", [{text: 'OK', onPress: () => console.log('OK Pressed')}], { cancelable: false });
      }
    }
    else {
      Alert.alert('Username too short', 'Looks like you need to slap a few more characters on that username bud. It needs to be at least 5 characters.', [{text: 'OK', onPress: () => console.log('OK Pressed')}], { cancelable: false });
    }
  }

  MakeAccount(){
    let email = this.state.EmailText;
    let password = this.state.PasswordText;
    let username = this.state.UsernameText;
    let name = this.state.NameText;
    let nav = this.props.navigation;

    this.IfValid(function(){
      fb.auth().createUserWithEmailAndPassword(email, password).then(function(user){
        fb.database().ref('Users/' + user.uid).set({
          Username: username,
          Name: name,
          ProfilePicUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Default_profile_picture_%28male%29_on_Facebook.jpg/600px-Default_profile_picture_%28male%29_on_Facebook.jpg',
          Stars: 0,
          POVCount: 0,
        }).then(function(){
          fetch('https://cliq-search-update.herokuapp.com/update');
          nav.navigate('ProfilePicUploader', {UID:user.uid});
        });
      }).catch(function(error){
        console.log(error.code);
        console.log(error.message);
        Alert.alert("Something's wrong here", error.message, [{text: 'OK', onPress: () => console.log('OK Pressed')}], { cancelable: false });
      });
    });
  }

  render() {
    return (
      <View style={styles.Page}>

          <Text style={styles.Header}>Sign Up</Text>
          <KeyboardAvoidingView behavior={'position'}>
          <View style={styles.Form}>
            <TextInput style={styles.Field} onChangeText={(text) => this.setState({EmailText: text})} placeholder={'Email'} autoCapitalize={'none'} autoCorrect={false} keyboardType={'email-address'}/>
            <TextInput style={styles.Field} onChangeText={(text) => this.setState({NameText: text})} placeholder={'Full Name'} autoCapitalize={'words'} autoCorrect={false}/>
            <TextInput style={styles.Field} onChangeText={(text) => this.setState({UsernameText: text})} placeholder={'Username'} autoCapitalize={'none'} autoCorrect={false}/>
            <TextInput style={styles.Field} onChangeText={(text) => this.setState({PasswordText: text})} placeholder={'Password'} autoCapitalize={'none'} autoCorrect={false} secureTextEntry={true}/>
            <TouchableOpacity onPress={this.MakeAccount}>
              <View style={styles.SubmitButton}>
                <Text style={styles.SubmitButtonText}>Next ></Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
              <Text style={styles.SwitchToRegister}>Already have an account? Log in</Text>
            </TouchableOpacity>
          </View>
          </KeyboardAvoidingView>
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
    justifyContent: 'center',
  },

  Avoider: {
    height: '100%',
    width: '100%',
    flex: 1,
    justifyContent: 'center',
  },

  Logo: {
    height: '20%',
    aspectRatio: 1,
    margin: 10,
    alignSelf: 'center'
  },

  Header: {
    color: 'white',
    fontSize: 40,
    fontWeight: '900',
    margin: 10,
    textAlign: 'center'
  },

  Form: {
    width: '100%',
    paddingHorizontal: 30,
    marginTop: 30,
    backgroundColor: '#151E3F',
  },

  Field: {
    height: 50,
    width: '100%',
    backgroundColor: 'white',
    fontSize: 20,
    padding: 10,
    marginVertical: 5
  },

  SubmitButton: {
    height: 50,
    width: '100%',
    backgroundColor: '#1ED13F',
    marginTop: 20,
    padding:5
  },

  SubmitButtonText: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  },

  SwitchToRegister: {
    color: '#bbbbbb',
    textDecorationLine: 'underline',
    marginVertical: 10,
    textAlign: 'center'
  },
});
