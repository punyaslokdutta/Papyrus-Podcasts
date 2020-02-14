import React, {Component} from 'react';
import { StyleSheet, Text, View, ActivityIndicator, AsyncStorage} from 'react-native';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import {createSwitchNavigator} from 'react-navigation'
import firebaseApi from './config/Firebase/firebaseApi'
import {withFirebaseHOC} from '../screens/config/Firebase'
import setUserDetails from './setUserDetails';
import setPreferences from '../setPreferences'

class  AuthLoadingScreen extends Component {
    constructor(props)
    {
        super(props)
        {
          this.state={
            isAssetsLoadingComplete: false, 
          }
        }
        this.props.firebase._checkUserAuth=this.props.firebase._checkUserAuth.bind(this)
        //this.loadApp();
    }

    componentDidMount=async()=>{
    
        console.log(this)
        console.log(this.props)
        //this.props.navigation.navigate('setPreferences')
     try{   
       await this.props.firebase._checkUserAuth(async (user)=>
          {
            console.log("Inside _checkUserAuth")
            console.log(this.props)
            if(user)
            {
              console.log(user)
              try{
                var unsubscribe = await firestore().collection('users').doc(user._user.uid).onSnapshot(
                  async(doc)=> {
                    var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
                    console.log(source, " data: ", doc.data());
                    
                  if(doc.data()===undefined){
                    try{
                      console.log(this)
                      console.log(this.props)

                      const addNewUser= await this.props.firebase._createNewUser(user)
                        }
                       catch(error)
                       {
                         console.log(error)
                       }
                      // this.props.navigation.navigate('setPreferences')
                  }
                  else
                  {
                        unsubscribe(); // unsubscribe the firestore onSnapshot listener
                        
                        this.props.navigation.navigate('setUserDetails',{user : doc.data()});
                        this.props.navigation.navigate('App');
                  }
                })
              }
              catch(error)
              {
                console.log("ERRRRRRRRRRROOOOORRRRRRRRRRRRR")
                 console.log(error)
              }
            
          }
            else{
             // this.props.navigation.navigate('setPreferences')
              this.props.navigation.navigate('Auth')
            }
       })
        }catch(error)
          {
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




