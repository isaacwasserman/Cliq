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

const Tabs = TabNavigator({
    Feed: {
      screen: FeedPage,
      navigationOptions: {
        tabBarLabel:"Feed",
        tabBarIcon: () => { return <Image style={{ width: 50, height: 50 }} source={{uri: 'https://facebook.github.io/react/img/logo_og.png'}}/>}
      }
    },
    Discover: {
      screen: DiscoverPage,
    },
    Review: {
      screen: ReviewPage,
      navigationOptions: {
        tabBarLabel:"Review",
      }
    },
    Me: {
      screen: MePage,
      navigationOptions: {
        tabBarLabel:"Me",
      }
    },
  },
  {
    initialRouteName: 'Me',
    tabBarOptions: {
      allowFontScaling: true,
      showIcon: true,
      showLabel: true,
      pressColor: '#000000',
      iconStyle: {
          width: 22,
          height: 22
      },
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
