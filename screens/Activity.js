

import React, {Component} from 'react';
import { StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import FontAwesome, { Icons } from 'react-native-fontawesome';


class Activity extends React.Component {
   
    render() {
      return(
        <View style={styles.container}>
          <Text>Activity screen</Text>
        </View>
      );
    }
  }

export default Activity;


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
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
