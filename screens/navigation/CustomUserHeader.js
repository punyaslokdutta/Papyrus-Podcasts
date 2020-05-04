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

const followText = "   FOLLOW   ";
const followingText = "   FOLLOWING   ";


async function retrieveData(message,userid,otherPrivateUserItem,userDisplayPictureURL,name,privateDataID) 
{  
      
    if(message === followText)
    {
      console.log("FOLLOW Button is pressed");
       try{
          await firestore().collection('users').doc(otherPrivateUserItem.id).set({
            followersList : firestore.FieldValue.arrayUnion(userid),
            followerCount : firestore.FieldValue.increment(1)
        },{ merge:true })
       }
       catch(error){
         console.log("Error in adding to follower list of ",otherPrivateUserItem.id);
         console.log(error);
       }
        

       try{
          await firestore().collection('users').doc(userid).collection('privateUserData').doc(privateDataID).set({
            followingList : firestore.FieldValue.arrayUnion(otherPrivateUserItem.id),
            followingCount : firestore.FieldValue.increment(1)
        },{ merge:true })
       }
       catch(error){
         console.log("Error in adding to following list of ",userid);
         console.log(error);
       }
         
      const instance = firebase.app().functions("asia-northeast1").httpsCallable('addActivity');
      try {          
        await instance({ 
          timestamp : moment().format(),
          photoURL : userDisplayPictureURL,
          podcastID : null,
          userID : otherPrivateUserItem.id,
          podcastImageURL : null,
          type : "follow",
          Name : name
        });
      }
      catch (e) {
        console.log("Error in calling addActivity cloud function for Follow Activity");
        console.log(e);
      }    
    } 
    else if(message === followingText)
    {
      console.log("[CustomUserHeader] IN RETRIEVE DATA -- FOLLOWING");
      try{
          await firestore().collection('users').doc(otherPrivateUserItem.id).set({
            followersList : firestore.FieldValue.arrayRemove(userid),
            followerCount : firestore.FieldValue.increment(-1) 
        },{ merge:true })
      }
      catch(error){
        console.log("Error in removing from followers list of ",otherPrivateUserItem.id);
      }
      
        
      try{
          await firestore().collection('users').doc(userid).collection('privateUserData').doc(privateDataID).set({
            followingList : firestore.FieldValue.arrayRemove(otherPrivateUserItem.id),
            followingCount : firestore.FieldValue.increment(-1) 
        },{ merge:true })
      }
      catch(error){
        console.log("Error in adding to following list of ",userid);
        console.log(error);
      }
    }   
};


const CustomUserHeader = (props) => {
    
  console.log("Entering [CustomUserHeader]");
  
  const otherPrivateUserItem = useSelector(state=>state.userReducer.otherPrivateUserItem);
  const userDisplayPictureURL = useSelector(state=>state.userReducer.displayPictureURL);
  const name = useSelector(state=>state.userReducer.name);
  const userid =  props.firebase._getUid();
  const privateDataID = "private" + userid;
  
  let wholestring = followText;
  console.log("[CustomUserHeader] otherPrivateUserItem = ",otherPrivateUserItem);
  let initialMessage = useSelector(state=>state.userReducer.isUserFollowing[otherPrivateUserItem.id])
  let printMessage = useSelector(state=>state.userReducer.isUserFollowing)
  if(initialMessage === true)
    wholestring = followingText;
  
  console.log("[CustomUserHeader] isUserFollowing = ", printMessage)
  const [message,setMessage] = useState(wholestring);
  const dispatch=useDispatch();
  const lastCharacter = otherPrivateUserItem.name[otherPrivateUserItem.name.length - 1];
  return (
    <View>
    <View style={{alignItems:'flex-end',paddingRight:10,paddingTop:10}}>
    <Button title={message} style={{flex:1, height:SCREEN_HEIGHT/25, width:SCREEN_WIDTH/3,
                borderRadius:5, backgroundColor:theme.colors.primary}} onPress={() => {
                  
                  if(message === followText)
                  {
                    console.log("FoLLow")
                    dispatch({
                      type: "ADD_TO_FOLLOWING_MAP",
                      payload: otherPrivateUserItem.id
                    })
                    setMessage(followingText)
                    console.log(printMessage)
                  }
                    
                  else if(message === followingText)
                  {
                    console.log("UnFOLLOW")
                    console.log(message)
                    dispatch({
                      type: "REMOVE_FROM_FOLLOWING_MAP",
                      payload: otherPrivateUserItem.id
                    })
                    setMessage(followText)
                    console.log(printMessage)
                  }
                  else
                  {
                    console.log('UNDEFINEDDDDDDDDD')
                    console.log(message);
                  }

                    console.log("Before retrieve data: ",message)
                  retrieveData(message,userid,otherPrivateUserItem,userDisplayPictureURL,name,privateDataID);

                }}></Button>
    </View>
      <View style={{alignItems:'center',justifyContent:'center', flexDirection:'column',paddingBottom:10}}>
        <View style={{alignItems:'center',flexDirection:'column'}}>
        {
          lastCharacter == 's'
          ?
          <Text style={{fontSize:theme.sizes.h3}}>{otherPrivateUserItem.name}'</Text>
          :
          <Text style={{fontSize:theme.sizes.h3}}>{otherPrivateUserItem.name}'s</Text>
        }
          <View style = {{alignItems:'center'}}>
      <Text style={{fontWeight:"bold",fontSize:theme.sizes.h2,paddingRight:5}}>{"   "}Collections{"   "}</Text>              
          </View>
          </View>
          <TouchableOpacity style={{alignItems:'center'}} onPress={() => props.navigation.navigate({
            routeName : 'UserStatsScreen',
            params : {item:otherPrivateUserItem},
            key : 'user1' + otherPrivateUserItem.id
        })}>
          <Image
              source={{uri : otherPrivateUserItem.displayPicture}}
              style={styles.avatar}
            />
            </TouchableOpacity>
          </View>
          </View>
  );   
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