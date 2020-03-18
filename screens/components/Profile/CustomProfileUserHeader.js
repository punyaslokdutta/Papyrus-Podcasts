
import React, {Component,useState,useEffect} from 'react';
//import UserBookPodcast from '../components/Explore/UserBookPodcast';
//import UserChapterPodcast from '../components/Explore/UserChapterPodcast';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import { StyleSheet, View, TouchableOpacity, Image, Dimensions, Button, ScrollView} from 'react-native';
import { Block, Text } from '../categories/components'
import { theme } from '../categories/constants';
import UserStatsScreen from '../Explore/UserStatsScreen'
import { withFirebaseHOC } from '../../config/Firebase';
import firestore from '@react-native-firebase/firestore';
import {useDispatch,useSelector} from "react-redux"; 
import { firebase } from '@react-native-firebase/functions';

//const admin = require('firebase-admin')

var {width:SCREEN_WIDTH, height:SCREEN_HEIGHT}=Dimensions.get('window')
const IS_IPHONE_X = SCREEN_HEIGHT === 812 || SCREEN_HEIGHT=== 896;
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 44 : 20) : 0;
const HEADER_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 88 : 64) : 64;
const NAV_BAR_HEIGHT = HEADER_HEIGHT - STATUS_BAR_HEIGHT;


async function retrieveData(message,userid,item,userDisplayPictureURL,name) 
{
    try{
      console.log("USERID")
      console.log(userid)
      console.log(item.id)
      var val = userid

    if(message === 'FOLLOW')
    {
        let addQuery1 = await firestore().collection('users').doc(item.id).set({
                   followers_list : firestore.FieldValue.arrayUnion(userid),
                   isUserFollower : {[val] : true},
               },{ merge:true })
        let addQuery2 = await firestore().collection('users').doc(userid).set({
                   following_list : firestore.FieldValue.arrayUnion(item.id)
               },{ merge:true })
      
        const instance = firebase.app().functions("asia-northeast1").httpsCallable('addActivity');
        try 
        {          
          await instance({ // change in podcast docs created by  user
            timestamp : Date.now(),
            photoURL : userDisplayPictureURL,
            PodcastID : null,
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


        console.log("IN RETRIEVE DATA -- FOLLOWWWWWWWWWWWWWWWWWWWWWWWWWWW")
        
    } 
    else if(message === 'FOLLOWING')
     {
      let removeQuery1 = await firestore().collection('users').doc(item.id).set({
        followers_list : firestore.FieldValue.arrayRemove(userid),
        isUserFollower : {[val] : false},
    },{ merge:true })
      
    let removeQuery2 = await firestore().collection('users').doc(userid).set({
      following_list : firestore.FieldValue.arrayRemove(item.id)
  },{ merge:true })

    
console.log("IN RETRIEVE DATA -- FOLLOWING")
     }   
   }
    catch(error){
      console.log(error)
    }
  
};


const CustomProfileUserHeader = (props) => {
    {console.log("Inside Custom Profile Explore user header ..................||||||||||||||||||||||")}
    

    if(props === undefined || props.navigation === undefined || props.navigation.state === undefined || props.navigation.state.routes[3] === undefined || 
        props.navigation.state.routes[3].params === undefined)
        {
          console.log("ERROR  ",props.navigation.state.routes[1]);
            return(
              
                <Text>FGHJVBJ</Text>
            )        
        }
    else
    {
      const userDisplayPictureURL = useSelector(state=>state.userReducer.displayPictureURL);
      const name = useSelector(state=>state.userReducer.name);

      console.log("ERROR 222222 ",props.navigation.state.routes[1]);
       var text1 = "Follow+";
       let item = "W";
       const  userid =  props.firebase._getUid()
      item = props.navigation.state.routes[3].params.userData;
      let wholestring = 'FOLLOW';
       
      let initialMessage = useSelector(state=>state.userReducer.isUserFollowing[item.id])
      let printMessage = useSelector(state=>state.userReducer.isUserFollowing)
      if(initialMessage === true)
        wholestring = 'FOLLOWING'
      
      console.log("\nINITIAL FOLLOW MESSAGEEEEEEEEEEEEEEEEEEEEEE : ", printMessage)
     const [message,setMessage] = useState(wholestring);//props.navigation.state.routes[1].params.followsOrNot);
     const dispatch=useDispatch();

    // const following = useSelector(state=>state.userReducer.followingList)
     //console.log("This is the Following List.",following);
     
      return (
        <View>
        <View style={{alignItems:'flex-end',paddingRight:10,paddingTop:10}}>
        <Button title={message} style={{flex:1,alignItems:'flex-end', justifyContent:'flex-end', height:SCREEN_HEIGHT/25, width:SCREEN_WIDTH/3,
                    borderRadius:5, backgroundColor:theme.colors.primary}} onPress={() => {
                      
                      if(message === 'FOLLOW')
                      {
                        console.log("FoLLow")
                        dispatch({
                          type: "ADD_TO_FOLLOWING_MAP",
                          payload: item.id
                        })
                        setMessage('FOLLOWING')
                        console.log(printMessage)
                      }
                        
                      else if(message === 'FOLLOWING')
                      {
                        console.log("UnFOLLOW")
                        console.log(message)
                        dispatch({
                          type: "REMOVE_FROM_FOLLOWING_MAP",
                          payload: item.id
                        })
                        setMessage('FOLLOW')
                        console.log(printMessage)
                      }
                      else
                      {
                        console.log('UNDEFINEDDDDDDDDD')
                        console.log(message);
                      }

                        console.log("Before retrieve data: ",message)
                      retrieveData(message,userid,item,userDisplayPictureURL,name);

                    }}></Button>
        </View>
          <View style={{alignItems:'center',justifyContent:'center', flexDirection:'column'}}>
            <View style={{flexDirection:'column'}}>
      <Text h3 >{props.navigation.state.routes[3].params.userData.name}'s</Text>
              <View style = {{alignItems:'center'}}>
              <Text h2 bold>Collections</Text>
              </View>
              </View>
              
              <TouchableOpacity style={{alignItems:'center'}} onPress={() => props.navigation.navigate('UserStatsScreen',{item:props.navigation.state.routes[3].params.userData})}>
              <Image
                  source={{uri : props.navigation.state.routes[3].params.userData.displayPicture}}
                  style={styles.avatar}
                />
                </TouchableOpacity>
              </View>
              </View>
      );
    }
    
  };

  export default withFirebaseHOC(CustomProfileUserHeader);

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