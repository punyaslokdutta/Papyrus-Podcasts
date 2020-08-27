import React, {Component, useState, useEffect, useContext} from 'react';
import { StyleSheet, Text, View, Image, Dimensions,Alert,TouchableNativeFeedback,TouchableWithoutFeedback,Share,TouchableOpacity, ImageBackground, ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import * as theme from '../constants/theme'
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import ImageZoom from 'react-native-image-pan-zoom';

import { firebase } from '@react-native-firebase/functions';
import {withFirebaseHOC} from '../../config/Firebase';
import {useSelector, useDispatch,connect} from "react-redux"
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import EnTypoIcon from 'react-native-vector-icons/Entypo';
import TrackPlayer, { usePlaybackState,useTrackPlayerProgress } from 'react-native-track-player';
import PlayPauseOut from '../PodcastPlayer/PlayPauseOut';
import LottieView from 'lottie-react-native';
import playPause from '../../../assets/animations/play_pause.json';
import newAnimation from '../../../assets/animations/double-sided-bars.json';
import FontAwesome, { Icons } from 'react-native-vector-icons/FontAwesome';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import Toast from 'react-native-simple-toast';
import likeButton from '../../../assets/animations/836-like-button.json';
import { NetworkContext } from '../../config/NetworkProvider';

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

var {width, height}=Dimensions.get('window');

class Podcast extends React.Component {
   
  static contextType = NetworkContext

    constructor(props)
    {
     super(props)
     {
      this.state={
        userID: this.props.podcast.podcasterID,
        realUserID: this.props.firebase._getUid(),
        createdOn: moment(this.props.podcast.createdOn).fromNow(),
        reposted: this.props.isPodcastBookmarked[this.props.podcast.podcastID],
        liked: this.props.isPodcastLiked[this.props.podcast.podcastID],
        numLikes: this.props.podcast.numUsersLiked,
        podcastColor : "white",
        numRetweets: this.props.podcast.numUsersRetweeted === undefined ? 0 : this.props.podcast.numUsersRetweeted
        }
     }
    }

    componentDidMount = () => {
      console.log("[Podcast] componentDidMount of podcastID - ",this.props.podcast.podcastID);
       //this.animation.play(0,30);
       this.likeAnimation.pause();
    }

  componentDidUpdate =(prevProps)=> { 

      console.log("[Podcast] componentDidUpdate of podcastID - ",this.props.podcast.podcastID);
      if(this.props.podcastRedux !== null && this.props.podcastRedux.podcastID == this.props.podcast.podcastID) 
      {
        if(!this.props.pausedRedux){
          this.animation !== undefined && this.animation.play(0,33);
        }
        else
          this.animation !== undefined && this.animation.pause();

        // isMiniPlayer OR isPodcastLiked

        if(!prevProps.isMiniPlayer && this.props.isMiniPlayer)
        {
          this.setState({
            numLikes : this.props.numLikesRedux,
            numRetweets : this.props.numRetweetsRedux
          })

          if(!this.props.isPodcastLiked[this.props.podcast.podcastID])
          {
            this.likeAnimation.play(0,0);
            this.likeAnimation.pause();
          }
        }
        
        this.state.podcastColor == 'white' &&
        this.setState({ podcastColor : '#cfe6e3' });
      }
      else
      {
        this.animation !== undefined && this.animation !== null && this.animation.pause();
        if(this.state.podcastColor == '#cfe6e3') 
        {
          this.setState({ podcastColor : 'white' });
        }
      }
      
  }

  togglePlay = async () => {
    const currentState = await TrackPlayer.getState()
    const isPlaying = (currentState === TrackPlayer.STATE_PLAYING) 
    //dispatch({type:"TOGGLE_PLAY_PAUSED"});
      if (isPlaying) {
          return TrackPlayer.pause()
      } else {
          return TrackPlayer.play()
      }  
  }

  buildDynamicURL = async () => {
    const link = await dynamicLinks().buildShortLink({
      //link: 'https://newpodcast.com/' + props.podcast.podcastID,
      link: 'https://papyrusapp.page.link/player/' + this.props.podcast.podcastID,
      // domainUriPrefix is created in your firebase console
      domainUriPrefix: 'https://papyrusapp.page.link/',
      // optional set up which updates firebase analytics campaign
      // "banner". This also needs setting up before hand
      analytics: {
        campaign: 'banner',
      },
      android: {
        packageName: 'com.papyrus_60',
        minimumVersion: '8',
        fallbackUrl: 'http://www.papyruspodcasts.com'
      },
      social: {
        title: this.props.podcast.podcastName,
        descriptionText: this.props.podcast.podcastDescription.slice(0,100),
        imageUrl: this.props.podcast.podcastPictures[0]
      }
    });
  
    console.log("dynamicURL created for the link: ",link);
    Share.share({
      title : this.props.podcast.podcastName,
      //url : link,
      message: link
    },{
      dialogTitle: 'Share Podcast'
    })
    return link;
  }

  handleOnPressBookmark = () => {
    //smallAnimatedBookmarkIcon.bounceIn();
    if(this.props.isPodcastBookmarked[this.props.podcast.podcastID] != true)
    {
      //smallAnimatedBookmarkIcon.bounceIn();
      //setBookmarkedState(true);
      this.addToBookmarks();
    }
    else
    {
      //smallAnimatedBookmarkIcon.bounceIn();
      //setBookmarkedState(false);
      this.removeFromBookmarks();
      
    }
  }
   removeFromBookmarks = async() => {

    const privateDataID = "private" + this.state.realUserID;

    if(this.props.podcastRedux && this.props.podcastRedux.podcastID == this.props.podcast.podcastID) 
        this.props.dispatch({type:'SET_NUM_RETWEETS',payload:this.state.numRetweets - 1});
    this.props.dispatch({type:"REMOVE_FROM_PODCASTS_BOOKMARKED",payload:this.props.podcast.podcastID});
      this.setState({
        reposted : false,
        numRetweets : this.state.numRetweets - 1
      })

    firestore().collection('users').doc(this.state.realUserID).collection('privateUserData').doc(privateDataID).collection('bookmarks')
       .where("podcastID",'==',this.props.podcast.podcastID).get().then(function(querySnapshot){
         querySnapshot.forEach(function(doc) {
           doc.ref.delete().then(function() {
             Toast.show("Removed from Collections");
           }).catch(function(error){
             console.log("Error in removing bookmarks from user's bookmarks collection: ",error);
           });
         });
       });
    
     firestore().collection('users').doc(this.state.realUserID).collection('privateUserData').doc(privateDataID).set({
         podcastsBookmarked : firestore.FieldValue.arrayRemove(this.props.podcast.podcastID)
       },{merge:true}).catch(function(error){
         console.log("Error in removing podcastID from podcastsBookmarked in user's private document: ",error);
       })
   
      if(this.props.podcast.isChapterPodcast == true)
      {
        firestore().collection('books').doc(this.props.podcast.bookID).collection('chapters').
          doc(this.props.podcast.chapterID).collection('podcasts').doc(this.props.podcast.podcastID).set({
            numUsersRetweeted : firestore.FieldValue.increment(-1)
          },{merge:true}).then(() => {
            console.log("Successfully decremented numUsersRetweeted in podcast(chapter) Doc");
          }).catch((error) => {
            console.log("Error in decrementing numUsersRetweeted in podcast(chapter) Doc");
          })
      }
      else if(this.props.podcast.isChapterPodcast == false)
      {
        firestore().collection('books').doc(this.props.podcast.bookID)
          .collection('podcasts').doc(this.props.podcast.podcastID).set({
            numUsersRetweeted : firestore.FieldValue.increment(-1)
          },{merge:true}).then(() => {
            console.log("Successfully decremented numUsersRetweeted in podcast(book) Doc");
          }).catch((error) => {
            console.log("Error in decrementing numUsersRetweeted in podcast(book) Doc");
          })
      }
      else if(this.props.podcast.isOriginalPodcast == true)
      {
        firestore().collection('podcasts').doc(this.props.podcast.podcastID).set({
          numUsersRetweeted : firestore.FieldValue.increment(-1)
        },{merge:true}).then(() => {
          console.log("Successfully decremented numUsersRetweeted in podcast(original) Doc");
        }).catch((error) => {
          console.log("Error in decrementing numUsersRetweeted in podcast(original) Doc");
        })
      }

   }
   
   
   
   
   
   addToBookmarks = async() => {
      const picturesArray = [];
      const privateDataID = "private" + this.state.realUserID;
      const localUserID = this.state.realUserID;
      picturesArray.push(this.props.podcast.podcastPictures[0]);

      if(this.props.podcastRedux && this.props.podcastRedux.podcastID == this.props.podcast.podcastID) 
        this.props.dispatch({type:'SET_NUM_RETWEETS',payload:this.state.numRetweets + 1});

      this.props.dispatch({type:"ADD_TO_PODCASTS_BOOKMARKED",payload:this.props.podcast.podcastID});
      this.setState({
        reposted : true,
        numRetweets : this.state.numRetweets + 1
      })

      
   
     firestore().collection('users').doc(this.state.realUserID).collection('privateUserData').doc(privateDataID).collection('bookmarks').add({
       bookmarkedOn : moment().format(),
       bookName : this.props.podcast.bookName,
       bookID : this.props.podcast.bookID,  
       chapterID : this.props.podcast.chapterID,
       chapterName : this.props.podcast.chapterName,
       podcastID : this.props.podcast.podcastID, 
       podcastName : this.props.podcast.podcastName,
       podcastPictures : picturesArray,
       podcastDescription : this.props.podcast.podcastDescription,
       podcasterName : this.props.podcast.podcasterName,
       podcasterID : this.props.podcast.podcasterID,
       createdOn : this.props.podcast.createdOn,
       isChapterPodcast : this.props.podcast.isChapterPodcast,
       isOriginalPodcast : this.props.podcast.isOriginalPodcast,
       duration: this.props.podcast.duration
     }).then(function(docRef){
       firestore().collection('users').doc(localUserID).collection('privateUserData').doc(privateDataID).collection('bookmarks').doc(docRef.id).set({
         bookmarkID : docRef.id
       },{merge:true})
       
       console.log("bookmarkID: ",docRef.id);
     }).catch(function(error){
       console.log("Error in adding bookmarks to user's bookmarks collection: ",error);
     })
     
      firestore().collection('users').doc(this.state.realUserID).collection('privateUserData').doc(privateDataID).set({
       podcastsBookmarked : firestore.FieldValue.arrayUnion(this.props.podcast.podcastID)
      },{merge:true}).catch(function(error){
        console.log("Error in adding podcastID to podcastsBookmarked in user's private document: ",error);
      })
   
      if(this.props.podcast.isChapterPodcast == true)
      {
        firestore().collection('books').doc(this.props.podcast.bookID).collection('chapters').
          doc(this.props.podcast.chapterID).collection('podcasts').doc(this.props.podcast.podcastID).set({
            numUsersRetweeted : firestore.FieldValue.increment(1)
          },{merge:true}).then(() => {
            console.log("Successfully incremented numUsersRetweeted in podcast(chapter) Doc");
          }).catch((error) => {
            console.log("Error in incrementing numUsersRetweeted in podcast(chapter) Doc");
          })
      }
      else if(this.props.podcast.isChapterPodcast == false)
      {
        firestore().collection('books').doc(this.props.podcast.bookID)
          .collection('podcasts').doc(this.props.podcast.podcastID).set({
            numUsersRetweeted : firestore.FieldValue.increment(1)
          },{merge:true}).then(() => {
            console.log("Successfully incremented numUsersRetweeted in podcast(book) Doc");
          }).catch((error) => {
            console.log("Error in incrementing numUsersRetweeted in podcast(book) Doc");
          })
      }
      else if(this.props.podcast.isOriginalPodcast == true)
      {
        firestore().collection('podcasts').doc(this.props.podcast.podcastID).set({
          numUsersRetweeted : firestore.FieldValue.increment(1)
        },{merge:true}).then(() => {
          console.log("Successfully incremented numUsersRetweeted in podcast(original) Doc");
        }).catch((error) => {
          console.log("Error in incrementing numUsersRetweeted in podcast(original) Doc");
        })
      }

      Toast.show("Reposted");
   
   }

   updatePodcastsUnliked = async (props) => {

      const privateDataID = "private" + this.state.realUserID;
    
      //const numUsers = this.props.podcast.numUsersLiked - 1;
      const numUsers = this.state.numLikes - 1;

      if(this.props.podcastRedux && this.props.podcastRedux.podcastID == this.props.podcast.podcastID) 
        this.props.dispatch({type:'SET_NUM_LIKES',payload:numUsers});
      
        this.props.dispatch({type:'REMOVE_FROM_PODCASTS_LIKED',payload:this.props.podcast.podcastID});

        this.setState({
          liked : false,
          numLikes : this.state.numLikes - 1
        })

      if(this.props.podcast.isChapterPodcast === true)
      {
        await firestore().collection('books').doc(this.props.podcast.bookID).collection('chapters').
          doc(this.props.podcast.chapterID).collection('podcasts').doc(this.props.podcast.podcastID).set({
            numUsersLiked : firestore.FieldValue.increment(-1)
        },{merge:true})
      }
      else if(this.props.podcast.isChapterPodcast === false)
      {
        await firestore().collection('books').doc(this.props.podcast.bookID).collection('podcasts')
            .doc(this.props.podcast.podcastID).set({
          numUsersLiked : firestore.FieldValue.increment(-1)
        },{merge:true})
      }
      else if(this.props.podcast.isOriginalPodcast === true)
      {
        await firestore().collection('podcasts').doc(this.props.podcast.podcastID).set({
          numUsersLiked : firestore.FieldValue.increment(-1)
        },{merge:true})
      }
    
   
    await firestore().collection('users').doc(this.state.realUserID).collection('privateUserData').doc(privateDataID).set({
      podcastsLiked : firestore.FieldValue.arrayRemove(this.props.podcast.podcastID)
    },{merge:true})

    
   }

   updatePodcastsLiked = async (props) => {

    const privateDataID = "private" + this.state.realUserID;
    
    const numUsers = this.state.numLikes + 1;
  
    if(this.props.podcastRedux && this.props.podcastRedux.podcastID == this.props.podcast.podcastID) 
      this.props.dispatch({type:'SET_NUM_LIKES',payload:numUsers})
    
    this.props.dispatch({type:'ADD_TO_PODCASTS_LIKED',payload:this.props.podcast.podcastID})
    //const numUsers = this.props.podcast.numUsersLiked + 1;
    
    this.setState({
      liked : true,
      numLikes : this.state.numLikes + 1
    })
  
    if(this.props.podcast.isChapterPodcast === true)
      {
        await firestore().collection('books').doc(this.props.podcast.bookID).collection('chapters').
          doc(this.props.podcast.chapterID).collection('podcasts').doc(this.props.podcast.podcastID).set({
            numUsersLiked : firestore.FieldValue.increment(1)
        },{merge:true})
      }
      else if(this.props.podcast.isChapterPodcast === false)
      {
        await firestore().collection('books').doc(this.props.podcast.bookID).collection('podcasts')
            .doc(this.props.podcast.podcastID).set({
          numUsersLiked : firestore.FieldValue.increment(1)
        },{merge:true})
      }
      else if(this.props.podcast.isOriginalPodcast === true)
      {
        await firestore().collection('podcasts').doc(this.props.podcast.podcastID).set({
          numUsersLiked : firestore.FieldValue.increment(1)
        },{merge:true})
      }

    const likedPodcasts = await firestore().collection('users').doc(this.state.realUserID).collection('privateUserData').doc(privateDataID).set({
          podcastsLiked : firestore.FieldValue.arrayUnion(this.props.podcast.podcastID)
    },{merge:true})
    
    console.log("[PodcastContent] In function updatePodcastsLiked, numUsers = ",numUsers);
  
    console.log("props.podcast = ",this.props.podcast);
  
    var chapterID = null;
    if(this.props.podcast.isChapterPodcast === true)
      chapterID = this.props.podcast.chapterID;
    else
      chapterID = "";
  
    const instance = firebase.app().functions("asia-northeast1").httpsCallable('addActivity');
    try 
    {          
      await instance({ // change in podcast docs created by  user
        likeUpdatedInDocument : true, // so that we don't update numUsersLiked in cloud functions
        timestamp : moment().format(),
        photoURL : this.props.displayPictureURL,
        podcastID : this.props.podcast.podcastID,
        userID : this.props.podcast.podcasterID,
        podcastImageURL : this.props.podcast.podcastPictures[0],
        type : "like",
        Name : this.props.name,
        podcastName : this.props.podcast.podcastName,
        bookID : this.props.podcast.bookID,
        chapterID : this.props.podcast.chapterID,
        isChapterPodcast: this.props.podcast.isChapterPodcast,
      });
    }
    catch (e) 
    {
      console.log(e);
    }
    
    
  }

  retrievePodcastDocument = async () =>
  {
    try{
    if(this.props.podcastRedux === null || (this.props.podcastRedux!== null && this.props.podcastRedux.podcastID != this.props.podcast.podcastID))
    {
      // const podcastCollection = await firestore().collectionGroup('podcasts')
      //                        .where('podcastID','==',this.props.podcast.podcastID).get();
      // const podcastDocumentData = podcastCollection.docs[0]._data;

      this.props.dispatch({type:"SET_FLIP_ID",payload:null});
      this.props.dispatch({type:"SET_CURRENT_TIME", payload:0})
      this.props.dispatch({type:"SET_DURATION", payload:this.props.podcast.duration})
      this.props.dispatch({type:"SET_PAUSED", payload:false})
      this.props.dispatch({type:"SET_LOADING_PODCAST", payload:true});
      this.props.dispatch({type:"ADD_NAVIGATION", payload:this.props.navigation})
      this.props.podcastRedux === null && this.props.dispatch({type:"SET_MINI_PLAYER_FALSE"});
      this.props.dispatch({ type:"SET_MUSIC_PAUSED",payload:true});
      this.props.dispatch({type:"SET_PODCAST", payload: this.props.podcast})
      this.props.dispatch({type:"SET_NUM_LIKES", payload: this.state.numLikes})
      this.props.dispatch({type:"SET_NUM_RETWEETS", payload: this.state.numRetweets})

    }
    
    }
    catch(error){
      console.log("Error in retrievePodcastDocument() in Podcast: ",error);
    }
  }

   retrieveUserPrivateDoc = async (userID) =>
  {
    try{
      const privateDataID = "private" + userID;
      const userDocument = await firestore().collection('users').doc(userID).collection('privateUserData').doc(privateDataID).get();
      console.log("[Podcast] userDocument : ", userDocument);
      const userDocumentData = userDocument.data();
      console.log("[Podcast] userDocumentData : ", userDocumentData);
      
      const isUserSame = (userID == this.state.realUserID);

      if(isUserSame)
      {
        this.props.navigation.navigate('ProfileTabNavigator')
      }
      else
      {
        this.props.dispatch({type:"SET_OTHER_PRIVATE_USER_ITEM",payload:userDocumentData});
        this.props.navigation.navigate('ExploreTabNavigator',{userData:userDocumentData});
      }
        
      
    }
    catch(error){
      console.log("Error in retrieveUser() in Podcast: ",error);
    }
    
  }

  removePodcastFromHomeScreen = async() => {
    if(this.props.podcast.isChapterPodcast == false)
    {
      firestore().collection('books').doc(this.props.podcast.bookID).
      collection('podcasts').doc(this.props.podcast.podcastID).set({
        lastEditedOn : moment().subtract(20,'d').format()
    },{merge:true}).then(() => {
      console.log("Removed this book podcast from HomeScreen");
      Toast.show("Successfully removed podcast from HomeScreen");
    }).catch((error) => {
      console.log("Error in removing this book podcast from HomeScreen",error);
      Toast.show("Failed to remove podcast from HomeScreen");
    })
    }
    else if(this.props.podcast.isChapterPodcast == true)
    {
      firestore().collection('books').doc(this.props.podcast.bookID).
      collection('chapters').doc(this.props.podcast.chapterID).
      collection('podcasts').doc(this.props.podcast.podcastID).set({
        lastEditedOn : moment().subtract(20,'d').format()
      },{merge:true}).then(() => {
        console.log("Removed this chapter podcast from HomeScreen");
        Toast.show("Successfully removed podcast from HomeScreen");
      }).catch((error) => {
        console.log("Error in removing this chapter podcast from HomeScreen",error);
        Toast.show("Failed to remove podcast from HomeScreen");
      })
    }
    else if(this.props.podcast.isOriginalPodcast == true)
    {
      firestore().collection('podcasts').doc(this.props.podcast.podcastID).set({
        lastEditedOn : moment().subtract(20,'d').format()
      },{merge:true}).then(() => {
        console.log("Removed this original podcast from HomeScreen");
        Toast.show("Successfully removed podcast from HomeScreen");
      }).catch((error) => {
        console.log("Error in removing this original podcast from HomeScreen",error);
        Toast.show("Failed to remove podcast from HomeScreen");
      })
    }
    
  }

  deletePodcast = async() => {
    const privateDataID = "private" + this.state.userID;
    if(this.props.podcast.isChapterPodcast == false)
    {
      firestore().collection("books").doc(this.props.podcast.bookID).collection("podcasts")
            .doc(this.props.podcast.podcastID).delete().then(function() {
            console.log("Book Podcast Document successfully deleted. ");
          }).catch(function(error) {
        console.log("Error removing document: ", error);
      });
      
      firestore().collection('users').doc(this.state.userID).collection('privateUserData').doc(privateDataID).set({
        numCreatedBookPodcasts : firestore.FieldValue.increment(-1),
        totalMinutesRecorded : firestore.FieldValue.increment(-this.props.podcast.duration/60)
      },{merge:true}).then(() => {
        console.log("Successfully updated numCreatedBookPodcasts in user's private document");
      }).catch((err) => {
        console.log("Error in updating numCreatedBookPodcasts in user's private document - ",err);
      })

      this.props.dispatch({type:"DECREMENT_NUM_CREATED_CHAPTER_PODCASTS"})
      this.props.dispatch({type:"UPDATE_TOTAL_MINUTES_RECORDED",payload:this.props.totalMinutesRecorded - this.props.podcast.duration/60})

    }
    else if(this.props.podcast.isChapterPodcast == true)
    {
      firestore().collection("books").doc(this.props.podcast.bookID).collection("chapters")
        .doc(this.props.podcast.chapterID).collection("podcasts").doc(this.props.podcast.podcastID)
          .delete().then(function() {
            console.log("Chapter Podcast Document successfully deleted. ");
          }).catch(function(error) {
        console.log("Error removing document: ", error);
      });

      firestore().collection('users').doc(this.state.userID).collection('privateUserData').doc(privateDataID).set({
        numCreatedChapterPodcasts : firestore.FieldValue.increment(-1),
        totalMinutesRecorded : firestore.FieldValue.increment(-this.props.podcast.duration/60)
      },{merge:true}).then(() => {
        console.log("Successfully updated numCreatedChapterPodcasts in user's private document");
      }).catch((err) => {
        console.log("Error in updating numCreatedChapterPodcasts in user's private document - ",err);
      })
      this.props.dispatch({type:"DECREMENT_NUM_CREATED_BOOK_PODCASTS"})
      this.props.dispatch({type:"UPDATE_TOTAL_MINUTES_RECORDED",payload:this.props.totalMinutesRecorded - this.props.podcast.duration/60})
    }
    else if(this.props.podcast.isOriginalPodcast == true)
    {
      firestore().collection("podcasts").doc(this.props.podcast.podcastID)
          .delete().then(function() {
            console.log("Original Podcast Document successfully deleted. ");
          }).catch(function(error) {
        console.log("Error removing document: ", error);
      });

      firestore().collection('users').doc(this.state.userID).collection('privateUserData').doc(privateDataID).set({
        numCreatedOriginalPodcasts : firestore.FieldValue.increment(-1),
        totalMinutesRecorded : firestore.FieldValue.increment(-this.props.podcast.duration/60)
      },{merge:true}).then(() => {
        console.log("Successfully updated numCreatedOriginalPodcasts in user's private document");
      }).catch((err) => {
        console.log("Error in updating numCreatedOriginalPodcasts in user's private document - ",err);
      })
      this.props.dispatch({type:"DECREMENT_NUM_CREATED_ORIGINAL_PODCASTS"})
      this.props.dispatch({type:"UPDATE_TOTAL_MINUTES_RECORDED",payload:this.props.totalMinutesRecorded - this.props.podcast.duration/60})
    }

    const instance = firebase.app().functions("asia-northeast1").httpsCallable('deletePodcastFromIndex');

    try 
    {          
      await instance({ // change in podcast docs created by  user
        podcastID : this.props.podcast.podcastID
      });
    }
    catch (e) 
    {
      console.log(e);
    }
  }

    renderPodcastDescription = () => {
      if(this.props.podcast.podcastDescription !== null && this.props.podcast.podcastDescription !== undefined)
        return (
        <View>
        <Text style={{fontFamily:'Montserrat-Regular',fontSize:13}}>{this.props.podcast.podcastDescription.slice(0,300)}       
        {
          this.props.podcast.podcastDescription.length > 300 &&
          <Text style={{fontSize:13}}>...</Text>
        }
        </Text>
        <View>
        {
          this.props.podcast.podcastDescription.length > 300 &&
          <TouchableNativeFeedback onPress={() => {
            this.props.navigation.navigate('InfoScreen', {podcast:this.props.podcast})
          }}>
            <View style={{backgroundColor:'#232930',paddingHorizontal:3,shadowColor: '#000000',shadowOffset: { width: 0, height: 0.01 },shadowOpacity: 0,
      shadowRadius: 0.1,elevation: 0.1,marginVertical:10, height:width/15,width:width/5 + 10,borderRadius:4,borderWidth:0,borderColor:'black',alignItems:'center',justifyContent:'center'}}>
          <Text style={{fontFamily:'Montserrat-SemiBold',fontSize:13,color:'white',textAlign:'center',textAlignVertical:'center'}}>Read more </Text>
          </View>
          </TouchableNativeFeedback>
        }
        </View>
        </View>
      )
      else
        return null;
    }
    render()
    {
      var duration = parseInt((this.props.podcast.duration)/60);
      if(duration == 0)
        duration = 1;

      const  privateDataID = "private" + this.state.userID;
      return (
        <TouchableNativeFeedback onPress={() => {
          if(!this.context.isConnected) 
               {
                 Toast.show('Please check your Internet connection & try again.');
                 return;
               }
        if(this.props.podcastRedux!=null && this.props.podcastRedux.podcastID == this.props.podcast.podcastID)
        {
          if(this.props.pausedRedux)
          {
            this.props.dispatch({type:"SET_PAUSED",payload:false})
            TrackPlayer.play()
          }
          else
          {
            this.props.dispatch({type:"SET_PAUSED",payload:true})
            TrackPlayer.pause()
          }
        }
        else
        {
          this.retrievePodcastDocument();
        }
        }}>
        <View style={{alignSelf:'center',marginBottom:40,width:width-40,borderRadius:10,backgroundColor:this.state.podcastColor,
         shadowColor: '#000000',shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.9,
          shadowRadius: 3,elevation: 5}}>
            <View style={{backgroundColor:'#dddd',flexDirection:'row'}}>
            <View style={{flex:1,alignItems:'flex-end',justifyContent:"center",paddingRight:5}}>
            {
              this.props.podcast.bookName !== undefined &&
              <TouchableOpacity onPress={() => {
                if(this.props.podcast.chapterID !== undefined)
                  this.props.navigation.navigate('RecordChapter', { chapterID: this.props.podcast.chapterID, bookID : this.props.podcast.bookID });
                else
                  this.props.navigation.navigate('RecordBook', { bookID : this.props.podcast.bookID });
              }}>
              <Text style={{fontFamily:'Montserrat-MediumItalic',fontSize:15,paddingVertical:7,paddingHorizontal:7}}>
                {this.props.podcast.bookName}
              </Text>
              </TouchableOpacity>
            }
            </View>
            </View>
            <ImageZoom cropWidth={Dimensions.get('window').width}
               cropHeight={Dimensions.get('window').width/2}
               imageWidth={width}
               imageHeight={width/2}>
          <TouchableWithoutFeedback onPress={() => {
          if(!this.context.isConnected) 
               {
                 Toast.show('Please check your Internet connection & try again.');
                 return;
               }
        if(this.props.podcastRedux!=null && this.props.podcastRedux.podcastID == this.props.podcast.podcastID)
        {
          if(this.props.pausedRedux)
          {
            this.props.dispatch({type:"SET_PAUSED",payload:false})
            TrackPlayer.play()
          }
          else
          {
            this.props.dispatch({type:"SET_PAUSED",payload:true})
            TrackPlayer.pause()
          }
        }
        else
        {
          this.retrievePodcastDocument();
        }
        }}>
          
            <Image source={{uri:this.props.podcast.podcastPictures[0]}}
              style={{height:height/4,width:width-40}}/>
          </TouchableWithoutFeedback>
          </ImageZoom>

          <View style={{height:height/64}}/>
          <View style={{paddingHorizontal:15}}>
            <Text style={{fontFamily:'Montserrat-Bold',fontSize:20}}>{this.props.podcast.podcastName}</Text>
          </View>
          
          <View style={{paddingHorizontal:15,flexDirection:'row'}}>
          <TouchableOpacity onPress={() => {
            this.retrieveUserPrivateDoc(this.props.podcast.podcasterID);
          }} >
            <Image source={{uri:this.props.podcast.podcasterDisplayPicture}}
                    style={{height:width/16,width :width/16,borderRadius:20,marginRight:5}} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
            this.retrieveUserPrivateDoc(this.props.podcast.podcasterID);
          }} >
            <Text style={{fontFamily:'Montserrat-SemiBold',fontSize:17,color:'gray'}}>{this.props.podcast.podcasterName}</Text>
            </TouchableOpacity>
           </View>
           
          <View style={{paddingHorizontal:15}}>
            {this.renderPodcastDescription()}
            
            
          </View>
          <View style={{flexDirection:'row',paddingHorizontal:15,justifyContent:'space-between'}}>
            <View>
              <Text style={{color:'gray',fontSize:13}}>{this.state.createdOn}</Text>
            </View>
            <View style={{}}>
            <Text style={{color:'black',fontSize:13,fontFamily:'Montserrat-Regular'}}>{duration} mins</Text>
            </View>            
          </View>

          <View style={{flexDirection:'row',paddingBottom:20}}>
        <View style={{marginTop:5,borderWidth:0,borderColor:'black',width:width/2, paddingTop:0,flexDirection:'row',justifyContent:'flex-start'}}>
        <TouchableOpacity onPress={() => {
          if(!this.props.isPodcastLiked[this.props.podcast.podcastID])
          {
            this.updatePodcastsLiked();
            this.likeAnimation.play(0,38)
          }
          else
          {
            this.updatePodcastsUnliked();
            this.likeAnimation.play(0,0);
            this.likeAnimation.pause();
          }
        }}
        style={{width:width/7,borderColor:'black',borderWidth:0,justifyContent:'center',alignItems:'center'}}>
        
          {
            
            <IconAntDesign 
                        name={this.props.isPodcastLiked[this.props.podcast.podcastID] ? "heart" : "hearto"}
                        color={this.props.isPodcastLiked[this.props.podcast.podcastID] ? 'red' : 'black' }
                        style={{position:'absolute',left:20}}
                        size={15}/>
          }
            <LottieView 
            ref={animation => { this.likeAnimation = animation;}}
            style={{width:45,position:'absolute',left:3}} 
            source={likeButton}
            loop={false}
            /> 
            <Text style={{position:'absolute',fontFamily:'Montserrat-Regular',left:35,fontSize:12}}> {this.state.numLikes}</Text>
          
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {this.handleOnPressBookmark()}} style={{width:width/6,borderColor:'black',borderWidth:0,justifyContent:'center',alignItems:'center'}}>
        <EvilIcon name="retweet" size={28}
        color={this.props.isPodcastBookmarked[this.props.podcast.podcastID] ? 'blue' : 'black'}/>
        <Text style={{position:'absolute',fontFamily:'Montserrat-Regular',left:43,fontSize:12}}> {this.state.numRetweets}</Text>
        </TouchableOpacity>
        <TouchableNativeFeedback onPress={() => {this.buildDynamicURL();}} >
        <View style={{width:width/6,borderColor:'black',borderWidth:0,justifyContent:'center',alignItems:'center'}}>
        <Icon name="share" size={12} style={{color:'black'}}/>
        </View>
        </TouchableNativeFeedback>
        {/* <FontAwesome name="comment-o" size={height/50} style={{position:'absolute',borderRadius:30, color:'black',backgroundColor:'white'}}/> */}
        
        </View>
        
        <View style={{position:'absolute',right:50}}>
          {
            this.props.podcastRedux!=null && this.props.podcastRedux.podcastID == this.props.podcast.podcastID
            ?
            <LottieView 
            ref={animation => { this.animation = animation;}}
            //style={{width:width/3}} 
            style={{width:30}}
            source={newAnimation}
            //autoPlay={true}
            loop={true}/>
            :
            <EnTypoIcon name="controller-play" size={30}/>
          }
          
          </View>

        {
         (this.props.isAdmin == true || this.props.podcast.podcasterID == this.state.realUserID)
         &&
          <View style={{flex:1,alignItems:'flex-end',justifyContent:'flex-end',flexDirection:'row',marginRight:20}}>
           
            <Menu>
            <MenuTrigger>
            <IconAntDesign name="ellipsis1" size={26}/>
            </MenuTrigger>
            <MenuOptions customStyles={{optionWrapper: { margin: 5}}}>
            <MenuOption onSelect={() => {
              this.props.dispatch({type:'CHANGE_BOOK',payload:this.props.podcast.bookName})
              this.props.dispatch({type:'CHANGE_BOOK_ID', payload:this.props.podcast.bookID})
              if(this.props.podcast.isChapterPodcast == true)
              {
                this.props.dispatch({type:'CHANGE_CHAPTER_ID', payload:this.props.podcast.chapterID})
                this.props.dispatch({type:'CHANGE_CHAPTER',payload:this.props.podcast.chapterName})
              }
              this.props.dispatch({type:'SET_EDIT_PODCAST',payload:true});
              
              this.props.podcastRedux !== null && 
              this.props.dispatch({type:'SET_PODCAST',payload:null}) &&
              TrackPlayer.destroy();
              if(this.props.podcast.isOriginalPodcast !== undefined && this.props.podcast.isOriginalPodcast !== null &&
              this.props.podcast.isOriginalPodcast == true)
                this.props.navigation.navigate("OriginalsPreviewScreen",{podcast:this.props.podcast});
              else
                this.props.navigation.navigate("PreviewScreen",{podcast:this.props.podcast});
              }} text='Edit' />
            <MenuOption onSelect={async() => {
              Alert.alert(  
                'Are you sure you want to delete this podcast?',  
                '',  
                [  
                    {  
                        text: 'Cancel',  
                        onPress: () => console.log('Cancel Pressed'),  
                        style: 'cancel',  
                    },  
                    {text: 'OK', onPress: async() => {
                      this.deletePodcast();
                      console.log('OK Pressed')
                    }},  
                ]  
            ); 
               
            }} >
              <Text>Delete</Text>
            </MenuOption>
            {
              this.props.isAdmin && 
              <MenuOption onSelect={async() => {
                Alert.alert(  
                  'Do you want to add this podcast to Explore Section - I?',  
                  '',  
                  [  
                      {  
                          text: 'Cancel',  
                          onPress: () => console.log('Cancel Pressed'),  
                          style: 'cancel',  
                      },  
                      {text: 'OK', onPress: async() => {
                if(this.props.podcast.isChapterPodcast == false)
                {
                  firestore().collection("books").doc(this.props.podcast.bookID).collection("podcasts")
                        .doc(this.props.podcast.podcastID).set({
                          isExploreSection1 : true,
                          lastAddedToExplore1 : moment().format()
                        },{merge:true}).then(function() {
                        console.log("Book Podcast Document successfully added to Explore Section I. ");
                        Toast.show("Added to Explore Section-I");
                      }).catch(function(error) {
                    console.error("Error removing document: ", error);
                  });
                }
                else if(this.props.podcast.isChapterPodcast == true)
                {
                  firestore().collection("books").doc(this.props.podcast.bookID).collection("chapters")
                    .doc(this.props.podcast.chapterID).collection("podcasts").doc(this.props.podcast.podcastID)
                      .set({
                          isExploreSection1 : true,
                          lastAddedToExplore1 : moment().format()
                      },{merge:true}).then(function() {
                        console.log("Chapter Podcast Document successfully added to Explore Section I. ");
                        Toast.show("Added to Explore Section-I");
                      }).catch(function(error) {
                    console.error("Error removing document: ", error);
                  });
                }
                else if(this.props.podcast.isOriginalPodcast == true)
                {
                  firestore().collection("podcasts").doc(this.props.podcast.podcastID)
                      .set({
                          isExploreSection1 : true,
                          lastAddedToExplore1 : moment().format()
                      },{merge:true}).then(function() {
                        console.log("Original Podcast Document successfully added to Explore Section I. ");
                        Toast.show("Added to Explore Section-I");
                      }).catch(function(error) {
                    console.error("Error removing document: ", error);
                  });
                }

                console.log('OK Pressed')
                  }},  
                ]  
              ); 
                 
              }} text="Add To Explore Section - I"/>
            }
            

            {
              this.props.isAdmin &&
              <MenuOption onSelect={async() => {
              Alert.alert(  
                'Do you want to add this podcast to Explore Section - II?',  
                '',  
                [  
                    {  
                        text: 'Cancel',  
                        onPress: () => console.log('Cancel Pressed'),  
                        style: 'cancel',  
                    },  
                    {text: 'OK', onPress: async() => {
              if(this.props.podcast.isChapterPodcast == false)
              {
                firestore().collection("books").doc(this.props.podcast.bookID).collection("podcasts")
                      .doc(this.props.podcast.podcastID).set({
                        isExploreSection2 : true,
                        lastAddedToExplore2 : moment().format()
                      },{merge:true}).then(function() {
                      console.log("Book Podcast Document successfully added to Explore Section II. ");
                      Toast.show("Added to Explore Section-II");
                    }).catch(function(error) {
                  console.error("Error removing document: ", error);
                });
              }
              else if(this.props.podcast.isChapterPodcast == true)
              {
                firestore().collection("books").doc(this.props.podcast.bookID).collection("chapters")
                  .doc(this.props.podcast.chapterID).collection("podcasts").doc(this.props.podcast.podcastID)
                    .set({
                        isExploreSection2 : true,
                        lastAddedToExplore2 : moment().format()
                    },{merge:true}).then(function() {
                      console.log("Chapter Podcast Document successfully added to Explore Section II. ");
                      Toast.show("Added to Explore Section-II");
                    }).catch(function(error) {
                  console.error("Error removing document: ", error);
                });
              }
              else if(this.props.podcast.isOriginalPodcast == true)
              {
                firestore().collection("podcasts").doc(this.props.podcast.podcastID)
                    .set({
                        isExploreSection2 : true,
                        lastAddedToExplore2 : moment().format()
                    },{merge:true}).then(function() {
                      console.log("Original Podcast Document successfully added to Explore Section II. ");
                      Toast.show("Added to Explore Section-II");
                    }).catch(function(error) {
                  console.error("Error removing document: ", error);
                });
              }
              console.log('OK Pressed')
                }},  
              ]  
            ); 
               
            }} text="Add To Explore Section - II"/>
            }
            {
              this.props.isAdmin &&
              <MenuOption text="Remove from HomeScreen" onSelect={() => {
                this.removePodcastFromHomeScreen();
              }}/>
            }
            

            {/* <MenuOption onSelect={() => alert(`Not called`)} disabled={true} text='Disabled' /> */}
            </MenuOptions>
            </Menu>
          {/* </View> */}
        </View>
      }
          </View>
          </View>
          </TouchableNativeFeedback>
    );
    }
      
  }

