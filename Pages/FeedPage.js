import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, StatusBar, FlatList, RefreshControl } from 'react-native';

import FeedPOV from '../Components/FeedPOV';

import fb from '../FirebaseConfig';
import algoliasearch from 'algoliasearch/reactnative';
var client = algoliasearch('KWELHTLEC3', 'd61f683228ca54c031f62eac964cd904');
var index = client.initIndex('POVS');
import SOCButton from '../Components/SOCButton';

export default class FeedPage extends React.Component {
  state = {
    refreshing: false,
  }

  constructor(props) {
    super(props);
    this._onRefresh = this._onRefresh.bind(this);
  }

  GETPostData() {
    let page = this;
    client.initIndex('POVS').search({ query: '', hitsPerPage: 20, }, function searchDone(err, content) {
      if (err) {
        console.error(err);
        return;
      }
      else {
        this.setState({POVS: content.hits});
        console.log(content.hits);
        this.setState({refreshing: false});
      }
    }.bind(this));
  }

  _onRefresh() {
    client.clearCache()
    this.setState({refreshing: true});
    this.GETPostData();
    console.log('refreshing');
  }

  componentWillUnmount(){
    client.clearCache();
  }

  componentWillMount(){
    this.GETPostData();
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
           barStyle="light-content"
         />
        <View style={styles.TitleBar}>
          <Text style={styles.TitleText} numberOfLines={1}>The Feed</Text>
        </View>
        <View style={styles.Scroller}>
          <View style={styles.PageBody}>
            <FlatList style={styles.ListContainer} data={this.state.POVS} refreshing={this.state.refreshing} onRefresh={this._onRefresh} keyExtractor={(item, index) => item.Timestamp} renderItem={({item}) => <FeedPOV POV={item}/>}/>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  Scroller: {
    width:'100%',
    flex: 1,
  },
  TitleBar: {
    width: '100%',
    backgroundColor: '#1daeff',
    shadowOpacity: .5,
    shadowOffset: {height:0,width:0},
    shadowRadius: 10,
    shadowColor: 'rgba(0,0,0,0.5)',
  },
  TitleText: {
    fontSize: 30,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    color: 'white',
    marginVertical:30,
    top: 5,
    marginHorizontal:20,
    maxWidth: '100%',
  },
  PageBody: {
    top:20,
    backgroundColor:'#FFFFFF',
    width:'100%',
    zIndex:0,
    paddingVertical: 0,
    paddingHorizontal: 15,
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
  },
  ListContainer: {
    width: '100%',
    height:'100%',
  }
});
