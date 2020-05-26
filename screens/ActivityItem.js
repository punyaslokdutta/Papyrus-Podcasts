
import React, {Component, useState, useEffect, useContext} from 'react';
import { StyleSheet, Text, View, Image, Dimensions} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {useDispatch, useSelector} from "react-redux"
import firestore from '@react-native-firebase/firestore';
import { withFirebaseHOC } from './config/Firebase';
import moment from 'moment';
import Toast from 'react-native-simple-toast';

var {width, height}=Dimensions.get('window')

 const areEqual = (prevProps, nextProps) => true
const ActivityItem = React.memo((props)=> {
  const podcast = useSelector(state=>state.rootReducer.podcast);
  const realUserID = props.firebase._getUid();
  const dispatch = useDispatch();
  var currentDateTime = moment().format();

  var timeDiff = currentDateTime;//moment(currentDateTime).fromNow();
  if(props.activity.creationTimestamp)
    timeDiff = moment(props.activity.creationTimestamp).fromNow();

  async function retrievePodcast(podcastID)
  {
    try{
      if(podcast === null || (podcast!== null && podcast.podcastID != podcastID))
      {
        const podcastCollection = await firestore().collectionGroup('podcasts').where('podcastID','==',podcastID).get();
        console.log("[ActivityItem] podcastCollection : ", podcastCollection);
        const podcastDocumentData = podcastCollection.docs[0]._data;
        console.log("[ActivityItem] podcastDocumentData : ", podcastDocumentData);
        dispatch({type:"SET_CURRENT_TIME", payload:0})
        dispatch({type:"SET_PAUSED", payload:false})
        dispatch({type:"SET_LOADING_PODCAST", payload:true});
        dispatch({type:"SET_DURATION", payload:podcastDocumentData.duration})
        dispatch({type:"ADD_NAVIGATION", payload:props.navigation})
        podcast === null && dispatch({type:"SET_MINI_PLAYER_FALSE"});
        dispatch({type:"SET_PODCAST", payload: podcastDocumentData})
        dispatch({type:"SET_NUM_LIKES", payload: podcastDocumentData.numUsersLiked})
      }
      
    }
    catch(error){
      console.log("Error in retrievePodcast() in ActivityItem: ",error);
      Toast.show('This podcast has been deleted');

    }
  }

  async function retrieveUser(props,userID)
  {
    try{
      const privateDataID = "private" + userID;
      const userDocument = await firestore().collection('users').doc(userID).collection('privateUserData').doc(privateDataID).get();
      console.log("[ActivityItem] userDocument : ", userDocument);
      const userDocumentData = userDocument.data();
      console.log("[ActivityItem] userDocumentData : ", userDocumentData);
      
      const isUserSame = (userID == realUserID);

      if(isUserSame)
      {
        props.navigation.navigate('ProfileTabNavigator')
      }
      else
      {
        dispatch({type:"SET_OTHER_PRIVATE_USER_ITEM",payload:userDocumentData});
        props.navigation.navigate('ExploreTabNavigator',{userData:userDocumentData});
      }
        
      
    }
    catch(error){
      console.log("Error in retrieveUser() in ActivityItem: ",error);
      console.log("This user account does not exist anymore");
    }
    

  }


  console.log("Inside [Activity Item]");
  console.log("[Activity Item] props in Activity Item: ",props);

  let activityText = <Text>{props.activity.actorName} liked your podcast -
  <Text style={{fontFamily:'Proxima-Nova-Bold'}}>{props.activity.podcastName}</Text>
  </Text>
  if(props.activity.type == "follow")
    activityText = <Text style={{}}>{props.activity.actorName} started following you</Text>
    


      if(props.activity.type == "follow")
      {
        return (
          <TouchableOpacity onPress={() => {
            console.log("userClicked");

            retrieveUser(props,props.activity.actorID);
            
          }}>
          <View style={{flex:1,alignItems:'center',flexDirection:"row",height:height/8}}>
          
          <View style={{paddingLeft:width/25}}>
            <Image style={{borderRadius:60,width:height/16,height:height/16}} source={{uri: props.activity.actorImage}} />
          </View>
         
          <View style={{width:width*2/3,paddingLeft:width/25}}>
      
          {activityText}
          <Text style={{color:'gray'}}>{timeDiff}</Text>
          </View>
          </View>
          </TouchableOpacity>
        );
      }
      else
      {
        return (
          
          <View style={{flex:1,alignItems:'center',flexDirection:"row",height:height/8}}>
         <View>
          <TouchableOpacity onPress={() => {
            console.log("userClicked");
            retrieveUser(props,props.activity.actorID);
          }}>
            <View style={{paddingLeft:width/25}}>
            <Image style={{borderRadius:60,paddingLeft:width/15,width:height/16,height:height/16}} source={{uri: props.activity.actorImage}} />
            </View>
          </TouchableOpacity>
          </View>
          <View style={{flexDirection:'row'}}>
          <TouchableOpacity onPress={() => {
            console.log("podcastClicked");
              retrievePodcast(props.activity.podcastID);
            }}>
               <View style={{flexDirection:'row'}}>
          <View style={{width:width*2/3,paddingLeft:width/25}}>
      
          {activityText}
          <Text style={{color:'gray'}}>{timeDiff}</Text>
          </View>
         
          
            <View style={{paddingLeft:width/30}}>
            <Image style={{borderRadius:10,width:height/16,height:height/16}} source={{uri: props.activity.podcastPicture}} />
            </View>
            </View>
            </TouchableOpacity>

            </View>
           
        </View>
    
      );
      }
        
    
}, areEqual);

export default withFirebaseHOC(ActivityItem);
