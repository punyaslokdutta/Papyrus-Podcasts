

import React, {Component} from 'react';
import { StyleSheet, Text, View, ActivityIndicator, AsyncStorage} from 'react-native';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
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

        this.props.firebase._checkUserAuth=this.props.firebase._checkUserAuth.bind(this)
       
        //this.loadApp();
    }

   

//     decideRoute=async()=>
//     {
//       try{
//         //console.log(previousProps)
//         console.log("hhhhhhhdhddhhd")
//        // console.log(this.props)
       
//         await firebase.auth().onAuthStateChanged(async user => {
//           if(user)
//           {
//             console.log(user)
//             // if the user has previously logged in
//            /// console.log("ddddd"+ this.props.firebase)
//             const query11 = await firestore().collection('users').doc(user._user.uid).onSnapshot(
//               async function(doc) {
//                 var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
//                 console.log(source, " data: ", doc.data());

//                 if(!doc._data)  
//                 {
//                   //this.props.navigation.navigate('App')
//                   try{
//                  // await this._createNewUser(user)
//                   // this.props.navigation.navigate('App')
//                     //this.props.navigation.navigate('')
//                     console.log("QQUUEERRYY");
//                     //console.log(query11);
//                     const documentRef = await firestore().collection('users').doc(`${user._user.uid}`).set({
//                         name: user._user.displayName,
//                         username: "",
//                         displayPicture: user._user.photoURL,
//                         email: user._user.email,
//                         introduction: "",
//                         follower_count: 0,
//                         following_count: 0,
//                         followers_list: [],
//                         following_list: [],
//                         listened_book_podcasts_count: 0,
//                         listened_chapter_podcasts_count: 0,
//                         created_book_podcasts_count: 0,
//                         created_chapter_podcasts_count: 0,
//                         timespent_by_user_listening: 0,
//                         timespent_total_by_listeners_listening: 0,
//                         languages_comfortable_talking: [], 
//                         timestamp : Date.now()
//                         });
                
//                     const user1 = await firestore().collection('users').doc(`${user._user.uid}`)
//                     let documentSnapshots = await user1.get();
//                     // let documentSnapshots = await initialQuery.get();
//                     // console.log(documentSnapshots);
//                     const doc1 = await user1.collection('privateUserData').doc("privateData").set({
//                                         uid: user._user.uid,
//                                         phoneNumber: user._user.phoneNumber,
//                                         account_creation_time: 25,
//                                         lastSignIn_time: 26,
//                                         following_posts: [],
//                                         book_recommendations: bookRec,
//                                         podcast_recommendations: podRec,
//                                         listen_count_in_previous_day: 0,
//                                         podcasts_list_user_liked: 0,
//                                         retention_rate_of_listeners: 0,
//                                         gnosis_score: 0
//                     });
//                     console.log("Firestore mei Data ADD HO GAYA")
//                     console.log(doc1);
              




//                     } catch(error){
//                       console.log(error);
//                     }
    
//                 }
//                 else
//                 {
//                   this.props.navigation.navigate('App')

//                 }
            
            


//             //console.log(user.ad)
           
          
       
//       }) 
//     }
//     else{

//       this.props.navigation.navigate('Auth')

//     }  
// })
// //}
//     } catch (error) {
//       console.log(error)
//     }
//     }

    
    componentDidMount=async()=>{
    //  try {
        // previously
        //this.decideRoute()
        console.log(this)
        console.log(this.props)
     try{   await this.props.firebase._checkUserAuth(async (user)=>
          {
            console.log("Inside _checkUserAuth")
            console.log(this.props)
            if(user)
            {
              console.log(user)
              //console.log(user)
            // if the user has previously logged in
           /// console.log("ddddd"+ this.props.firebase)
              try{
                const query11 = await firestore().collection('users').doc(user._user.uid).onSnapshot(
                  async(doc)=> {
                    var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
                    console.log(source, " data: ", doc.data());
                  if(doc.data()===undefined){
                    try{
                      console.log(this)
                      console.log(this.props)
                      const addNewUser= await this.props.firebase._createNewUser(user)// 
                      var num = 1000000000000
                      
                      console.log(addNewUser)
                      // if(addNewUser === undefined)
                      // {
                      //   this.props.navigation.navigate('App')
                      // }
                      //while(--num);
                     // this.props.navigation.navigate('App')
                       }
                       catch(error)
                       {
                         console.log(error)
                       }
               
                  }
                  else{
                        //unsubscribe(); // unsubscribe the firestore onSnapshot listener 
                      //  setTimeout( ()=>{
     
                      //   //Put All Your Code Here, Which You Want To Execute After Some Delay Time.
                        this.props.navigation.navigate('App');
                      //   //Alert.alert("Alert Shows After 5 Seconds of Delay.")
                   
                      // }, 5000);
                        
                   
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