//export default withFirebaseHOC(Podcast);
const mapStateToProps = (state) => {
  return{
    podcastRedux: state.rootReducer.podcast,
    pausedRedux: state.rootReducer.paused,
    loadingPodcastRedux: state.rootReducer.loadingPodcast,
    screenChanged: state.rootReducer.screenChanged,
    isPodcastBookmarked: state.userReducer.isPodcastBookmarked,
    isPodcastLiked: state.userReducer.isPodcastLiked,
    displayPictureURL: state.userReducer.displayPictureURL,
    name: state.userReducer.name,
    isAdmin: state.userReducer.isAdmin,
    isMiniPlayer: state.rootReducer.isMiniPlayer,
    numLikesRedux: state.rootReducer.numLikes,
    numRetweetsRedux: state.rootReducer.numRetweets,
    totalMinutesRecorded: state.userReducer.totalMinutesRecorded
  }}

  const mapDispatchToProps = (dispatch) =>{
    return{
    dispatch,
    }}
export default connect(mapStateToProps,mapDispatchToProps)(withFirebaseHOC(Podcast))

const styles = StyleSheet.create({
    flex: {
      flex: 0,
    },
    column: {
      flexDirection: 'column'
    },
    separator: {
      borderBottomColor: '#d1d0d4',
      borderBottomWidth: 1,
      paddingTop:10
    },
    row: {
      flexDirection: 'row'
    },
    header: {
      backgroundColor: theme.colors.white,
      paddingHorizontal: theme.sizes.padding,
      paddingTop: theme.sizes.padding * 1.33,
      paddingBottom: theme.sizes.padding * 0.66,
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    
    
    recommended: {
    },
    recommendedHeader: {
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      paddingHorizontal: theme.sizes.padding,
    },
    recommendedList: {
    },
    recommendation: {
      width: (width - (theme.sizes.padding * 2)) / 2,
      height: (height)*3/8,
      marginHorizontal: 0,
      backgroundColor: theme.colors.white,
      overflow: 'hidden',
      borderRadius: theme.sizes.radius,
      marginVertical: theme.sizes.margin * 0.5,
    },
    recommendationHeader: {
      overflow: 'hidden',
      borderTopRightRadius: theme.sizes.radius,
      borderTopLeftRadius: theme.sizes.radius,
    },
    recommendationOptions: {
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.sizes.padding / 2,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
    },
    recommendationTemp: {
      fontSize: theme.sizes.font * 1.25,
      color: theme.colors.white
    },
    recommendationImage: {
      width: (width - (theme.sizes.padding * 2)) / 2,
      height: (width - (theme.sizes.padding * 3)) / 2,
    },
    avatar: {
      width: theme.sizes.padding,
      height: theme.sizes.padding,
      borderRadius: theme.sizes.padding / 2,
    },
    rating: {
      fontSize: theme.sizes.font * 2,
      color: theme.colors.white,
      fontWeight: 'bold'
    },
    shadow: {
      shadowColor: theme.colors.gray_green,
      shadowOffset: {
        width: 5,
        height: 6,
      },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 5,
    },
    dots: {
      width: 10,
      height: 10,
      borderWidth: 2.5,
      borderRadius: 5,
      marginHorizontal: 6,
      backgroundColor: theme.colors.gray,
      borderColor: 'transparent',
    },
    activeDot: {
      width: 12.5,
      height: 12.5,
      borderRadius: 6.25,
      borderColor: theme.colors.black,
    },
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