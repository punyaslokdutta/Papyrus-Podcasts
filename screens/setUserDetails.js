import React, {Component,useState,useEffect} from 'react';
import { StyleSheet, Text, View, ActivityIndicator, AsyncStorage} from 'react-native';
import {withFirebaseHOC} from './config/Firebase'
import {useSelector,useDispatch} from 'react-redux'
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';

 


const setUserDetails = (props) => {
    // const bookid = this.props.navigation.state.params;
    const userDoc = props.navigation.state.params.user;
    console.log("IN SET USER DETAILS\n\n",userDoc);

    const  userid = props.firebase._getUid();
    console.log(userid)
    const dispatch = useDispatch();


    async function retrieveDataPrivate(){
      let doc = null;
      const privateDataID = "private" + userid;
      const currentTime = moment().format();

    try{
    doc = await firestore().collection('users').doc(userid).collection("privateUserData").doc(privateDataID).get();          
        console.log("Inside Private QUERY");
        console.log(doc)
        
        doc._data.isAdmin !== undefined && dispatch({type:'SET_ADMIN_USER',payload:doc._data.isAdmin})

        doc._data.flipsLiked && dispatch({type:'SET_FLIPS_LIKED',payload:doc._data.flipsLiked})
        doc._data.podcastsLiked && dispatch({type:'SET_PODCASTS_LIKED',payload:doc._data.podcastsLiked})
        doc._data.podcastsBookmarked && dispatch({type:'SET_PODCASTS_BOOKMARKED',payload:doc._data.podcastsBookmarked})
        doc._data.booksBookmarked && dispatch({type:'SET_BOOKS_BOOKMARKED',payload:doc._data.booksBookmarked})
        doc._data.chaptersBookmarked && dispatch({type:'SET_CHAPTERS_BOOKMARKED',payload:doc._data.chaptersBookmarked})
        doc._data.bookmarksCountArray && dispatch({type:'SET_BOOKMARKS_COUNT_ARRAY',payload:doc._data.bookmarksCountArray})
        doc._data.likesCountArray != null && doc._data.likesCountArray != undefined
         && dispatch({type:'SET_LIKES_COUNT_ARRAY',payload:doc._data.likesCountArray})
        doc._data.lastPlayingPodcastID && dispatch({type:'SET_LAST_PLAYING_PODCASTID',payload:doc._data.lastPlayingPodcastID})
        doc._data.lastPlayingCurrentTime && dispatch({type:'SET_LAST_PLAYING_CURRENT_TIME',payload:doc._data.lastPlayingCurrentTime})

        doc._data.email && dispatch({type:'CHANGE_EMAIL',payload:doc._data.email})
        doc._data.name && dispatch({type:'CHANGE_NAME',payload:doc._data.name})
        doc._data.userName && dispatch({type:'CHANGE_USER_NAME',payload:doc._data.userName})
        doc._data.displayPicture && dispatch({type:'CHANGE_DISPLAY_PICTURE',payload:doc._data.displayPicture})
        doc._data.followingList.length && dispatch({type:'ADD_ALL_TO_FOLLOWING_MAP',payload:doc._data.followingList})
        doc._data.website && dispatch({type:'CHANGE_WEBSITE',payload:doc._data.website})
        doc._data.introduction && dispatch({type:'ADD_INTRODUCTION',payload: doc._data.introduction})
        doc._data.languagesComfortableTalking && dispatch({type:'SET_USER_LANUAGES',payload: doc._data.languagesComfortableTalking})
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

  async function retrieveDataPublic(){

    let doc = null;
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
  
  async function retrieveAlgoliaKeys(){
    try{
      const doc = await firestore().collection('algoliaIndex').doc('key').get();

      doc._data.apiKey && dispatch({type:'SET_ALGOLIA_API_KEY',payload:doc._data.apiKey});
      doc._data.appID && dispatch({type:'SET_ALGOLIA_APP_ID',payload:doc._data.appID});
    }
    catch(error){
      console.log("Error in retrieving algolia keys in setUserDetails: ",error);
    }
    
  }

  useEffect( () => {
    retrieveDataPrivate()
    retrieveDataPublic()
    retrieveAlgoliaKeys();
    props.navigation.navigate('App');
  }, [])

    

    //Have to write a separate dispatch statement which fills the isUserFollowing from the following array
    console.log("User Doc: ",userDoc.name);
    return (
        null
    )
}

export default withFirebaseHOC(setUserDetails);

