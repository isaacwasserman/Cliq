import React from 'react';
import { Animated, Easing, StyleSheet, Text, View, Image, TouchableWithoutFeedback } from 'react-native';

export default class SOCButton extends React.Component {
  componentWillMount(){
    this.animatedValue = new Animated.Value(1);
  }
  depressed(){
    console.log('depressed');
    Animated.timing(this.animatedValue, {
      toValue:0.98,
      duration:100
    }).start();
  }
  unpressed(){
    console.log('unpressed');
    Animated.timing(this.animatedValue, {
      toValue:1,
      duration:100
    }).start();
  }
  render() {
    let pressedStyle = {transform: [{scale:this.animatedValue}]};
    return (
        <TouchableWithoutFeedback onPressIn={this.depressed.bind(this)} onPressOut={this.unpressed.bind(this)}>
          <Animated.View style={pressedStyle}>
            {this.props.children}
          </Animated.View>
        </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  // RecentPOV: {
  //   backgroundColor: '#e8e8e8',
  //   width: '100%',
  //   height: null,
  //   marginVertical: 15,
  //   borderRadius: 20,
  //   padding: 15,
  //   flexDirection:'row'
  // }
});
