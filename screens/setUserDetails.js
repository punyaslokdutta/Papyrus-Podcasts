import React, {Component,useState,useEffect} from 'react';
import { StyleSheet, Text, View, ActivityIndicator, AsyncStorage} from 'react-native';
import {withFirebaseHOC} from './config/Firebase'
import {useSelector,useDispatch} from 'react-redux'
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';


async function retrieveDataPrivate(dispatch, userid)
{
  let doc = 9;
  const privateDataID = "private" + userid;
  const currentTime = moment().format();

  try{
   doc = await firestore().collection('users').doc(userid).collection("privateUserData").doc(privateDataID).get();          
      console.log("Inside Private QUERY");
      console.log(doc)
      
      doc._data.podcastsLiked && dispatch({type:'SET_PODCASTS_LIKED',payload:doc._data.podcastsLiked})

      doc._data.email && dispatch({type:'CHANGE_EMAIL',payload:doc._data.email})
      doc._data.name && dispatch({type:'CHANGE_NAME',payload:doc._data.name})
      doc._data.userName && dispatch({type:'CHANGE_USER_NAME',payload:doc._data.userName})
      doc._data.displayPicture && dispatch({type:'CHANGE_DISPLAY_PICTURE',payload:doc._data.displayPicture})
      doc._data.followingList.length && dispatch({type:'ADD_ALL_TO_FOLLOWING_MAP',payload:doc._data.followingList})
      doc._data.website && dispatch({type:'CHANGE_WEBSITE',payload:doc._data.website})
      doc._data.introduction && dispatch({type:'ADD_INTRODUCTION',payload: doc._data.introduction})
      doc._data.numCreatedBookPodcasts && dispatch({type:'ADD_NUM_CREATED_BOOK_PODCASTS',payload: doc._data.numCreatedBookPodcasts})
      doc._data.numCreatedChapterPodcasts && dispatch({type:'ADD_NUM_CREATED_CHAPTER_PODCASTS',payload: doc._data.numCreatedChapterPodcasts})
      doc._data.totalMinutesRecorded && dispatch({type:'UPDATE_TOTAL_MINUTES_RECORDED',payload: doc._data.totalMinutesRecorded})
      doc._data.numNotifications && dispatch({type:'ADD_NUM_NOTIFICATIONS',payload: doc._data.numNotifications});
      doc._data.userPreferences.length && dispatch({type:"SET_USER_PREFERENCES",payload:doc._data.userPreferences});
      console.log("WEBSITE: ",doc._data.website);
  }
  catch(error)
  {
      console.log("ERROR IN SET USER DETAILS\n\n");
      console.log(error)
  }

  try{
    await firestore().collection('users').doc(userid).collection('privateUserData').doc(privateDataID).set({
      lastSeenTime : currentTime 
    },{merge:true});
  } 
  catch(error)
  {
    console.log("[setUserDetails] lastSeenTime setting in firestore error");
  }

}

  async function retrieveDataPublic(dispatch,userid){

    let doc = 9;
    let doc2 = null;
    try{
     doc = await firestore().collection('users').doc(userid).get();
                   
        console.log("Inside PUBLIC QUERY");
        console.log(doc);
        const numFollowers = doc._data.followersList.length;
        numFollowers && dispatch({type:'ADD_NUM_FOLLOWERS',payload:numFollowers})
        
    }
    catch(error)
    {
        console.log("ERROR IN SET USER DETAILS\n\n");
        console.log(error)
    }

    
    
  }



const setUserDetails = (props) => {
    // const bookid = this.props.navigation.state.params;
    const userDoc = props.navigation.state.params.user;
    console.log("IN SET USER DETAILS\n\n",userDoc);

    const  userid = props.firebase._getUid();
    console.log(userid)
    const dispatch = useDispatch();

    useEffect( () => {
     //retrieveData(dispatch,userid);
     retrieveDataPrivate(dispatch, userid)
     retrieveDataPublic(dispatch,userid)
     props.navigation.navigate('App');
      }, [])

    

    //Have to write a separate dispatch statement which fills the isUserFollowing from the following array
    console.log("User Doc: ",userDoc.name);
    return (
        null
    )
}

export default withFirebaseHOC(setUserDetails);

