

import React, {Component} from 'react';
import {TouchableOpacity, StyleSheet, Text, View, AsyncStorage} from 'react-native';

// async/await vs callbacks vs promise objects 
class SignInScreen extends React.Component {

  signIn=async()=>
  {
    await AsyncStorage.setItem('userToken', 'punyaslok') // This AsyncStorage store the token on the device, so that a user can be signed in when he/she revisits
    this.props.navigation.navigate('App')
  }
   
    render() {
      return (
        <View style={styles.container}>
        <TouchableOpacity style={styles.buttonStyle}
			onPress={this.signIn}
		  >
			 <Text style={styles.textStyle}>Complete Sign In</Text>
		  </TouchableOpacity>
          
        </View>
      );
    }
  }

export default SignInScreen;


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
  buttonStyle: {
    padding:10,
    backgroundColor: '#202646',
    borderRadius:5
    },
    textStyle: {
      fontSize:20,
    color: '#ffffff',
    textAlign: 'center'
    },
});




