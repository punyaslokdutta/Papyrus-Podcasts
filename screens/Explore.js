import React, {Component, useState,useEffect, useRef, createRef,useContext} from 'react';
import firestore from '@react-native-firebase/firestore';
import { StyleSheet,BackHandler, Text, View, SafeAreaView, ActivityIndicator, TextInput, Platform, StatusBar,TouchableOpacity,TouchableNativeFeedback, Dimensions, ScrollView, Image, NativeModules, NativeEventEmitter} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import IconAntDesign from 'react-native-vector-icons/AntDesign'
import TrendingPodcast from './components/Explore/TrendingPodcast'
import TopChapters from './components/Explore/TopChapters';
import Story from './components/Explore/Story'
import ExploreBook from './components/Explore/ExploreBook'
import { Badge } from 'react-native-elements'
import {useSelector, useDispatch} from "react-redux"
import Shimmer from 'react-native-shimmer';
import {withFirebaseHOC} from './config/Firebase';
import TrendingPodcastsCarousel from './components/Explore/TrendingPodcastsCarousel'
import ShortStoriesCarousel from './components/Explore/ShortStoriesCarousel';
import ExploreAnimation from './components/Explore/ExploreAnimation';
import StoryTellerCarousel from './components/Explore/StoryTellerCarousel';
import MusicCarousel from './components/Explore/MusicCarousel';
import ClassicPoemsCarousel from './components/Explore/ClassicPoemsCarousel';
import SplashScreen from 'react-native-splash-screen';
import BookList from './components/Home/BookList';
import Podcast from './components/Home/Podcast';
import FlipItem from './components/Home/FlipItem';
import { NetworkContext } from './config/NetworkProvider';

const {width,height} = Dimensions.get('window')




