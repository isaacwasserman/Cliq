import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

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

console.disableYellowBox = true;

type Props = {};

const Tabs = TabNavigator({
    Feed: {
      screen: FeedPage,
      navigationOptions: {
        tabBarLabel:"Feed",
      }
    },
    Discover: {
      screen: DiscoverPage,
      navigationOptions: {
        tabBarLabel:"Discover",
      }
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
