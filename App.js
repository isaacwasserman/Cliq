import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Image } from 'react-native';

import { StackNavigator, TabNavigator } from 'react-navigation';

//import Pages
import UserPage from './Pages/User'
import DiscoverPage from './Pages/Discover'
import LoginPage from './Pages/Login'
import SignupPage from './Pages/Signup'
import ProfilePicUploaderPage from './Pages/ProfilePicUploader'
import FeedPage from './Pages/FeedPage'
import MePage from './Pages/MePage'
import ReviewPage from './Pages/Review'
import EasterEggPage from './Pages/EasterEgg'

console.disableYellowBox = true;

type Props = {};

let TabIconSize = 25

const Tabs = TabNavigator({
    Feed: {
      screen: FeedPage,
      navigationOptions: {
        tabBarLabel:"Feed",
        tabBarIcon: ({focused, tintColor}) => {
          let suffix = '_Unfocused'
          if(focused){
            return <Image style={{ width: TabIconSize, height: TabIconSize, resizeMode: 'contain' }} source={require('./Resources/Images/TabBar_Icons_Feed.png')}/>
          }
          else {
            return <Image style={{ width: TabIconSize, height: TabIconSize, resizeMode: 'contain' }} source={require('./Resources/Images/TabBar_Icons_Feed_Unfocused.png')}/>
          }
        }
      }
    },
    Discover: {
      screen: DiscoverPage,
      navigationOptions: {
        tabBarLabel:"Discover",
        tabBarIcon: ({focused, tintColor}) => {
          let suffix = '_Unfocused'
          if(focused){
            return <Image style={{ width: TabIconSize, height: TabIconSize, resizeMode: 'contain' }} source={require('./Resources/Images/TabBar_Icons_Discover.png')}/>
          }
          else {
            return <Image style={{ width: TabIconSize, height: TabIconSize, resizeMode: 'contain' }} source={require('./Resources/Images/TabBar_Icons_Discover_Unfocused.png')}/>
          }
        }
      }
    },
    Review: {
      screen: ReviewPage,
      navigationOptions: {
        tabBarLabel:"Review",
        tabBarIcon: ({focused, tintColor}) => {
          let suffix = '_Unfocused'
          if(focused){
            return <Image style={{ width: TabIconSize, height: TabIconSize, resizeMode: 'contain' }} source={require('./Resources/Images/TabBar_Icons_Review.png')}/>
          }
          else {
            return <Image style={{ width: TabIconSize, height: TabIconSize, resizeMode: 'contain' }} source={require('./Resources/Images/TabBar_Icons_Review_Unfocused.png')}/>
          }
        }
      }
    },
    Me: {
      screen: MePage,
      navigationOptions: {
        tabBarLabel:"Me",
        tabBarIcon: ({focused, tintColor}) => {
          let suffix = '_Unfocused'
          if(focused){
            return <Image style={{ width: TabIconSize, height: TabIconSize, resizeMode: 'contain' }} source={require('./Resources/Images/TabBar_Icons_Me.png')}/>
          }
          else {
            return <Image style={{ width: TabIconSize, height: TabIconSize, resizeMode: 'contain' }} source={require('./Resources/Images/TabBar_Icons_Me_Unfocused.png')}/>
          }
        }
      }
    },
  },
  {
    initialRouteName: 'Me',
    tabBarOptions: {
      allowFontScaling: true,
      showIcon: true,
      showLabel: true,
      activeTintColor: '#1daeff',
      style: {
          // backgroundColor: '#000000',
          elevation: 2,
      },
      indicatorStyle: {  backgroundColor: '#FFF' }
    }
  }
);

const RootStack = StackNavigator(
  {
    //All Tabs
    Tabs: {
      screen: Tabs,
    },
    //Other Pages
    Signup: {
      screen: SignupPage,
    },
    ProfilePicUploader: {
      screen: ProfilePicUploaderPage,
    },
    Login: {
      screen: LoginPage,
    },
    User: {
      screen: UserPage,
    },
    EasterEgg: {
      screen: EasterEggPage,
    },
  },
  {
    initialRouteName: 'Tabs',
    headerMode: 'none'
  }
);

export default class App extends Component<Props> {
  render() {
    return (
      <RootStack/>
    );
  }
}
