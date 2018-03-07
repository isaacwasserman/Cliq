import React from 'react';
import { Animated, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

export default class DiscoverPageUser extends React.Component {
  state = {
    Name: this.props.User.Name,
    Username: this.props.User.Username,
    ProfilePicUrl: this.props.User.ProfilePicUrl,
    UID: this.props.User.objectID
  }

  componentWillMount(){
  }

  constructor(props) {
    super(props);
    this.Choose = this.Choose.bind(this);
  }

  Choose(){
  }

  render() {
    return (
      <SOCButton>
        <View style={styles.AutoCompleteOption} onPress={() => this.Choose()}>
          <Image style={styles.AutoCompleteProfilePic} source={{uri: this.state.ProfilePicUrl}}/>
          <View style={styles.AutoCompleteInfo}>
            <Text style={styles.AutoCompleteName}>{this.state.Name}</Text>
            <Text style={styles.AutoCompleteUsername}>@{this.state.Username}</Text>
          </View>
        </View>
      </SOCButton>
    );
  }
}

const styles = StyleSheet.create({
  AutoCompleteOption: {
    height: 100,
    padding: 13,
    borderRadius: 20,
    backgroundColor: '#e8e8e8',
    flexDirection: 'row',
    marginTop: 10
  },
  AutoCompleteProfilePic: {
    width: 74,
    aspectRatio: 1,
    borderRadius: 10
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
