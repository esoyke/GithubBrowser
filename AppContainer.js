'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Feed = require('./Feed');

var {
  Image,
  Platform,
  StyleSheet,
  NavigatorIOS,
  TabBarIOS,
  Text,
  View
} = ReactNative;

class AppContainer extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      selectedTab: 'feed'
    }
  }
            // <Feed/>
  render() {
    return (
      <TabBarIOS style={styles.container}>
        <TabBarIOS.Item
          title='Feed'
          selected={this.state.selectedTab == 'feed'}
          icon={require('image!inbox')}
          onPress={()=>{ this.setState({selectedTab: 'feed'})}}
        >

          <NavigatorIOS style={styles.navigator}
            initialRoute = {{
              component: Feed,
              title: 'Feed'
            }}>
          </NavigatorIOS>
        </TabBarIOS.Item>

        <TabBarIOS.Item
          title='Search'
          selected={this.state.selectedTab == 'search'}
          icon={require('image!inbox')}
          onPress={()=>{ this.setState({selectedTab: 'search'})}}
        >
        <Text style={styles.welcome}>Tab 2</Text>
        </TabBarIOS.Item>
      </TabBarIOS>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  navigator: {
    flex: 1
  }
});

module.exports = AppContainer;