
import React, {Component,useState,useEffect} from 'react';
import UserBookPodcast from '../components/Explore/UserBookPodcast';
import UserChapterPodcast from '../components/Explore/UserChapterPodcast';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import { StyleSheet, View, TouchableOpacity, Image,Text, Dimensions, Button, ScrollView} from 'react-native';
import { Block } from '../components/categories/components'
import { theme } from '../components/categories/constants';
import UserStatsScreen from '../components/Explore/UserStatsScreen'
import { withFirebaseHOC } from '../config/Firebase';
import firestore from '@react-native-firebase/firestore';
import {useDispatch,useSelector} from "react-redux"; 
import { firebase } from '@react-native-firebase/functions';
import moment from 'moment';

//const admin = require('firebase-admin')

var {width:SCREEN_WIDTH, height:SCREEN_HEIGHT}=Dimensions.get('window')
const IS_IPHONE_X = SCREEN_HEIGHT === 812 || SCREEN_HEIGHT=== 896;
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 44 : 20) : 0;
const HEADER_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 88 : 64) : 64;
const NAV_BAR_HEIGHT = HEADER_HEIGHT - STATUS_BAR_HEIGHT;

async function retrieveData(message,userid,item,userDisplayPictureURL,name,userItem,privateDataID) 
{  
    try{
      console.log("USERID")
      console.log(userid)
      console.log(item.id)
      var val = userid

    if(message === 'FOLLOW ')
    {
        let addQuery1 = await firestore().collection('users').doc(item.id).set({
                   followersList : firestore.FieldValue.arrayUnion(userid),
                   followerCount : firestore.FieldValue.increment(1)
               },{ merge:true })
        let addQuery2 = await firestore().collection('users').doc(userid).collection('privateUserData').doc(privateDataID).set({
                   followingList : firestore.FieldValue.arrayUnion(item.id),
                   followingCount : firestore.FieldValue.increment(1)
               },{ merge:true })
      
               const instance = firebase.app().functions("asia-northeast1").httpsCallable('addActivity');
               try 
               {          
                 await instance({ // change in podcast docs created by  user
                   timestamp : moment().format(),
                   photoURL : userDisplayPictureURL,
                   podcastID : null,
                   userID : item.id,
                   podcastImageURL : null,
                   type : "follow",
                   Name : name
                 });
               }
               catch (e) 
               {
                 console.log(e);
               }      

        console.log("[CustomUserHeader] IN RETRIEVE DATA -- FOLLOW")
        
        //const list1 = useSelector(state=>state.userReducer.followingList);

        //console.log(list1);
    } 
    else if(message === 'FOLLOWING ')
     {
      let removeQuery1 = await firestore().collection('users').doc(item.id).set({
        followersList : firestore.FieldValue.arrayRemove(userid),
        followerCount : firestore.FieldValue.increment(-1) 
    },{ merge:true })
      
    let removeQuery2 = await firestore().collection('users').doc(userid).collection('privateUserData').doc(privateDataID).set({
      followingList : firestore.FieldValue.arrayRemove(item.id),
      followingCount : firestore.FieldValue.increment(-1) 

  },{ merge:true })

    
console.log("[CustomUserHeader] IN RETRIEVE DATA -- FOLLOWING")
     }   
   }
     
    catch(error){
      console.log(error)
    }
  
};


