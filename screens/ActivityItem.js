
import React, {Component, useState, useEffect, useContext} from 'react';
import { StyleSheet, Text, View, Image, Dimensions} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {useDispatch} from "react-redux"
import firestore from '@react-native-firebase/firestore';
import { withFirebaseHOC } from './config/Firebase';
import moment from 'moment';
var {width, height}=Dimensions.get('window')

 const areEqual = (prevProps, nextProps) => true
const ActivityItem = React.memo((props)=> {

  const realUserID = props.firebase._getUid();
  const dispatch = useDispatch();
  var currentDateTime = moment().format();

  var timeDiff = currentDateTime;//moment(currentDateTime).fromNow();
  if(props.activity.creationTimestamp)
    timeDiff = moment(props.activity.creationTimestamp).fromNow();

  async function retrievePodcast(podcastID)
  {
    try{
      const podcastCollection = await firestore().collectionGroup('podcasts').where('podcastID','==',podcastID).get();
      console.log("[ActivityItem] podcastCollection : ", podcastCollection);
      const podcastDocumentData = podcastCollection.docs[0]._data;
      console.log("[ActivityItem] podcastDocumentData : ", podcastDocumentData);
      dispatch({type:"SET_CURRENT_TIME", payload:0})
      dispatch({type:"SET_PAUSED", payload:false})
      dispatch({type:"SET_LOADING_PODCAST", payload:true});
      dispatch({type:"SET_DURATION", payload:podcastDocumentData.duration})
      dispatch({type:"ADD_NAVIGATION", payload:props.navigation})
      dispatch({type:"SET_PODCAST", payload: podcastDocumentData})
      dispatch({type:"SET_NUM_LIKES", payload: podcastDocumentData.numUsersLiked})
    }
    catch(error){
      console.log("Error in retrievePodcast() in ActivityItem: ",error);
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
    }
    

  }


  console.log("Inside [Activity Item]");
  console.log("[Activity Item] props in Activity Item: ",props);

  let activityText = <Text>{props.activity.actorName} liked your podcast -
  <Text style={{fontWeight:"bold"}}>{props.activity.podcastName}.</Text>
  </Text>
  if(props.activity.type == "follow")
  activityText = <Text>{props.activity.actorName} started following you.</Text>
    
        return (
          
              
            <View style={{flex:1,alignItems:'center',justifyContent:'center',flexDirection:"row",height:height/8}}>
            <TouchableOpacity onPress={() => {
              console.log("userClicked");

              retrieveUser(props,props.activity.actorID);
              
            }}>
            <View>
              <Image style={{borderRadius:60,width:height/16,height:height/16}} source={{uri: props.activity.actorImage}} />
            </View>
            </TouchableOpacity>
            <View style={{width:width/2,paddingLeft:width/25}}>
        
            {activityText}
            <Text style={{color:'gray'}}>{timeDiff}</Text>
            </View>
            <TouchableOpacity onPress={() => {
              console.log("podcastClicked")
              
                retrievePodcast(props.activity.podcastID);
              }}>
              
              <View style={{paddingLeft:20}}>
              <Image style={{borderRadius:10,width:height/16,height:height/16}} source={{uri: props.activity.podcastPicture}} />
              </View>
              </TouchableOpacity>
          </View>
      
        );
    
}, areEqual);

export default withFirebaseHOC(ActivityItem);
