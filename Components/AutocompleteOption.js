import React from 'react';
import { Animated, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

import dismissKeyboard from 'react-native-dismiss-keyboard';

export default class AutocompleteOption extends React.Component {
  state = {
    Name: this.props.User.Name,
    Username: this.props.User.Username,
    ProfilePicUrl: this.props.User.ProfilePicUrl,
    UID: this.props.User.objectID,
    Stars: this.props.User.Stars,
    POVCount: this.props.User.POVCount
  }

  componentWillMount(){
  }

  constructor(props) {
    super(props);
    this.Choose = this.Choose.bind(this);
  }

  Choose(){
    this.props.parentState({ToChosen: 1, ToUser: this.state, AutoCompleteListData:[] });
    if(this.props.ClearSearch){
      this.props.ClearSearch();
    }
    if(this.props.parentNavigation){
      this.props.parentNavigation.navigate('User', {User: this.state});
    }
    dismissKeyboard();
  }

  render() {
    return (
      <TouchableOpacity style={styles.AutoCompleteOption} onPress={() => this.Choose()}>
        <Image style={styles.AutoCompleteProfilePic} source={{uri: this.state.ProfilePicUrl}}/>
        <View style={styles.AutoCompleteInfo}>
          <Text style={styles.AutoCompleteName}>{this.state.Name}</Text>
          <Text style={styles.AutoCompleteUsername}>@{this.state.Username}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  AutoCompleteOption: {
    width: '100%',
    height: 75,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#e8e8e8',
    flexDirection: 'row'
  },
  AutoCompleteProfilePic: {
    width: 55,
    aspectRatio: 1,
  },
  AutoCompleteInfo: {
    flexDirection: 'column',
    marginLeft: 20
  },
  AutoCompleteName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2b2b2b'
  },
  AutoCompleteUsername: {
    color: 'grey'
  },
});
