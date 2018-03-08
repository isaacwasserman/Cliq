import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, Image, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Alert, AsyncStorage } from 'react-native';

import fb from '../FirebaseConfig';

export default class LoginPage extends React.Component {
  state = {
    EmailText: null,
    PasswordText: null
  }

  constructor(props) {
    super(props);
    this.Authorize = this.Authorize.bind(this);

    let nav = this.props.navigation;
    fb.auth().onAuthStateChanged(function(user) {
      if (user) {
        nav.navigate('Me');
      }
    });
  }

  Authorize(){
    let email = this.state.EmailText;
    let password = this.state.PasswordText;
    let nav = this.props.navigation;
    fb.auth().signInWithEmailAndPassword(email, password).then(function(user){
      AsyncStorage.setItem('UID', user.uid);
      AsyncStorage.getItem('UID').then(function(item){
        console.log(item);
      });
      nav.navigate('Me');
    }).catch(function(error) {
      Alert.alert("Something's wrong here", error.message, [{text: 'OK', onPress: () => console.log('OK Pressed')}], { cancelable: false });
    });
  }

  render() {
    let Assets = {
      Logo: require('../Resources/Images/Cliq_Logo.png'),
    };
    return (
      <View style={styles.Page}>
        <KeyboardAvoidingView style={styles.Avoider} behavior={'position'}>
          <Image style={styles.Logo} source={Assets.Logo}/>
          <Text style={styles.Header}>Cliq</Text>
          <View style={styles.Form}>
            <TextInput style={styles.Field} onChangeText={(text) => this.setState({EmailText: text})} placeholder={'Email'} autoCapitalize={'none'} autoCorrect={false} keyboardType={'email-address'}/>
            <TextInput style={styles.Field} onChangeText={(text) => this.setState({PasswordText: text})} placeholder={'Password'} autoCapitalize={'none'} autoCorrect={false} secureTextEntry={true}/>
            <TouchableOpacity onPress={this.Authorize}>
              <View style={styles.SubmitButton}>
                <Text style={styles.SubmitButtonText}>Log In</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Signup')}>
              <Text style={styles.SwitchToRegister}>Don&#39;t have an account? Register</Text>
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
    fontSize: 80,
    fontWeight: '900',
    margin: 10,
    textAlign: 'center'
  },

  Form: {
    width: '100%',
    paddingHorizontal: 30,
    marginTop: 30
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
