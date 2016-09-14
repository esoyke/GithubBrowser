'use strict';

var React = require('react');
var ReactNative = require('react-native');
var moment = require('moment');
var PushPayload = require('./PushPayload');
var {
  ActivityIndicator,
  Image,
  ListView,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} = ReactNative;

class Feed extends React.Component{
  constructor(props){
    super(props);
    var ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 != r2
    });

    this.state = {
      dataSource: ds.cloneWithRows(['A', 'B', 'C']),
      showProgress: true
    }
  }

  componentDidMount() {
    this.fetchFeed();
  }

  fetchFeed(){
    require('./AuthService').getAuthInfo((err, authInfo) => {
      var url = 'https://api.github.com/users/'
      + authInfo.user.login
      + '/events';

      fetch(url, {
        headers: authInfo.header
      })
      .then((response)=> response.json() )
      .then((responseData)=> {
        //console.log(responseData);
        var feedItems = responseData.filter((ev)=> ev.type == 'PushEvent');
        console.log(feedItems);
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(feedItems),
          showProgress: false
        })
      })
    })
  }

  pressRow(rowData) {
    this.props.navigator.push({
      title: 'Push Event',
      component: PushPayload,
      passProps: {
        pushEvent: rowData
      }
    })
  }

  renderRow(rowData) {
    // As of React .14 you need to wrap object with JSON.stringify, but I'm having a hard time getting
    // individual nested values then?
    //return <Text style={styles.row}>{JSON.stringify(rowData.repo)}</Text>
    //console.log(JSON.stringify(rowData.actor));
    return (
      <TouchableHighlight onPress={()=>this.pressRow(rowData)} underlayColor='#DDD'>
        <View style={styles.row}>
          <Image source = {{uri: rowData.actor.avatar_url}} style={styles.rowImage}/>
          <View style={styles.rowInfoPanel, styles.rowInfoPanelText}>
            <Text >{moment(rowData.created_at).fromNow()}</Text>
            <Text >{rowData.actor.login}</Text>
            <Text style={styles.rowInfoPanelTextRepo}>{rowData.repo.name.replace(rowData.actor.login+'/', '')} - {rowData.payload.ref.replace('refs/heads/', '')}</Text>
          </View>
        </View>
      </TouchableHighlight>
      )

  }

  render() {
    if(this.state.showProgress){
      return (
        <View style={styles.container}>
          <ActivityIndicator
            animating={true}
            size='large'
            style={styles.loader} />
        </View>
        )
    }
    return (
      <View style={styles.feed}>
        <ListView dataSource={this.state.dataSource}
        renderRow={this.renderRow.bind(this)} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  feed: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 10,
    paddingTop: 60
  },
  container: {
    paddingTop: 20,
    flex: 1,
    justifyContent: 'center'
  },
  loader: {
    // none
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    borderColor: '#D7D7D7',
    borderBottomWidth: 1,
    backgroundColor: '#FFF'
  },
  rowImage: {
    height: 36,
    width: 36,
    borderRadius: 18,
    marginRight: 10
  },
  rowInfoPanel: {
    paddingLeft: 20
  },
  rowInfoPanelText: {
    backgroundColor: '#FFF',
  },
  rowInfoPanelTextRepo: {
      fontWeight: '600'
  }
});

module.exports = Feed;