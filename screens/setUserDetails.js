import React, {Component,useState,useEffect} from 'react';
import { StyleSheet, Text, View, ActivityIndicator, AsyncStorage} from 'react-native';
import {withFirebaseHOC} from './config/Firebase'
import {useSelector,useDispatch} from 'react-redux'
import firestore from '@react-native-firebase/firestore';





async function retrieveDataPrivate(dispatch, userid)
{


  let doc = 9;
  const privateDataID = "private" + userid;
  try{
   doc = await firestore().collection('users').doc(userid).collection("privateUserData").doc(privateDataID).get();          
      console.log("Inside Private QUERY");
      console.log(doc)
      
      doc._data.podcastsLiked && dispatch({type:'SET_PODCASTS_LIKED',payload:doc._data.podcastsLiked})

      doc._data.email && dispatch({type:'CHANGE_EMAIL',payload:doc._data.email})
      doc._data.name && dispatch({type:'CHANGE_NAME',payload:doc._data.name})
      doc._data.userName && dispatch({type:'CHANGE_USER_NAME',payload:doc._data.userName})
      doc._data.displayPicture && dispatch({type:'CHANGE_DISPLAY_PICTURE',payload:doc._data.displayPicture})
      doc._data.following_list.length && dispatch({type:'ADD_ALL_TO_FOLLOWING_MAP',payload:doc._data.following_list})
      doc._data.website && dispatch({type:'CHANGE_WEBSITE',payload:doc._data.website})
      doc._data.introduction && dispatch({type:'ADD_INTRODUCTION',payload: doc._data.introduction})
      doc._data.numCreatedBookPodcasts && dispatch({type:'ADD_NUM_CREATED_BOOK_PODCASTS',payload: doc._data.numCreatedBookPodcasts})
      doc._data.numCreatedChapterPodcasts && dispatch({type:'ADD_NUM_CREATED_CHAPTER_PODCASTS',payload: doc._data.numCreatedChapterPodcasts})
      doc._data.totalMinutesRecorded && dispatch({type:'ADD_TOTAL_MINUTES_RECORDED',payload: doc._data.totalMinutesRecorded})
      
      console.log("WEBSITE: ",doc._data.website);
  }
  catch(error)
  {
      console.log("ERROR IN SET USER DETAILS\n\n");
      console.log(error)
  }

}

  async function retrieveDataPublic(dispatch,userid){

    let doc = 9;
    try{
     doc = await firestore().collection('users').doc(userid).get();
                   
        console.log("Inside PUBLIC QUERY");
        console.log(doc);
        const numFollowers = doc._data.followers_list.length;
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

