

import React, {Component} from 'react';
import { StyleSheet, Text, View, ActivityIndicator, AsyncStorage} from 'react-native';

import {createSwitchNavigator} from 'react-navigation'


class AuthLoadingScreen extends Component {
    constructor()
    {
        super()
        this.loadApp();
    }
    loadApp= async()=>
    {
        const userToken= await AsyncStorage.getItem('userToken') //async /await  vs promises 
        this.props.navigation.navigate(userToken? 'App' : 'Auth' )
    }
    render() {
      return (
        <View style={styles.container}>
          <ActivityIndicator/>
        </View>
      );
    }
  }

  /*class AuthLoadingScreen extends React.Component {
    
    render() {
      return (
        <View style={styles.container}>
          <ActivityIndicator/>
        </View>
      );
    }
}*/


export default AuthLoadingScreen;

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




