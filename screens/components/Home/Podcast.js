import React, {Component, useState, useEffect, useContext} from 'react';
import { StyleSheet, Text, View, Image, Dimensions,Alert,TouchableNativeFeedback,Share,TouchableOpacity, ImageBackground, ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import * as theme from '../constants/theme'
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import { firebase } from '@react-native-firebase/functions';
import {withFirebaseHOC} from '../../config/Firebase';
import {useSelector, useDispatch,connect} from "react-redux"
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import IconAntDesign from 'react-native-vector-icons/AntDesign'
import PodcastAnimation from '../PodcastPlayer/PodcastAnimation';
import TrackPlayer, { usePlaybackState,useTrackPlayerProgress } from 'react-native-track-player';
import PlayPauseOut from '../PodcastPlayer/PlayPauseOut';
import LottieView from 'lottie-react-native';
import playPause from '../../../assets/animations/play_pause.json';
import newAnimation from '../../../assets/animations/waterwaves5.json'
import FontAwesome, { Icons } from 'react-native-vector-icons/FontAwesome';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import Toast from 'react-native-simple-toast';
import likeButton from '../../../assets/animations/836-like-button.json';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

var {width, height}=Dimensions.get('window')



 class Podcast extends React.Component {
   // if(createdOn === null)
  //   createdOn = props.podcast.createdOn.slice(0,10);
    constructor(props)
    {
     super(props)
     {
      this.state={
        realUserID: this.props.firebase._getUid(),
        createdOn: moment(this.props.podcast.createdOn).fromNow(),
        reposted: this.props.isPodcastBookmarked[this.props.podcast.podcastID],
        liked: this.props.isPodcastLiked[this.props.podcast.podcastID],
        numLikes: this.props.podcast.numUsersLiked,
        numRetweets: this.props.podcast.numUsersRetweeted === undefined ? 0 : this.props.podcast.numUsersRetweeted
        }
     }
    }

    componentDidMount = () => {
      
      this.animation.play(0,0);
      this.likeAnimation.pause();
      
      console.log("In componentDidMount");
    }

  componentDidUpdate =(prevProps)=>{ 
      
      if(this.props.podcastRedux && this.props.podcastRedux.podcastID == this.props.podcast.podcastID) 
      {
          if(!this.props.pausedRedux)
              this.animation.play(0,178);
          else
              this.animation.pause();
      }
      else
      {
          this.animation.pause();
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
        descriptionText: this.props.podcast.podcastDescription,
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
      else
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

     this.props.dispatch({type:"REMOVE_FROM_PODCASTS_BOOKMARKED",payload:this.props.podcast.podcastID});
      this.setState({
        reposted : false,
        numRetweets : this.state.numRetweets - 1
      })
   }
   
   
   
   
   
   addToBookmarks = async() => {
      const picturesArray = [];
      const privateDataID = "private" + this.state.realUserID;
      const localUserID = this.state.realUserID;
      picturesArray.push(this.props.podcast.podcastPictures[0]);
   
     firestore().collection('users').doc(this.state.realUserID).collection('privateUserData').doc(privateDataID).collection('bookmarks').add({
       bookmarkedOn : moment().format(),
       bookName : this.props.podcast.bookName,
       bookID : this.props.podcast.bookID,  
       chapterID : this.props.podcast.chapterID,
       chapterName : this.props.podcast.chapterName,
       podcastID : this.props.podcast.podcastID, 
       podcastName : this.props.podcast.podcastName,
       podcastPictures : picturesArray,
       podcasterName : this.props.podcast.podcasterName,
       podcasterID : this.props.podcast.podcasterID,
       createdOn : this.props.podcast.createdOn,
       isChapterPodcast : this.props.podcast.isChapterPodcast,
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
      else
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

      Toast.show("Reposted");
      this.props.dispatch({type:"ADD_TO_PODCASTS_BOOKMARKED",payload:this.props.podcast.podcastID});

      this.setState({
        reposted : true,
        numRetweets : this.state.numRetweets + 1
      })
   
   }

   updatePodcastsLiked = async (props) => {

    //setLikedState(true);
    const privateDataID = "private" + this.state.realUserID;
    this.props.dispatch({type:'ADD_TO_PODCASTS_LIKED',payload:this.props.podcast.podcastID})
    const numUsers = this.props.podcast.numUsersLiked + 1;
  
    this.props.dispatch({type:'SET_NUM_LIKES',payload:numUsers})
  
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
        isChapterPodcast: this.props.podcast.isChapterPodcast 
      });
    }
    catch (e) 
    {
      console.log(e);
    }
    this.setState({
      liked : true,
      numLikes : this.state.numLikes + 1
    })
    
  }

  retrievePodcastDocument = async () =>
  {
    try{
    if(this.props.podcastRedux === null || (this.props.podcastRedux!== null && this.props.podcastRedux.podcastID != this.props.podcast.podcastID))
    {
      // const podcastCollection = await firestore().collectionGroup('podcasts')
      //                        .where('podcastID','==',this.props.podcast.podcastID).get();
      // const podcastDocumentData = podcastCollection.docs[0]._data;
      this.props.dispatch({type:"SET_CURRENT_TIME", payload:0})
      this.props.dispatch({type:"SET_DURATION", payload:this.props.podcast.duration})
      this.props.dispatch({type:"SET_PAUSED", payload:false})
      this.props.dispatch({type:"SET_LOADING_PODCAST", payload:true});
      this.props.dispatch({type:"ADD_NAVIGATION", payload:this.props.navigation})
      this.props.podcastRedux === null && this.props.dispatch({type:"SET_MINI_PLAYER_FALSE"});
      this.props.dispatch({type:"SET_PODCAST", payload: this.props.podcast})
      this.props.dispatch({type:"SET_NUM_LIKES", payload: this.props.podcast.numUsersLiked})
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
    render()
    {
      var duration = parseInt((this.props.podcast.duration)/60);
      if(duration == 0)
        duration = 1;

      return (
       
          
           <View>
         
            {/* <View style={{flexDirection:'row',alignItems:'flex-end',justifyContent:'flex-end'}}>
            <EvilIcon name='retweet' size={20} color='black'/>
            <Text style={{ color:'black', paddingLeft:5,fontWeight:'400', fontSize:theme.sizes.font * 1.0 }}>
            {moment(this.props.podcast.bookmarkedOn).fromNow()}
            </Text>
            </View>     */}
             <TouchableNativeFeedback onPress={() => {
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
          <View>
            <View>
              <Text style={{  fontFamily:'Montserrat-Bold',fontSize: theme.sizes.font * 0.8,color: theme.colors.gray_green, position:'absolute',right:15 }}>
            {this.state.createdOn}
            </Text>
              </View>
            <View style={{flex:1,flexDirection:"row",paddingBottom:theme.sizes.padding/2,paddingLeft:width/64,width:width,height:height/7,marginTop:10}}>
            
            <View style={{flexDirection:'row',marginTop:15}}>
             <View style={{flexDirection:'column'}}>
             <View style={{flexDirection: 'row'}}>
              <View style={{flexDirection:'column'}}>
            <Image style={{width:height/8,height:height/8,borderRadius:2}} source={ {uri: this.props.podcast.podcastPictures[0]}} />
            <View
                    style={{
                    height:1,
                    width:height/8 - 3,
                    marginTop:1,
                    marginLeft:5,
                    borderLeftWidth:height/8 - 5,
                    color: 'black',
                    }}
                    />
               </View>
                <View
                    style={{
                    height:height/8 - 2,
                    width:3,
                    marginTop:2,
                    borderLeftWidth: 1,
                    color: 'black',
                    }}
                    />
            </View>
            <View
                style={{
                height:1,
                width:height/8 - 9,
                marginTop:1.5,
                marginLeft:12,
                borderLeftWidth:height/8 - 9,
                color: 'black',
                }}
                />
            </View>
            <View
                style={{
                height:height/8 - 1,
                width:5,
                marginTop:4,
                borderLeftWidth: 1,
                color: 'black',
                }}
                />

            </View>
            {
              this.props.podcastRedux!=null && this.props.podcast.podcastID == this.props.podcastRedux.podcastID
              ?
              (
                this.props.pausedRedux 
                ?
                <IconAntDesign name="play" size={height/32} style={{position:'absolute',borderRadius:30, color:'black',backgroundColor:'white', left:width/64 + height*3/64,top:height*3/64 + 15}}/>
                :
                <IconAntDesign name="pause" size={height/32} style={{position:'absolute',borderRadius:30, color:'black',backgroundColor:'white', left:width/64 + height*3/64,top:height*3/64 + 15}}/>

              )
              :
              <IconAntDesign name="play" size={height/32} style={{position:'absolute',borderRadius:30, color:'black',backgroundColor:'white', left:width/64 + height*3/64,top:height*3/64 + 15}}/>
            }

            <View style={[styles.flex, styles.column, styles.shadow, { width:(width*2)/3,paddingLeft:theme.sizes.padding/2, paddingTop: 0 }]}>
                <View style={{height:(height)/24,marginBottom:0}}>
                <Text style={{ fontSize: theme.sizes.font * 1.0, fontFamily:'Montserrat-Bold' }}>{this.props.podcast.podcastName.slice(0,50)}
                    {(this.props.podcast.podcastName.length > 50) ? ".." : ""}</Text> 
            
            </View>
            <View>
            <LottieView 
            ref={animation => { this.animation = animation;}}
            style={{width:(width*3)/4}} 
            source={newAnimation}
            loop={true}/>
            </View>

            <View style={{flexDirection: 'row',marginBottom:20}}>
                <TouchableOpacity style={{flexDirection:'row'}} onPress={() => {
                  this.retrieveUserPrivateDoc(this.props.podcast.podcasterID);
                }}>
                  <View>
                <Image source={{uri:this.props.podcast.podcasterDisplayPicture}} style={{height:20,width:20,borderRadius:20}}/>  
                </View>
                <View>
                <Text style={{ fontFamily:'Montserrat-Bold',fontSize:theme.sizes.font * 0.8,color: theme.colors.gray_green,paddingLeft:5 }}>
                    {this.props.podcast.podcasterName}
                </Text>
                </View>
                </TouchableOpacity>

            <Text style={{  fontFamily:'Montserrat-Bold',fontSize: theme.sizes.font * 0.8,color: theme.colors.gray_green, position:'absolute',right:-15 }}>
            {duration} mins
            </Text>
          </View>
            
        </View>
    
        </View>
        <View style={{paddingHorizontal:10,marginTop:10}}>
        <Text style={{fontFamily:'Montserrat-Regular', fontSize:12}}>
        {
          this.props.podcast.podcastDescription !== undefined && 
          this.props.podcast.podcastDescription !== null &&

          this.props.podcast.podcastDescription.slice(0, 200)
        }
        </Text>
        </View>
        </View>
        </TouchableNativeFeedback>

        <View style={{flexDirection:'row'}}>
        <View style={{marginTop:5,borderWidth:0,borderColor:'black',width:width/2, paddingTop:0,flexDirection:'row',justifyContent:'center'}}>
        <TouchableOpacity onPress={() => {
          if(!this.props.isPodcastLiked[this.props.podcast.podcastID])
          {
            this.updatePodcastsLiked();
            this.likeAnimation.play(0,38)
          }
        }}
        style={{width:width/6,borderColor:'black',borderWidth:0,justifyContent:'center',alignItems:'center'}}>
        
          {
            
            <IconAntDesign 
                        name={this.props.isPodcastLiked[this.props.podcast.podcastID] ? "heart" : "hearto"}
                        color={this.props.isPodcastLiked[this.props.podcast.podcastID] ? 'red' : 'black' }
                        style={{position:'absolute',left:20}}
                        size={20}/>
          }
            <LottieView 
            ref={animation => { this.likeAnimation = animation;}}
            style={{width:width/7,position:'absolute',left:0}} 
            source={likeButton}
            loop={false}
            /> 
            <Text style={{position:'absolute',fontFamily:'Montserrat-Regular',left:40,fontSize:15}}> {this.state.numLikes}</Text>
          
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {this.handleOnPressBookmark()}} style={{width:width/6,borderColor:'black',borderWidth:0,justifyContent:'center',alignItems:'center'}}>
        <EvilIcon name="retweet" size={36}
        color={this.props.isPodcastBookmarked[this.props.podcast.podcastID] ? 'blue' : 'black'}/>
        <Text style={{position:'absolute',fontFamily:'Montserrat-Regular',left:45,fontSize:15}}> {this.state.numRetweets}</Text>
        </TouchableOpacity>
        <TouchableNativeFeedback onPress={() => {this.buildDynamicURL();}} >
        <View style={{width:width/6,borderColor:'black',borderWidth:0,justifyContent:'center',alignItems:'center'}}>
        <Icon name="share" size={20} style={{color:'black'}}/>
        </View>
        </TouchableNativeFeedback>
        {/* <FontAwesome name="comment-o" size={height/50} style={{position:'absolute',borderRadius:30, color:'black',backgroundColor:'white'}}/> */}
        
        </View>
       
      
      {
         (this.props.isAdmin == true || this.props.podcast.podcasterID == this.state.realUserID)
         &&
         <View style={{width:width/2}}>
          <View style={{width:30,position:'absolute',right:15}}>
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
                      if(this.props.podcast.isChapterPodcast == false)
              {
                firestore().collection("books").doc(this.props.podcast.bookID).collection("podcasts")
                      .doc(this.props.podcast.podcastID).delete().then(function() {
                      console.log("Book Podcast Document successfully deleted. ");
                    }).catch(function(error) {
                  console.error("Error removing document: ", error);
                });
              }
              else
              {
                firestore().collection("books").doc(this.props.podcast.bookID).collection("chapters")
                  .doc(this.props.podcast.chapterID).collection("podcasts").doc(this.props.podcast.podcastID)
                    .delete().then(function() {
                      console.log("Chapter Podcast Document successfully deleted. ");
                    }).catch(function(error) {
                  console.error("Error removing document: ", error);
                });
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
                      console.log('OK Pressed')
                    }},  
                ]  
            ); 
               
            }} >
              <Text>Delete</Text>
            </MenuOption>
            {/* <MenuOption onSelect={() => alert(`Not called`)} disabled={true} text='Disabled' /> */}
            </MenuOptions>
            </Menu>
          </View>
        </View>
      }
        </View>
        
      <View style={[styles.separator]} />
    </View>
  
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
    isAdmin: state.userReducer.isAdmin
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
        width: 0,
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