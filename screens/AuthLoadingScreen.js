import React, {Component, useState, useEffect} from 'react';
import { StyleSheet, Text, View, ActivityIndicator, NativeEventEmitter, AsyncStorage,NativeModules,TouchableOpacity, Dimensions,Linking} from 'react-native';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import {createSwitchNavigator} from 'react-navigation'
import firebaseApi from './config/Firebase/firebaseApi'
import {withFirebaseHOC} from '../screens/config/Firebase'
import setUserDetails from './setUserDetails';
import Icon from 'react-native-vector-icons/FontAwesome'
import { useDispatch } from 'react-redux';
import dynamicLinks from '@react-native-firebase/dynamic-links';

const {width,height} = Dimensions.get('window')

const  AuthLoadingScreen = (props) => {
    
    const dispatch = useDispatch();
    //const [isAssetsLoadingComplete,setIsAssetsLoadingComplete] = useState(false);
  
    async function handleDeepLinkingRequests ()
    { 
      dynamicLinks().getInitialLink().then(url => {
        // Your custom logic here 
        console.log("[getInitialUrl] DYNAMIC LINK URL: ",url)
        if (url) {
          console.log("Linking.getInitialURL() : ",url);

          const prefixPlayer = "https://papyrusapp.page.link/player/";
          const prefixFlip = "https://papyrusapp.page.link/flips/";

          const playerIndex = url["url"].search("player");
          const flipsIndex = url["url"].search("flips");
          if(flipsIndex != -1)
          {
            const flipID = url["url"].slice(prefixFlip.length);
            console.log("[AUTH LOADING] handleOpenURL flipID: ",flipID);
            dispatch({type:"FLIP_ID_FROM_EXTERNAL_LINK",payload:flipID});
          }

          if(playerIndex != -1)
          {
            const podcastID = url["url"].slice(prefixPlayer.length);
            console.log("[AUTH LOADING] handleOpenURL podcastID: ",podcastID);
            dispatch({type:"PODCAST_ID_FROM_EXTERNAL_LINK",payload:podcastID});
          }
        }
     }).catch(error => { // Error handling });
     console.log(error);
     })

      // Linking.getInitialURL().then(url => { //
        
       

      //   if (url) {
      //     console.log("Linking.getInitialURL() : ",url);
      //     const prefix = "https://papyrusapp.page.link/player/";
      //     const prefixLength = prefix.length;
      //     const podcastID = url.slice(prefixLength);
      //     console.log("[AUTH LOADING] Linking.getInitialURL() podcastID: ",podcastID);
      //     dispatch({type:"PODCAST_ID_FROM_EXTERNAL_LINK",payload:podcastID});
      //   }
      // })
      // .catch(error => { // Error handling });
      // console.log(error);
      // })
    }
      
    async function handleOpenURL(event){

      dynamicLinks().onLink(url => {
        // Your custom logic here 
        console.log("DYNAMIC LINK URL: ",url)
        const prefixPlayer = "https://papyrusapp.page.link/player/";
        const prefixFlip = "https://papyrusapp.page.link/flips/";

        const playerIndex = url["url"].search("player");
        const flipsIndex = url["url"].search("flips");
        if(flipsIndex != -1)
        {
          const flipID = url["url"].slice(prefixFlip.length);
          console.log("[AUTH LOADING] handleOpenURL flipID: ",flipID);
          dispatch({type:"FLIP_ID_FROM_EXTERNAL_LINK",payload:flipID});
        }

        if(playerIndex != -1)
        {
          const podcastID = url["url"].slice(prefixPlayer.length);
          console.log("[AUTH LOADING] handleOpenURL podcastID: ",podcastID);
          dispatch({type:"PODCAST_ID_FROM_EXTERNAL_LINK",payload:podcastID});
        }
      
     });
      console.log("[AUTH LOADING] handleOpenURL url: ",url["url"]);
      
    }

//    Linking Notes:
// -> Linking.getInitialURL() method should only be called for the first time when the app is launched via app-swap
// -> For subsequent app-swap calls, handleOpenURL() method will be called as it is configured with linking event listener.
// -> remember to unsubscribe linking events in componentwillunmount()

    // componentWillUnmount() {
    //   Linking.removeEventListener('url', this.handleOpenURL);
    // }

    async function check_User_Auth()
    {
      try{   
        await props.firebase._checkUserAuth(async (user)=>
           {
             console.log("Inside _checkUserAuth")
             //console.log(this.props)
             
             if(user)
             {
               console.log(user)
 
 
               // [1] For email verification, the below given code is to be used.
               // [2] Have to use it before any payment related activities to block users from payment if email is not verified.
               // [3] In payment screen, we shall have to include another checkUserAuth so as to listen to user state change as 
               //     email is verified or not.
 
               // if (user.emailVerified == false) 
               // {
               //   user.sendEmailVerification().then(function() {
               //      console.log("Email sent.");
               //     }, function(error) {
               //      console.log(error)
               //     });
               // }
               // else 
               // {
               //   console.log('User email is verified');
               // }
 
               
                 var unsubscribe = await firestore().collection('users').doc(user._user.uid).onSnapshot(
                    (doc)=> {  
                     var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
                     console.log(source, " data: ", doc.data());
                     
                   if(doc.data()===undefined){
                     try{
                     
                     props.navigation.navigate('setPreferences',{
                         user : user, 
                         //fullName:this.state.fullName
                       })
 
                       //const addNewUser= await this.props.firebase._createNewUser(user)
                         }
                        catch(error)
                        {
                          console.log(error)
                        }
                       // this.props.navigation.navigate('setPreferences')
                   }
                   else
                   {
                         unsubscribe(); 
                         props.navigation.navigate('setUserDetails',{user : doc.data()});
                         props.navigation.navigate('CategoryScreen');
                         props.navigation.navigate('Explore');
                         
                   }
                 },function(error) {
                   console.log("Error in onSnapshot Listener in AuthLoadingScreen: ",error);
                 })     
                 
             }
             else{
               props.navigation.navigate('Auth')
             }
           })
         }
         catch(error)
         {
           console.log("Error in checkUserAuth in AuthLoadingScreen: ",error)
         }
    }

    useEffect( () => {
      Linking.addEventListener("url", handleOpenURL);
      handleDeepLinkingRequests();
      check_User_Auth();
    },[])


    // loadApp= async()=>
    // {
    //     const userToken= await AsyncStorage.getItem('userToken') //async /await  vs promises 
    //     this.props.navigation.navigate(userToken? 'App' : 'Auth' )
    // }


    // handleFinishLoading = () => {
    //   this.setState({ isAssetsLoadingComplete: true })
    // }
    
    function renderMainHeader()
    {
      return(
      <View style={styles.AppHeader}>
         <TouchableOpacity onPress={()=>this.props.navigation.toggleDrawer()}>
        <View style={{paddingLeft: 15,paddingRight:10 ,paddingVertical:18} }>
          <Icon name="bars" size={22} style={{color:'white'}}/>
        </View>
        </TouchableOpacity>
        <View>
        <Text style={{fontFamily:'sans-serif-light', color:'white', paddingLeft:15, fontSize:15, paddingTop:20}}>Papyrus</Text>
        </View>

        </View>
      )
    }

    
    return (
      <View>
      <View style={{paddingBottom: height/3}}>
    {renderMainHeader()}
        </View>
    <ActivityIndicator size={"large"} color={"black"}/>
    </View>     
    );
  
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




