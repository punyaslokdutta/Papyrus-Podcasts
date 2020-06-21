import React, {Component, useState, useEffect, useContext} from 'react';
import { StyleSheet, Text, View, Image, Dimensions,TouchableOpacity,TouchableNativeFeedback, ImageBackground, ActivityIndicator, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import * as theme from '../constants/theme'
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
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
import Toast from 'react-native-simple-toast';


var {width, height}=Dimensions.get('window')



 class RepostItem extends React.Component {
   // if(createdOn === null)
  //   createdOn = props.podcast.createdOn.slice(0,10);
    constructor(props)
    {
     super(props)
     {
      this.state={
        realUserID:this.props.firebase._getUid(),
        createdOn:moment(this.props.podcast.createdOn).fromNow(),
        }
     }
    }

    componentDidMount = () => {
      this.animation.play(0,0);
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


    // componentDidUpdate =(prevProps)=>
    // {
    //   // if(this.props.podcastRedux == null && prevProps.podcastRedux && prevProps.podcastRedux.podcastID == this.props.podcast.podcastID)
    //   // {
    //   //   this.animation.play(30,60);
    //   // }
      
    //   // if(this.props.podcastRedux.podcastID == this.props.podcast.podcastID)
    //   // {
    //     console.log("prevProps : ",prevProps);
    //     console.log("this.props : ",this.props);
    //     // if(this.props.loadingPodcastRedux)
    //     //   return;
    //     if(prevProps.podcastRedux && prevProps.podcastRedux.podcastID == this.props.podcast.podcastID || 
    //       this.props.podcastRedux && this.props.podcastRedux.podcastID == this.props.podcast.podcastID)
    //     {
    //       if(this.props.podcastRedux === null && prevProps.podcastRedux!==null && 
    //         prevProps.podcastRedux!== undefined && 
    //         (prevProps.podcastRedux.podcastID === this.props.podcast.podcastID))
    //       {
    //         if(this.props.pausedRedux)
    //         this.animation1.play(30,60);
    //       }
    //       else if(prevProps.podcastRedux && this.props.podcastRedux && 
    //           (prevProps.podcastRedux.podcastID != this.props.podcastRedux.podcastID))
    //       {
    //         if(this.props.podcast.podcastID == prevProps.podcastRedux.podcastID)
    //         {
    //           if(!prevProps.pausedRedux)
    //             this.animation1.play(60,60);
    //         }
    //         else if(this.props.podcast.podcastID == this.props.podcastRedux.podcastID)
    //         {
    //           this.animation1.play(30,30);

    //         }
    //       }
    //       else
    //       {
    //         if(!prevProps.pausedRedux && this.props.pausedRedux && this.props.podcastRedux.podcastID == this.props.podcast.podcastID)
    //         {
    //           console.log("PAUSE");
    //             this.animation1.play(30,60);
    //         }
    //         if(prevProps.pausedRedux && !this.props.pausedRedux && this.props.podcastRedux.podcastID == this.props.podcast.podcastID)
    //         {
    //           console.log("PLAY");
    //           //if(prevProps.podcastRedux.podcastID == this.props.podcastRedux.podcastID)
    //             this.animation1.play(0,30);
    //         }
    //       }
    //     }
        
        
    //   // }
      
      
    //   // else if(prevProps.podcastRedux && prevProps.podcastRedux.podcastID == this.props.podcast.podcastID)
    //   // {
    //   //   this.animation.play(30,60);
    //   // }
    // }


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

  deleteRepostItem = async () =>
  {
    const userID = this.props.userID;
    const privateDataID = "private" + this.props.userID;
    firestore().collection('users').doc(userID).collection('privateUserData').doc(privateDataID).collection('bookmarks')
       .where("podcastID",'==',this.props.podcast.podcastID).get().then(function(querySnapshot){
         querySnapshot.forEach(function(doc) {
           doc.ref.delete().then(function() {
             Toast.show("This podcast has been deleted & removed from your collections");
           }).catch(function(error){
             console.log("Error in removing bookmarks from user's bookmarks collection: ",error);
           });
         });
       });
    
     firestore().collection('users').doc(userID).collection('privateUserData').doc(privateDataID).set({
         podcastsBookmarked : firestore.FieldValue.arrayRemove(this.props.podcast.podcastID)
       },{merge:true}).catch(function(error){
         console.log("Error in removing podcastID from podcastsBookmarked in user's private document: ",error);
       })
  }

  retrievePodcastDocument = async () =>
  {
    try{
    if(this.props.podcastRedux === null || (this.props.podcastRedux!== null && this.props.podcastRedux.podcastID != this.props.podcast.podcastID))
    {
      const podcastCollection = await firestore().collectionGroup('podcasts')
                             .where('podcastID','==',this.props.podcast.podcastID).get();
      
      const userID = this.props.userID;
      console.log("userID: ",userID);
      const privateDataID = "private" + userID;
      if(podcastCollection.docs.length == 0)
      {
        this.deleteRepostItem();
        return;
      }
      const podcastDocumentData = podcastCollection.docs[0]._data;
      
    
      console.log("podcastDocumentData.lastEditedOn: ",podcastDocumentData.lastEditedOn);
      console.log("this.props.podcast.lastEditedOn): ",this.props.podcast.lastEditedOn);
      console.log("this.props.podcast.bookmarkID: ",this.props.podcast)
      
      if(podcastDocumentData.lastEditedOn !== this.props.podcast.lastEditedOn)
      {
        
        firestore().collection('users').doc(userID).collection('privateUserData').doc(privateDataID).collection('bookmarks').doc(this.props.podcast.bookmarkID).set({
          podcastName : podcastDocumentData.podcastName,
          podcastPictures : [podcastDocumentData.podcastPictures[0]],
          podcasterName : podcastDocumentData.podcasterName,
          lastEditedOn : podcastDocumentData.lastEditedOn,
        },{merge:true}).then(() => {
          console.log("Successfully updated repostItem with actual Podcast Document data");
        }).catch((err) => {
          console.log(err);
        })
      }
      
      console.log("[RepostItem] podcastDocumentData : ", podcastDocumentData);
      this.props.dispatch({type:"SET_CURRENT_TIME", payload:0})
      this.props.dispatch({type:"SET_DURATION", payload:podcastDocumentData.duration})
      this.props.dispatch({type:"SET_PAUSED", payload:false})
      this.props.dispatch({type:"SET_LOADING_PODCAST", payload:true});
      this.props.dispatch({type:"ADD_NAVIGATION", payload:this.props.navigation})
      this.props.podcastRedux === null && this.props.dispatch({type:"SET_MINI_PLAYER_FALSE"});
      this.props.dispatch({type:"SET_PODCAST", payload: podcastDocumentData})
      this.props.dispatch({type:"SET_NUM_LIKES", payload: podcastDocumentData.numUsersLiked})
    }
    
    }
    catch(error){
      console.log("Error in retrievePodcastDocument() in RepostItem: ",error);
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
      return (
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
          
            <View style={{flexDirection:'column'}}>
           
         
            <View style={{flexDirection:'row',alignItems:'flex-end',justifyContent:'flex-end'}}>
            <EvilIcon name='retweet' size={20} color='black'/>
            <Text style={{ color:'black', paddingLeft:5,fontWeight:'400', fontSize:theme.sizes.font * 1.0 }}>
            {moment(this.props.podcast.bookmarkedOn).fromNow()}
            </Text>
            </View>    
            <View style={{flex:1,flexDirection:"row",paddingBottom:theme.sizes.padding/2,paddingLeft:width/64,width:width,height:height/7}}>
            
            <View style={{flexDirection:'row'}}>
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
                <IconAntDesign name="play" size={height/32} style={{position:'absolute',borderRadius:30, color:'black',backgroundColor:'white', left:width/64 + height*3/64,top:height*3/64}}/>
                :
                <IconAntDesign name="pause" size={height/32} style={{position:'absolute',borderRadius:30, color:'black',backgroundColor:'white', left:width/64 + height*3/64,top:height*3/64}}/>

              )
              :
              <IconAntDesign name="play" size={height/32} style={{position:'absolute',borderRadius:30, color:'black',backgroundColor:'white', left:width/64 + height*3/64,top:height*3/64}}/>


            }

                {/* {
                  
                  <LottieView ref={animation1 => { this.animation1 = animation1;}} 
                style={{ height: height/20,color:'white',borderRadius:30,position:'absolute',top:height*3/64,right:width/76}} source={playPause} 
                  loop={false}/>
                  
                  // <PlayPauseOut loadingPodcast={loadingPodcast}
                  //   pausePodcast={togglePlay} playPodcast={togglePlay}/>
                } */}

            <View style={[styles.flex, styles.column, styles.shadow, { width:(width*2)/3,paddingLeft:theme.sizes.padding/2, paddingTop: 0 }]}>
                <View style={{height:(height)/24,marginBottom:0}}>
                <Text style={{ fontSize: theme.sizes.font * 1.0, fontFamily:'Montserrat-Bold' }}>{this.props.podcast.podcastName.slice(0,50)}
                    {(this.props.podcast.podcastName.length > 50) ? ".." : ""}</Text> 
            {/* {
                (props.podcast.chapterName !== null && props.podcast.chapterName !== undefined) &&
                <TouchableOpacity onPress={() => {
                    console.log("chapterID: ",props.podcast.chapterID);
                    props.navigation.navigate('RecordChapter',{bookID:props.podcast.bookID,chapterID:props.podcast.chapterID})
                }}>
                <Text style={{  fontSize: theme.sizes.font * 0.8,fontFamily:'Montserrat-Bold',color: theme.colors.gray_green }}>
                {props.podcast.chapterName}
            </Text>
            </TouchableOpacity>
            } */}

            {/* <TouchableOpacity onPress={() => props.navigation.navigate('RecordBook',{bookID:props.podcast.bookID})}>
            <Text style={{  fontSize: theme.sizes.font * 0.8,fontFamily:'Montserrat-Bold',color: theme.colors.gray_green }}>
                {props.podcast.bookName}
            </Text>
            </TouchableOpacity> */}

            </View>
            <View>
            {/* <PodcastAnimation podcastID={this.props.podcast.podcastID}/> */}
            <LottieView 
            ref={animation => { this.animation = animation;}}
            style={{width:width*2/3}} 
            source={newAnimation}
            loop={true}/>
            </View>

            {/* <View>
            <PodcastAnimation/>
            </View> */}
            <View style={{flexDirection:'row',paddingTop:5}}>
                <TouchableOpacity onPress={() => {
                  this.retrieveUserPrivateDoc(this.props.podcast.podcasterID);
                }}>
                <Text style={{ fontFamily:'Montserrat-Bold',fontSize:theme.sizes.font * 0.8,color: theme.colors.gray_green }}>
                    {this.props.podcast.podcasterName}
                </Text>
                </TouchableOpacity>
                
              <Text style={{  fontFamily:'Montserrat-Bold',position:'absolute',right:-15,top:3,fontSize: theme.sizes.font * 0.8,color: theme.colors.gray_green }}>
              {this.state.createdOn}
              </Text>
              
            </View>
        
            
            
        </View>
    
        </View>
        </View>
    </TouchableNativeFeedback>
    );
    }
      
  }

//export default withFirebaseHOC(RepostItem);
const mapStateToProps = (state) => {
  return{
    podcastRedux: state.rootReducer.podcast,
    pausedRedux: state.rootReducer.paused,
    loadingPodcastRedux: state.rootReducer.loadingPodcast,
    screenChanged: state.rootReducer.screenChanged
  }}

  const mapDispatchToProps = (dispatch) =>{
    return{
    // toggleMiniPlayer:() => dispatch({type:"TOGGLE_MINI_PLAYER"}),
    // removeAllHearts:() => dispatch({type:"REMOVE_ALL_HEARTS"})
    dispatch,
    }}
export default connect(mapStateToProps,mapDispatchToProps)(withFirebaseHOC(RepostItem))

// const podcast = useSelector(state=>state.rootReducer.podcast);
//   const paused = useSelector(state=>state.rootReducer.paused);
//   const loadingPodcast = useSelector(state=>state.rootReducer.loadingPodcast);

const styles = StyleSheet.create({
    flex: {
      flex: 0,
    },
    column: {
      flexDirection: 'column'
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