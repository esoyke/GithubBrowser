'use strict';

var React = require('react');
var ReactNative = require('react-native');
var moment = require('moment');
var {
  Image,
  ListView,
  StyleSheet,
  Text,
  View
} = ReactNative;

class PushPayload extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      pushEvent: props.pushEvent
    }
  }

  render() {
    console.log(this.state.pushEvent);
    return (
      <View style={styles.payload}>
        <Image source={{uri: this.state.pushEvent.actor.avatar_url}} style={styles.image} />
        <Text style={styles.textLarge}>{moment(this.state.pushEvent.created_at).fromNow()}</Text>
        <Text style={styles.text}>{this.state.pushEvent.actor.login} pushed to</Text>
        <Text>{this.state.pushEvent.payload.ref.replace('refs/heads/', '')}</Text>
        <Text>at {this.state.pushEvent.repo.name}</Text>
        {/* Seems like a lot of code to do a conditional render */}
        <Text >{( ()=>{
            if(this.state.pushEvent.payload.commits.length>1)
              return this.state.pushEvent.payload.commits.length+' Commits'
            else
              return '1 Commit'
          }
          )() }  
        </Text>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  payload: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 80
  },
  image: {
    height: 120,
    width: 120,
    borderRadius: 60
  },
  textLarge: {
    paddingTop: 20,
    paddingBottom: 20,
    fontSize: 20
  }
  
});

module.exports = PushPayload;