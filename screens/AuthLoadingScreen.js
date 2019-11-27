

import React, {Component} from 'react';
import { StyleSheet, Text, View, ActivityIndicator, AsyncStorage} from 'react-native';

import {createSwitchNavigator} from 'react-navigation'
import firebaseApi from './config/Firebase/firebaseApi'
import {withFirebaseHOC} from '../screens/config/Firebase'


class  AuthLoadingScreen extends Component {
    constructor(props)
    {
        super(props)
        {
          this.state={
            isAssetsLoadingComplete: false, 
          }
        }
        //this.loadApp();
    }
    componentDidMount = async () => {
      try {
        // previously
        //this.loadApp()
       
        await this.props.firebase._checkUserAuth(user => {
          if (user) {
            console.log(user)
            // if the user has previously logged in
            this.props.navigation.navigate('App')
          } else {

            // if the user has previously signed out from the app
            this.props.navigation.navigate('Auth')
          }
        })
       
      } catch (error) {
        console.log(error)
      }
    }


    /*loadLocalAsync = async () => {
      return await Promise.all([
        Asset.loadAsync([
          require('../assets/flame.png'),
          require('../assets/icon.png')
        ]),
        Font.loadAsync({
          ...Icon.Ionicons.font
        })
      ])
    }*/

    handleLoadingError = error => {
      // In this case, you might want to report the error to your error
      // reporting service, for example Sentry
      console.warn(error)
    }


    loadApp= async()=>
    {
        const userToken= await AsyncStorage.getItem('userToken') //async /await  vs promises 
        this.props.navigation.navigate(userToken? 'App' : 'Auth' )
    }


    handleFinishLoading = () => {
      this.setState({ isAssetsLoadingComplete: true })
    }


    render() {
      return (
        <View style={styles.container}>
          <ActivityIndicator/>
        </View>
      );
    }
  }

  

export default withFirebaseHOC(AuthLoadingScreen);

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