const Explore = (props) => {

  const  userid = props.firebase._getUid();
  const privateUserID = "private" + userid;

  const isConnectedContext = useContext(NetworkContext);

  const lastPlayingPodcastID = useSelector(state=>state.userReducer.lastPlayingPodcastID);
  const podcast = useSelector(state=>state.rootReducer.podcast);
  const [podcastState,setPodcastState] = useState(podcast);
  const externalPodcastID = useSelector(state=>state.userReducer.externalPodcastID);
  const externalFlipID = useSelector(state=>state.userReducer.externalFlipID);

  var [storytellers,setStorytellers] = useState([]);
  var [exploreFlips,setExploreFlips] = useState([]);
  var [section1Podcasts,setSection1Podcasts] = useState([]);
  var [section2Podcasts,setSection2Podcasts] = useState([]);
  var [recordBooks,setRecordBooks] = useState([]);
  var [music,setMusic] = useState([]);
  var [chapters,setChapters] = useState([]);
  var [loading,setLoading] = useState(false);
  var [sections,setSections] = useState([]);
  const dispatch=useDispatch();
  //const eventEmitter=useRef(new NativeEventEmitter(NativeModules.ReactNativeRecorder));
 
  var navigationState = props.navigation.state;

  console.log("NAVIGATION STATE IN EXPLORE SCREEN: ",navigationState);

  var startHeaderHeight  = 60;

  const numNotifications = useSelector(state=>state.userReducer.numNotifications);

  if(Platform.OS == 'Android')
  {
    startHeaderHeight = StatusBar.currentHeight;
  }

  async function fetchExploreItems()
  {
    console.log('[Explore] useEffect in Explore Screen[componentDidMount]');
    setLoading(true);

    try{
      let sectionsQuery = await firestore().collection('exploreSections').orderBy('screenPosition').get();
      let documentSections = sectionsQuery._docs.map(document => document.data());
      setSections(documentSections);
    }
    catch(error){
      console.log("Error in fetching exploreSection names ",error);
    }

    //Top Storytellers
    try{
      let userQuery = await firestore().collectionGroup('privateUserData').where('isTopStoryTeller','==',true).get();
      let documentUsers = userQuery._docs.map(document => document.data());
      setStorytellers(documentUsers);
    }
    catch(error){
      console.log(error)
    }

    // Section 1 podcasts
    try{
      let section1Query = await firestore().collectionGroup('podcasts').where('isExploreSection1','==',true)
                          .orderBy('lastAddedToExplore1','desc').limit(10).get();
      let section1Podcasts = section1Query.docs.map(document => document.data());
      setSection1Podcasts(section1Podcasts);
    }
    catch(error){
      console.log(error)
    }

    // Section 2 podcasts
    try{
      let section2Query = await firestore().collectionGroup('podcasts').where('isExploreSection2','==',true)
                          .orderBy('lastAddedToExplore2','desc').limit(10).get();
      let section2Podcasts = section2Query.docs.map(document => document.data());
      setSection2Podcasts(section2Podcasts);
    }
    catch(error){
      console.log(error)
    }

    // Explore Flips
    try{
      let exploreFlipsQuery = await firestore().collection('flips')
                            .where('isExploreFlip','==',true).orderBy('createdOn','desc')
                            .limit(6).get();
      let exploreFlipsData = exploreFlipsQuery.docs.map(document => document.data());
      setExploreFlips(exploreFlipsData);
    }
    catch(error){
      console.log(error)
    }
    // // Short Stories
    // try{
    //   let bookQuery = await firestore().collectionGroup('podcasts').where('isShortStory','==',true).get();
    //   let documentBooks = bookQuery.docs.map(document => document.data());
    //   setBooks(documentBooks);
    // }
    // catch(error){
    //   console.log(error)
    // }

    // Record Book Podcasts
    try{
      let recordBookQuery = await firestore().collection('books').where('isExploreRecordBook','==',true).get();
      let documentRecordBooks = recordBookQuery.docs.map(document => document.data());
      setRecordBooks(documentRecordBooks);
    }
    catch(error){
      console.log(error)
    }

    // // Classic Novels
    // try{
    //   let chapterQuery = await firestore().collectionGroup('podcasts').where('isClassicNovel','==',true).get();
    //   let documentChapters = chapterQuery.docs.map(document => document.data());
    //   setChapters(documentChapters);
    // }
    // catch(error){
    //   console.log(error)
    // }

    try{
      let musicQuery = await firestore().collection('music').orderBy('createdOn').get();
      let documentMusic = musicQuery.docs.map(document => document.data());
      setMusic(documentMusic);
    }
    catch(error){
      console.log(error)
    }
    
    setLoading(false);
  }

    async function setLastPlayingPodcastInUserPrivateDoc(podcastID)
    {
      await firestore().collection('users').doc(userid).collection('privateUserData').
            doc(privateUserID).set({
              lastPlayingPodcastID : podcastID,
              lastPlayingCurrentTime : null
            },{merge:true})
    }

    function exitPodcastPlayerAndsetLastPlaying(){

      console.log("Inside exitPodcastPlayerAndsetLastPlaying : ",podcastState);
      if(podcastState!==null)
      {
        //setLastPlayingPodcastInUserPrivateDoc(podcastState.podcastID);
        dispatch({type:"SET_PODCAST", payload: null});
      }
      
    }


      useEffect(
        () => {
          //SplashScreen.hide();
          console.log("[ExploreScreen] useEffect LOG");
          props.navigation.addListener('didFocus', (route) => {
             console.log("HOME TAB PRESSED");
             dispatch({type:"CHANGE_SCREEN"});
          });
          fetchExploreItems();
          //dispatch({type:"SET_MUSIC",payload:"Swayam"})
          return () => {
            //exitPodcastPlayerAndsetLastPlaying();
            dispatch({type:"SET_PODCAST", payload: null});

            console.log(" App exited from Explore",podcast);
          };
        },[])

      async function fetchPodcastItem(podcastID)
      {

        let podcastItem = await firestore().collectionGroup('podcasts').where('podcastID','==',podcastID).get();
        let podcastData = podcastItem.docs[0]._data;

        dispatch({type:"ADD_NAVIGATION", payload:props.navigation});
        dispatch({type:"SET_FLIP_ID",payload:null});
        dispatch({type:"SET_CURRENT_TIME", payload:0});
        dispatch({type:"SET_DURATION", payload:podcastData.duration});
        dispatch({type:"SET_PAUSED", payload:false})
        dispatch({type:"SET_LOADING_PODCAST", payload:true});
        podcast === null && dispatch({type:"SET_MINI_PLAYER_FALSE"});
        dispatch({ type:"SET_MUSIC_PAUSED",payload:true});
        dispatch({type:"SET_PODCAST", payload: podcastData}) 
        dispatch({type:"SET_NUM_LIKES", payload: podcastData.numUsersLiked})

        dispatch({type:"PODCAST_ID_FROM_EXTERNAL_LINK",payload:null});

      }

      useEffect( () => {
        console.log("In useEffect of externalPodcastID with podcastID: ",externalPodcastID);
        if((externalPodcastID !== null) &&
          (podcast === null || (podcast !== null && externalPodcastID != podcast.podcastID)))
          fetchPodcastItem(externalPodcastID);
        else
        {
          dispatch({type:"PODCAST_ID_FROM_EXTERNAL_LINK",payload:null});
          setLastPlayingPodcastInUserPrivateDoc(null);
        }

      },[externalPodcastID])

      async function retrieveFlipFromFirestore() {

        const flipItem = await firestore().collection('flips').doc(externalFlipID).get();
        const flipItemData = flipItem.data();
        var resizeModes = [];
        flipItemData.flipPictures.map((img,index) => {
          Image.getSize(img, (width, height) => {
              if(height > width)
                resizeModes.push('cover');
              else
                resizeModes.push('contain');                  
          });
        })
        props.navigation.navigate('MainFlipItem',{
          item : flipItemData,
          resizeModes : resizeModes
      })
      dispatch({type:"FLIP_ID_FROM_EXTERNAL_LINK",payload:null});

      }

      useEffect(() => {
        if(externalFlipID !== null){
          retrieveFlipFromFirestore();          
        }
      },[externalFlipID])

      useEffect(() => {
        if(lastPlayingPodcastID !== null && externalPodcastID=== null)
        {
          fetchPodcastItem(lastPlayingPodcastID);
          //setLastPlayingPodcastInUserPrivateDoc(null);
        }

      },[lastPlayingPodcastID])

      // useEffect(
      //   () => {
      //     BackHandler.addEventListener('hardwareBackPress', back_Button_Press);
      //     return () => {
      //       console.log(" [Explore]back_Button_Press Unmounted");
      //       BackHandler.removeEventListener("hardwareBackPress",  back_Button_Press);
      //     };
      //   }, [back_Button_Press])

      //   function back_Button_Press()
      //   {
      //     console.log("OUT FROM back_Button_Press: ",podcast);
      //     return false;
      //   }

      function getWindowDimension(event) { 
        const device_width = event.nativeEvent.layout.width;
        const device_height = event.nativeEvent.layout.height;
    
        console.log ("height: ",height);
        console.log ("nativeEventHeight: ",device_height);  // Yeah !! good value
        if(height - device_height >= 32) 
          dispatch({type:"SET_NAV_BAR_HEIGHT",payload:height - device_height});
        else
          dispatch({type:"SET_NAV_BAR_HEIGHT",payload:0});
        console.log ("nativeEventWidth: ",device_width); 
      }
    
    function renderStoryTellers()
    {
      console.log("storytellers: ",storytellers);

      return storytellers.map((item, index)=>
      {
        return(<Story item={item} index={index} key ={index} navigation={props.navigation}/>)
      })
    };

    function renderTetrisFlips()
    {
      if(exploreFlips.length == 6)
      return (
        <View style={{borderColor:'black',borderWidth:0.5,height:width,width:width}}>
          <View style={{flexDirection:"row"}}>
            <TouchableOpacity onPress={() => {
              props.navigation.navigate('FlipsExploreScreen',{
                flips : exploreFlips,
                scrollIndex:0,
                lastVisibleFlip:exploreFlips[exploreFlips.length - 1].createdOn,
            })
            }}
            style={{borderColor:'black',borderWidth:0.5,height:width/3,width:width/3}}>
            <Image source={{uri:exploreFlips[0].flipPictures[0]}} 
                  style={{height:width/3,width:width/3}}/>
              {
                exploreFlips[0].isAudioFlip &&
                <IconAntDesign name="play" size={height/24} style={{position:'absolute',borderRadius:30, color:'black',backgroundColor:'white', left:width/6 - height/48,top:width/6 - height/48}}/>

              }
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              props.navigation.navigate('FlipsExploreScreen',{
                flips : exploreFlips,
                scrollIndex:1,
                lastVisibleFlip:exploreFlips[exploreFlips.length - 1].createdOn,
            })
            }}
            style={{borderColor:'black',borderWidth:0.5,height:width/3,width:width/3}}>
            <Image source={{uri:exploreFlips[1].flipPictures[0]}} 
                  style={{height:width/3,width:width/3}}/>
              {
                exploreFlips[1].isAudioFlip &&
                <IconAntDesign name="play" size={height/24} style={{position:'absolute',borderRadius:30, color:'black',backgroundColor:'white', left:width/6 - height/48,top:width/6 - height/48}}/>

              }
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              props.navigation.navigate('FlipsExploreScreen',{
                flips : exploreFlips,
                scrollIndex:2,
                lastVisibleFlip:exploreFlips[exploreFlips.length - 1].createdOn,
            })
            }}
             style={{borderColor:'black',borderWidth:0.5,height:width/3,width:width/3}}>
            <Image source={{uri:exploreFlips[2].flipPictures[0]}} 
                  style={{height:width/3,width:width/3}}/>
              {
                exploreFlips[2].isAudioFlip &&
                <IconAntDesign name="play" size={height/24} style={{position:'absolute',borderRadius:30, color:'black',backgroundColor:'white', left:width/6 - height/48,top:width/6 - height/48}}/>

              }
            </TouchableOpacity>
          </View>
          <View style={{flexDirection:"row"}}>
              <View style={{flexDirection:'column'}}>
              <TouchableOpacity onPress={() => {
              props.navigation.navigate('FlipsExploreScreen',{
                flips : exploreFlips,
                scrollIndex:3,
                lastVisibleFlip:exploreFlips[exploreFlips.length - 1].createdOn,
            })
            }}
                style={{borderColor:'black',borderWidth:0.5,height:width/3,width:width/3}}>
              <Image source={{uri:exploreFlips[3].flipPictures[0]}} 
                  style={{height:width/3,width:width/3}}/>
              {
                exploreFlips[3].isAudioFlip &&
                <IconAntDesign name="play" size={height/24} style={{position:'absolute',borderRadius:30, color:'black',backgroundColor:'white', left:width/6 - height/48,top:width/6 - height/48}}/>

              }
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              props.navigation.navigate('FlipsExploreScreen',{
                flips : exploreFlips,
                scrollIndex:4,
                lastVisibleFlip:exploreFlips[exploreFlips.length - 1].createdOn,
            })
            }}
              style={{borderColor:'black',borderWidth:0.5,height:width/3,width:width/3}}>
            <Image source={{uri:exploreFlips[4].flipPictures[0]}} 
                  style={{height:width/3,width:width/3}}/>
              {
                exploreFlips[4].isAudioFlip &&
                <IconAntDesign name="play" size={height/24} style={{position:'absolute',borderRadius:30, color:'black',backgroundColor:'white', left:width/6 - height/48,top:width/6 - height/48}}/>

              }
            </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => {
              props.navigation.navigate('FlipsExploreScreen',{
                flips : exploreFlips,
                scrollIndex:5,
                lastVisibleFlip:exploreFlips[exploreFlips.length - 1].createdOn,
            })
            }}
                  style={{borderColor:'black',borderWidth:0.5,height:width*2/3,width:width*2/3}}>
                <Image source={{uri:exploreFlips[5].flipPictures[0]}} 
                  style={{height:width*2/3,width:width*2/3}}/>
              {
                exploreFlips[5].isAudioFlip &&
                <IconAntDesign name="play" size={height/24} style={{position:'absolute',borderRadius:30, color:'black',backgroundColor:'white', left:width/3 - height/48,top:width/3 - height/48}}/>

              }
              </TouchableOpacity>
          </View>
          </View>
      )
    }

    function renderSectionStoryTellers()
    {
      return (
        <View style={{width:width,paddingTop:height/50}}>
          <StoryTellerCarousel data={storytellers} navigation={props.navigation}/>
          </View>
      )
    }

    function renderSectionMusic()
    {
      return (
        <View style={{width:width,paddingTop:height/50}}>
          <MusicCarousel data={music} navigation={props.navigation}/>
          </View>
      )
    }


    function renderPodcasts()
    {
       return section1Podcasts.map((item, index)=>
      {
        return(<TrendingPodcast item={item} index={index} key ={index} navigation={props.navigation}/>)
      })

    }

    function renderSection1Podcasts()
    {
        return (
          <View style={{width:width,paddingTop:10}}>
          <TrendingPodcastsCarousel data={section1Podcasts} navigation={props.navigation}/>
          </View>
         
        )
    }
    function renderChapters()
    {
       return chapters.map((item, index)=>
      {
        return(<TopChapters item={item} index={index} key ={index} navigation={props.navigation}/>)
      })

    }

    function renderSectionChapters()
    {
      return (

        <View style={{width:width,paddingTop:10}}>
          <ClassicPoemsCarousel data={chapters} navigation={props.navigation}/>
          </View>
        
      )
    }

    function renderBooks()
    {
       return section2Podcasts.map((item, index)=>
      {
        return(<ExploreBook item={item} index={index} key ={index} navigation={props.navigation}/>)
      })

    }

    function renderSection2PodcastsI()
    {
      return section2Podcasts.slice(0,4).map((item, index)=>
      {
        return(<Podcast podcast={item} key ={item.podcastID} navigation={props.navigation}/>)
      })
    }

    function renderSection2PodcastsII()
    {
      return section2Podcasts.slice(4,8).map((item, index)=>
      {
        return(<Podcast podcast={item} key ={item.podcastID} navigation={props.navigation}/>)
      })
    }

    function renderSection2PodcastsIII()
    {
      return section2Podcasts.slice(8,10).map((item, index)=>
      {
        return(<Podcast podcast={item} key ={item.podcastID} navigation={props.navigation}/>)
      })
    }
    
 
    function renderMainHeader() 
    {
      return (
      <View style={styles.AppHeader}>
        <TouchableNativeFeedback onPress={()=>props.navigation.toggleDrawer()}>
        <View style={{paddingLeft: 15,paddingRight:10 ,paddingVertical:26} }>
         
          {
            (numNotifications == 0)
            ?
            <View style={{flowDirection:'row'}}>
          <Icon name="bars" size={22}/>
            </View>
            :
            <View style={{flowDirection:'row'}}>
          <Icon name="bars" size={22}/>
            <Badge
            width={5}
            textStyle={{fontSize:8}}
            value={numNotifications}
            status="error"
            containerStyle={styles.badgeStyle}
            />
            </View>
          }
        </View>
        </TouchableNativeFeedback>
        <View style={{flex:1, paddingVertical:10}}>
          <TouchableOpacity onPress={() => {
            dispatch({type:"SET_ALGOLIA_QUERY", payload:"papyrus"})
            dispatch({type:"SET_EXPLORE_SCREEN_AS_PREVIOUS_SCREEN", payload:true})
            props.navigation.navigate('SearchTabNavigator',{fromExplore:true})}}>
        <View style={{flexDirection:'row',height:startHeaderHeight, backgroundColor: 'white', paddingRight: 13, paddingVertical:10}}>
       
            <Text style={{ flex:1, fontFamily:'Montserrat-Bold',borderRadius:20,backgroundColor:'#dddd',fontSize:12,
              paddingTop: 0, paddingHorizontal: 10,justifyContent:'center',textAlignVertical:'center' }}>
           
              <Icon style={{paddingHorizontal:10,paddingTop:20 }} name="search" size={15} />
             

              {"  "}Search podcasts, books, topics, authors{"  "}
               </Text>

        </View>
        </TouchableOpacity>
        </View>
        </View>
      )
    }
     
      if(isConnectedContext.isConnected && loading == true)
      {
        return (
          
          <View style={{flexDirection:'column'}} onLayout={(event) => getWindowDimension(event)}>
          
            
        {renderMainHeader()}
          
           
              <View>
              
            <View style={{color:'#dddd',flexDirection:'row'}}>
              <View style={{width:width/20}}/>
              <Shimmer>
              <View style={{backgroundColor :'#dddd', height:width/6,width:width/6,borderRadius:100}}/>
              </Shimmer>
              <View style={{width:width/15}}/>
              <Shimmer>
              <View style={{backgroundColor :'#dddd', height:width/6,width:width/6,borderRadius:100}}/>
              </Shimmer>
              <View style={{width:width/15}}/>
              <Shimmer>
              <View style={{backgroundColor :'#dddd', height:width/6,width:width/6,borderRadius:100}}/>
              </Shimmer>
              <View style={{width:width/15}}/>
              <Shimmer>
              <View style={{backgroundColor :'#dddd', height:width/6,width:width/6,borderRadius:100}}/>
              </Shimmer>
            </View>

            <View><Text>{"\n"}</Text></View>

            <View style={{color:'#dddd',flexDirection:'row'}}>
            <View style={{width:width/20}}/>
            <Shimmer>
            <View style={{backgroundColor :'#dddd', height:height/5,width:width/2}}/>
            </Shimmer>
            
            <View style={{width:width/12}}/>
            <Shimmer>
            <View style={{backgroundColor :'#dddd', height:width/5,width:width/2}}/>
            </Shimmer>
            
            <View style={{width:width/12}}/>
            <Shimmer>
            <View style={{backgroundColor :'#dddd', height:width/5,width:width/2}}/>
            </Shimmer>
            </View>

            <View><Text>{"\n"}</Text></View>

            <View style={{color:'#dddd',flexDirection:'row'}}>
            
            <View style={{width:width/20}}/>
            <Shimmer>
            <View style={{backgroundColor :'#dddd', height:height/7, width:(width*5)/12 + 10}}/>
            </Shimmer>
            
            <View style={{width:width/12}}/>
            <Shimmer>
            <View style={{backgroundColor :'#dddd', height:height/7, width:(width*5)/12 + 10}}/>
            </Shimmer>
            
            <View style={{width:width/12}}/>
            <Shimmer>
            <View style={{backgroundColor :'#dddd', height:height/7, width:(width*5)/12 + 10}}/>
            </Shimmer>
            </View>
            <View><Text>{"\n"}</Text></View>
            <View style={{color:'#dddd',flexDirection:'row'}}>
            
            <View style={{width:width/20}}/>
            <Shimmer>
            <View style={{backgroundColor :'#dddd', height:height/4, width:width/3}}/>
            </Shimmer>
            
            <View style={{width:width/12}}/>
            <Shimmer>
            <View style={{backgroundColor :'#dddd', height:height/4, width:width/3}}/>
            </Shimmer>
            
            <View style={{width:width/12}}/>
            <Shimmer>
            <View style={{backgroundColor :'#dddd', height:height/4, width:width/3}}/>
            </Shimmer>
            </View>

            
            </View>
              
            
        </View>    
        
        )
      }
      else if(isConnectedContext.isConnected || (section1Podcasts.length != 0 || section2Podcasts.length != 0 || recordBooks.length != 0 || storytellers.length != 0 || music.length != 0))
      {
        return (
     
          <SafeAreaView style={{flex:1, backgroundColor:'white'}} onLayout={(event) => getWindowDimension(event)}>
          {renderMainHeader()}
          
          <ScrollView  scrollEventThrottle={16}>
         
          <View style={{flexDirection:'row'}}>
          <View style={{width:width/2}}>
          <Text style={{paddingLeft: 30, paddingTop:height/20,fontFamily:'Montserrat-Bold',  fontSize:18,textShadowColor:'black'}}> App is under construction.
          </Text>
          <Text style={{paddingLeft: 30, paddingTop:5, fontFamily:'Montserrat-Regular', fontSize:15,textShadowColor:'black'}}>Caution: There may be bugs.
          </Text>
          <Text style={{paddingLeft: 30, paddingTop:0, fontFamily:'Montserrat-Bold',  fontSize:12,textShadowColor:'black'}}>
          </Text>
          </View>
          <View style={{paddingTop:height/6,paddingRight:15}}>
          <ExploreAnimation/>
          
          </View>
          </View>

            <View style={{backgroundColor:'#e1e6e1'}}>
            <View style={{height:15}}/>

             {renderSection1Podcasts()}
             <View style={{marginTop:20,borderBottomColor:'#d1d0d4',borderBottomWidth:1}}/> 
             {renderSection2PodcastsI()}
             <Text style={{fontSize:23,marginTop:10, color:'black',fontFamily:'HeadlandOne-Regular'}}> Storytellers </Text>
             {renderSectionStoryTellers()}
            <View style={{marginTop:20,borderBottomColor:'#d1d0d4',borderBottomWidth:1}}/> 
            {renderTetrisFlips()}
            <View style={{marginTop:20,borderBottomColor:'#d1d0d4',borderBottomWidth:1}}/> 
            {renderSection2PodcastsII()}
            <View style={{height:15}}/>
            <Text style={{fontSize:23,marginBottom:10, color:'black',fontFamily:'HeadlandOne-Regular'}}> Popular Books </Text>
             <BookList navigation={props.navigation} books={recordBooks}/>
             {renderSection2PodcastsIII()}
             <View style={{height:15}}/>
             <Text style={{fontSize:23,marginBottom:10, color:'black',fontFamily:'HeadlandOne-Regular'}}> Relaxing Music </Text>
             {renderSectionMusic()}
             <View style={{height:30}}/>
             </View>
              </ScrollView>
          </SafeAreaView>
        )
      }
      else 
      {
        return (
          <View>
          {renderMainHeader()}

          <View style={{alignItems:'center',justifyContent:'center'}}>
            <Image source={require('../assets/images/NoInternet.jpg')} style={{height:height/1.5,width:width}}/>
            {/* <Text> No Internet Connection</Text> */}
            </View>
            </View>
        )
      }
  }

export default withFirebaseHOC(Explore);


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
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  AppHeader:
  {
 flexDirection:'row',
 backgroundColor: 'white'
  },
  storie: {
    height: 50,
    width: 50,
    borderRadius: 60,
    marginLeft: 7,
    borderWidth: 1,
    borderColor: '#dddddd',
},
badgeStyle: {
  position: 'absolute',
  top: -4,
  right: -4
}
});