const CustomUserHeader = (props) => {
    
    console.log("Entering [CustomUserHeader]");
    
    if(props === undefined || props.navigation === undefined || props.navigation.state === undefined || props.navigation.state.routes[1] === undefined || 
        ((props.navigation.state.routes[2] != undefined && props.navigation.state.routes[2].params === undefined) && props.navigation.state.routes[1].params === undefined && (props.navigation.state.routes[3] === undefined || props.navigation.state.routes[3].params === undefined)))
        {
          console.log("[CustomUserHeader] ERROR");
          console.log("[CustomUserHeader] props.navigation.state.routes = ",props.navigation.state.routes);
            
         // props.navigation.goBack();
          //props.navigation.goBack();
         //props.navigation.popToTop();
          return(
                                
                <Text>CustomUserHeader is not visible due to programmatic errors.</Text>
            )        
        }
    else
    {
      console.log("[CustomUserHeader] NO ERROR");
      console.log("[CustomUserHeader] props.navigation.state.routes = ",props.navigation.state.routes);
      const userItem = useSelector(state=>state.userReducer.userItem);
      //props.navigation.popToTop();
      const userDisplayPictureURL = useSelector(state=>state.userReducer.displayPictureURL);
      const name = useSelector(state=>state.userReducer.name);
      let item = "W";
      const userid =  props.firebase._getUid();
      const privateDataID = "private" + userid;
      
      if(props.navigation.state.routes[2] != undefined && props.navigation.state.routes[2].params != undefined && 
        props.navigation.state.routes[2].params.userData != undefined)
      {
      item = props.navigation.state.routes[2].params.userData;
      console.log("[CustomUserHeader] Got item from ROUTES[2]");
      }
      else if(props.navigation.state.routes[3] && props.navigation.state.routes[3].params && 
                (props.navigation.state.routes[1].params === undefined || props.navigation.state.routes[1].params.userData === undefined))
      {
      item = props.navigation.state.routes[3].params.userData;
      console.log("[CustomUserHeader] Got item from ROUTES[3]");
      }  
      if(props.navigation.state.routes[1] && props.navigation.state.routes[1].params && 
              (props.navigation.state.routes[3] === undefined || props.navigation.state.routes[3].params === undefined || 
                props.navigation.state.routes[3].params.userData === undefined))
      {
      item = props.navigation.state.routes[1].params.userData;
      console.log("[CustomUserHeader] Got item from ROUTES[1]");
      }
      

      
    
      let wholestring = 'FOLLOW ';
       
      console.log("[CustomUserHeader] item = ",item);
      let initialMessage = useSelector(state=>state.userReducer.isUserFollowing[item.id])
      let printMessage = useSelector(state=>state.userReducer.isUserFollowing)
      if(initialMessage === true)
        wholestring = 'FOLLOWING '
      
      console.log("[CustomUserHeader] isUserFollowing = ", printMessage)
      const [message,setMessage] = useState(wholestring);
      const dispatch=useDispatch();
 
      return (
        <View>
        <View style={{alignItems:'flex-end',paddingRight:10,paddingTop:10}}>
        <Button title={message} style={{flex:1, height:SCREEN_HEIGHT/25, width:SCREEN_WIDTH/3,
                    borderRadius:5, backgroundColor:theme.colors.primary}} onPress={() => {
                      
                      if(message === 'FOLLOW ')
                      {
                        console.log("FoLLow")
                        dispatch({
                          type: "ADD_TO_FOLLOWING_MAP",
                          payload: item.id
                        })
                        setMessage('FOLLOWING ')
                        console.log(printMessage)
                      }
                        
                      else if(message === 'FOLLOWING ')
                      {
                        console.log("UnFOLLOW")
                        console.log(message)
                        dispatch({
                          type: "REMOVE_FROM_FOLLOWING_MAP",
                          payload: item.id
                        })
                        setMessage('FOLLOW ')
                        console.log(printMessage)
                      }
                      else
                      {
                        console.log('UNDEFINEDDDDDDDDD')
                        console.log(message);
                      }

                        console.log("Before retrieve data: ",message)
                      retrieveData(message,userid,item,userDisplayPictureURL,name,userItem,privateDataID);

                    }}></Button>
        </View>
          <View style={{alignItems:'center',justifyContent:'center', flexDirection:'column'}}>
            <View style={{flexDirection:'column'}}>
      
            <Text style={{fontSize:theme.sizes.h3}}>{item.name}'s</Text>
              <View style = {{alignItems:'center'}}>
              <Text style={{fontWeight:"bold",fontSize:theme.sizes.h2,paddingRight:5}}>Collections</Text>              
              </View>
              </View>
              <TouchableOpacity style={{alignItems:'center'}} onPress={() => props.navigation.navigate({
                routeName : 'UserStatsScreen',
                params : {item:item},
                key : 'user1' + item.id
            })}>
              <Image
                  source={{uri : item.displayPicture}}
                  style={styles.avatar}
                />
                </TouchableOpacity>
              </View>
              </View>
      );
    }
    
  };

  export default withFirebaseHOC(CustomUserHeader);

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
      drawerimage:
      {
        height: 100, 
        width:100, 
        borderRadius:50, 
  
      }, 
      contentContainer: {
        flexGrow: 1,
      },
      navContainer: {
        height: HEADER_HEIGHT,
        marginHorizontal: 10,
      },
      statusBar: {
        height: STATUS_BAR_HEIGHT,
        backgroundColor: 'transparent',
      },
      navBar: {
        height: NAV_BAR_HEIGHT,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: 'transparent',
      },
      titleStyle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
      },
      header: {
        paddingHorizontal: theme.sizes.base * 2,
        paddingTop: theme.sizes.base * 2.5,
        paddingBottom :theme.sizes.base * 0.5,
      }, 
       avatar: {
      height: theme.sizes.base * 2.2,
      width: theme.sizes.base * 2.2,
      borderRadius: theme.sizes.base * 2.2, 
      
    }
  });