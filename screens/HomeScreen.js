import React, {Component,useState,useEffect,useContext,useRef} from 'react';
import firestore from '@react-native-firebase/firestore';
import { StyleSheet, View,SafeAreaView, TextInput, Platform, StatusBar,NativeModules,TouchableOpacity, 
  ScrollView, Image,Dimensions, Animated,SectionList,ActivityIndicator, 
  NativeEventEmitter,RefreshControl} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import Icon from 'react-native-vector-icons/FontAwesome'
import { FlatList } from 'react-native-gesture-handler';
import BookList from './components/Home/BookList'
import * as theme from '../screens/components/constants/theme';
import Podcast from './components/Home/Podcast'
import FlipItem from './components/Home/FlipItem'
import {Text} from './components/categories/components';
import { useSelector,useDispatch} from 'react-redux';
import { Badge } from 'react-native-elements'
import Shimmer from 'react-native-shimmer';
import HomeAnimation from './components/Home/HomeAnimation';
import { MenuProvider } from 'react-native-popup-menu';
import { NetworkContext } from './config/NetworkProvider';
import {withFirebaseHOC} from './config/Firebase'
import VideoPlayer from 'react-native-video-controls';

var {width, height}=Dimensions.get('window')

const HomeScreen = (props) => {
  
  const userID = props.firebase._getUid();

  const isConnectedContext = useContext(NetworkContext);
  const flipUploadSuccess = useSelector(state=>state.flipReducer.flipUploadSuccess);
  const uploadPodcastSuccess = useSelector(state=>state.userReducer.uploadPodcastSuccess);
  const numNotifications = useSelector(state=>state.userReducer.numNotifications);
  const userPreferences = useSelector(state=>state.userReducer.userPreferences);
  const [books,setBooks] = useState([]);
  const [headerPodcasts,setHeaderPodcasts] = useState([]);
  const [podcasts,setPodcasts] = useState([]);
  const [flips,setFlips] = useState([]);
  const limit = 8;
  const flipLimit = 30;
  const headerPodcastsLimit = 8;
  const bookLimit = 5;
  const [podcastJustUploaded,setPodcastJustUploaded] = useState(null);
  const [isConnected,setIsConnected] = useState(true);
  const [podcastPresentMap,setPodcastPresentMap] = useState({});
  const [lastVisible,setLastVisible] = useState(null);
  const [loading,setLoading] = useState(false);
  const [refreshing,setRefreshing] = useState(false);
  const [onEndReachedCalledDuringMomentum,setOnEndReachedCalledDuringMomentum] = useState(true);
  const [scrollPosition,setScrollPosition] = useState(0);
  const dispatch = useDispatch();
  var didFocusListener = useRef();

  const [key,setKey] = useState(1);


  useEffect(() => {
    console.log("userPreferences:- ",userPreferences);
    console.log("[HomeScreen] useEffect LOG");
    if(!didFocusListener.current) {
      didFocusListener.current =  props.navigation.addListener('didFocus', (route) => {
        console.log("HOME TAB PRESSED");
        dispatch({type:"CHANGE_SCREEN"});
        });
    }
      
    retrieveData();
    return () => {
      console.log("[HomeScreen] component unmounting");
      didFocusListener.current.remove();
      //netInfoListener.current.remove();
    };
  },[])  

  useEffect(() => {
    if(flipUploadSuccess == true){
      console.log("[HomeScreen] A flip has been added");
      dispatch({type:"SET_FLIP_UPLOAD_SUCCESS",payload:false});
      retrieveData();      
      //setKey(key + 1);
    }
  },[flipUploadSuccess])

  useEffect(() => {
      if(uploadPodcastSuccess == true){
        console.log("uploadPodcastSuccess1234: ",uploadPodcastSuccess);
        setLoading(true);
        retrievePodcastJustUploaded();
        setLoading(false);
        dispatch({type:"SET_PODCAST_UPLOAD_SUCCESS",payload:false});

        //retrieveData();
      }
  },[uploadPodcastSuccess])

  function handleConnectivityChange(isConnected) {
    if (isConnected) {
      //this.setState({ isConnected });
    } else {
      alert("Oops!! No Internet Connection Available");
      //this.setState({ isConnected });
    }
  }

  async function retrievePodcastJustUploaded(){
    const justUploadedPodcastQuery = await firestore().collectionGroup('podcasts').where('podcasterID','==',userID)
      .orderBy('lastEditedOn','desc').limit(1).get();
    const justUploadedPodcastDocData = justUploadedPodcastQuery.docs[0].data();
    console.log("justUploadedPodcastDocData: ",justUploadedPodcastDocData);
    setPodcastJustUploaded(justUploadedPodcastDocData);
  }

  async function retrieveData() 
  {
    setLoading(true);
    try{
      console.log("[HomeScreen] Retrieving data - userPreferences : ",userPreferences);
      //For books in section list
      let bookDocuments =  await firestore().collection('books').where('genres','array-contains-any',userPreferences)//.where('reviewPending','==',false)
                           .orderBy('createdOn','desc').limit(bookLimit).get()
      let bookData = bookDocuments.docs.map(document => document.data());
      setBooks(bookData) 


      var initialLimit = headerPodcastsLimit + limit;
      // 16 podcasts of userPreferences
      let podcasts = await firestore().collectionGroup('podcasts')
            .where('genres','array-contains-any',userPreferences).orderBy('lastEditedOn','desc')
            .limit(initialLimit).get();

      // 8 podcasts of lastEditedOn
      let latestPodcasts = await firestore().collectionGroup('podcasts')
                    .orderBy('lastEditedOn','desc')
                    .limit(limit).get();

      let latestFlips = await firestore().collection('flips')
                .orderBy('lastEditedOn','desc').limit(flipLimit)
                .get();
      let latestFlipsData = latestFlips.docs.map(document=>document.data());

      let documentData_preferredPodcasts = podcasts.docs.map(document => document.data());
      let documentData_latestPodcasts = latestPodcasts.docs.map(document => document.data()); 
      
      var isPodcastPresent = {};

      for(var i=0;i<initialLimit;i++)
        isPodcastPresent[documentData_preferredPodcasts[i].podcastID] = true;
      

      var finalDocumentData = documentData_preferredPodcasts.slice(headerPodcastsLimit,initialLimit);      
      for(var i=0;i<limit;i++)
      {
        if(isPodcastPresent[documentData_latestPodcasts[i].podcastID] != true)
        {
          finalDocumentData.push(documentData_latestPodcasts[i]);
          isPodcastPresent[documentData_latestPodcasts[i].podcastID] = true;
        }
      }
      
      var lastVisiblePodcast = lastVisible;
      if(documentData_latestPodcasts.length != 0)      
          lastVisiblePodcast = documentData_latestPodcasts[documentData_latestPodcasts.length - 1].lastEditedOn; 

      setHeaderPodcasts(documentData_preferredPodcasts.slice(0,headerPodcastsLimit));
      setPodcasts(finalDocumentData);
      setFlips(latestFlipsData);
      setLastVisible(lastVisiblePodcast);
      setPodcastPresentMap(isPodcastPresent);
      //setOnEndReachedCalledDuringMomentum(true);
    }
    catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false);
    }
  };

  function handleScroll(event) {
    console.log("In handleScroll : ",event.nativeEvent.contentOffset.y);
    // this.setState({ scrollPosition: event.nativeEvent.contentOffset.y });
    if(Math.abs(scrollPosition - event.nativeEvent.contentOffset.y) >= height/6)
      setScrollPosition(event.nativeEvent.contentOffset.y);
   }

  async function retrieveMorePodcasts()
  {
    console.log("[HomeScreen] retrieveMorePodcasts starts()")
    setRefreshing(true);
    try{   
      let additionalPodcastDocuments =  await firestore().collectionGroup('podcasts')
        .orderBy('lastEditedOn','desc').startAfter(lastVisible).limit(limit).get()
      
      let documentData = additionalPodcastDocuments.docs.map(document => document.data());
      if(documentData.length != 0) 
      {
        var finalDocumentData = [];
        var localPodcastPresentMap = podcastPresentMap;
        for(var i=0;i<limit;i++)
        {
          if(localPodcastPresentMap[documentData[i].podcastID] != true)
          {
            finalDocumentData.push(documentData[i]);
            localPodcastPresentMap[documentData[i].podcastID] = true;
          }
        }

        let lastVisiblePodcast = documentData[documentData.length - 1].lastEditedOn;
        if(lastVisible != lastVisiblePodcast) 
        {
          setPodcasts([...podcasts, ...finalDocumentData]);
          setLastVisible(lastVisiblePodcast);
          setPodcastPresentMap(localPodcastPresentMap);
          //setOnEndReachedCalledDuringMomentum(true);
        }
      }
    }
    catch(error) {
      console.log(error);
    }
    finally {
      setRefreshing(false);
    }
  }


    

  function onEndReached({ distanceFromEnd }) {
    console.log("\n\nON END REACHED\n\n")
    if(!onEndReachedCalledDuringMomentum){
      retrieveMorePodcasts();
      setOnEndReachedCalledDuringMomentum(true);
    }
  }

  function renderMainHeader()
  {
    return (
    <View style={styles.AppHeader}>
      <TouchableOpacity onPress={()=>props.navigation.toggleDrawer()}>
        {
          (numNotifications == 0)
          ?
          <View style={{paddingLeft: 15 ,paddingVertical:18} }>
            <Icon name="bars" size={22} style={{color:'white'}}/>
          </View>
          :
          <View style={{flexDirection:'row',paddingLeft: 15,paddingVertical:18} }>
          <Icon name="bars" size={22} style={{color:'white'}}/>
          <Badge
          width={5}
          textStyle={{fontSize:8}}
          value={numNotifications}
          status="error"
          containerStyle={styles.badgeStyle}
          />
          </View>
        }
      

      </TouchableOpacity>
      <View>
      <Text style={{paddingTop:theme.sizes.padding/2,color:'white',fontSize:theme.sizes.font*1,paddingLeft:theme.sizes.padding/2,paddingRight:10}}>Papyrus </Text> 

      </View>

      </View>
    )
  }
  
  function renderSectionBooks(title)
  {     
    const totalBooksLength = Math.min(10,books.length);
    switch(title) {
      case "A":
        return (
          <View>
           {/* <HomeAnimation/>  */}
          </View>
        );
      case "B":
        return (
          <View>
          <View style={{backgroundColor:'white'}}>  
          <Text h2 style={{fontFamily:'Montserrat-Bold',paddingHorizontal: 30,paddingTop:10,paddingBottom:10,   textShadowColor:'black'}}>Record Book Podcasts</Text>
          <BookList navigation={props.navigation} books={books.slice(0,5)}/>
          </View>
          </View>
        );
      // case "C":
      //   if(totalBooksLength > 5)
      //   {
      //     return (
      //       <View>
      //       <View style={{backgroundColor:'white'}}>  
      //       <Text h2 style={{fontFamily:'Montserrat-Bold',paddingHorizontal: 30,paddingTop:10,paddingBottom:10,   textShadowColor:'black'}}>Record Book Podcasts</Text>
      //       <BookList navigation={props.navigation} books={books.slice(5,totalBooksLength)}/>
      //       </View>
      //       <Text h3 style={{fontFamily:'Montserrat-Bold',paddingLeft: 30,   textShadowColor:'black'}}>Discover Podcasts
      //       </Text>
      //       </View>
      //     )
      //   }
      //   else
      //     return null
        

      }
  }

  function renderData({ section, index }) {

    return (
      <View>
          <Podcast podcast={section.data[index]} key={section.data[index].podcastID} navigation={props.navigation}/>
    </View>
    )

    // const numColumns  = 1;

    // if (index % numColumns !== 0) return null;

    // const items = [];

    // for (let i = index; i < index + numColumns; i++) {
    //   if (i >= section.data.length) {
    //     break;
    //   }
    //   items.push(<Podcast podcast={section.data[i]} key={section.data[i].podcastID}  navigation={props.navigation}  />);
    // }
    // return (
    //   <View
    //     style={{
    //       flexDirection: "row",
    //       justifyContent: "space-between",
    //       paddingRight: width/10
    //     }}
    //   >
    //     {items}
    //   </View>
    // );
  };
  
  function renderHeader()
  {
    var podcasts1 = headerPodcasts.slice(0,4);
    var podcasts2 = headerPodcasts.slice(4,8);
    //var podcasts3 = headerPodcasts.slice(8,12); 
    return(
      <View style={{ paddingBottom:30, marginTop: Platform.OS == 'ios' ? 20 : 30 }}>
      {/* <SectionList
        showsVerticalScrollIndicator={false}
        sections={[
          { title: 'A', data: podcasts1},
           { title: 'B', data: podcasts2 }
        ]}
        keyExtractor={item => item.lastEditedOn}
        renderSectionHeader={({ section }) => (
          <ScrollView>
              
              {console.log("[HomeScreen] SECTION DATA: ",section)}
              {console.log("[HomeScreen] SECTION TITLE: ",section.title)}

          {renderSectionBooks(section.title)}
          {(section.data !== null) &&
          <Text h3 style={{fontFamily:'Montserrat-Bold',paddingLeft: 30,   textShadowColor:'black'}}>Discover Podcasts
          </Text> } 
          <View style={[styles.separator]} />
          </ScrollView>
        )}
        renderItem={renderData}
      /> */}
      
      <View>
        {
          podcastJustUploaded !== null && podcastJustUploaded !== undefined &&
          <Podcast podcast={podcastJustUploaded} navigation={props.navigation}/>
        }
      </View>
      {renderFlipsI()}

      {
        podcasts1.map((item,index) =>
        {
          return <Podcast podcast={item} scrollPosition={scrollPosition} index={index} navigation={props.navigation}/>
        })
      }
      <View>
          <View style={{backgroundColor:'white'}}>  
          <Text h2 style={{fontFamily:'Montserrat-Bold',paddingHorizontal: 30,paddingTop:10,paddingBottom:10,   textShadowColor:'black'}}>Record Book Podcasts</Text>
          <BookList navigation={props.navigation} books={books.slice(0,5)}/>
          </View>
      </View>
      {
        podcasts2.map((item,index) =>
        {
          return <Podcast podcast={item} scrollPosition={scrollPosition} index={index} navigation={props.navigation}/>
        })
      }

      {renderFlipsII()}




    </View>
    )
  }
  
  function renderFlipsI(){
    return (
      flips.slice(0,10).map((item,index) => {
        return(
          <FlipItem item={item} index={index} navigation={props.navigation}/>
        )
      })
    )
  }

  function renderFlipsII(){
    return (
      flips.slice(10,20).map((item,index) => {
        return(
          <FlipItem item={item} index={index} navigation={props.navigation}/>
        )
      })
    )
  }

  function renderFlipsIII(){
    return (
      flips.slice(20,30).map((item,index) => {
        return(
          <FlipItem item={item} index={index} navigation={props.navigation}/>
        )
      })
    )
  }

  function renderDatas({item,index})
  {
      return(        
        <View>
          {
            index == 0
            &&
            renderHeader()
          }
           {/* {
            index == 10
            &&
            renderFlipsIII()
          }  */}
      <Podcast podcast={item} scrollPosition={scrollPosition} index={index} navigation={props.navigation}/>
      </View>
      )
  }

  function renderFooter() 
  {
    try {
      if (refreshing === true) {
        return (
          <ActivityIndicator />
           
        )
      }
      else {
        return null;
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  function handleRefresh()
  {
    retrieveData();
  }
  function renderPodcasts()
  {
    return (  
      <FlatList
      data={podcasts}
      renderItem={renderDatas}
      //numColumns={2}
      onScroll={handleScroll}
      showsVerticalScrollIndicator={false}
      keyExtractor={item => item.podcastID}
      //ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
      onEndReached={onEndReached}
      onEndReachedThreshold={1}
      refreshing={refreshing}
      onRefresh={() => handleRefresh()}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      }
      onMomentumScrollBegin={() => { setOnEndReachedCalledDuringMomentum(false); }}
    />   
    )
  }

  function separator(){
    return(
      <View style={[styles.separator]} />
    )
  }

  function renderVideos() {
    return (
      <View>
      <View style={{height:height*0.9,width:width,marginBottom:25}}>
       <VideoPlayer
          source={{uri: 'https://r10---sn-ci5gup-qxa6.googlevideo.com/videoplayback?expire=1596682431&ei=XxwrX8KZCIi8hgbf0or4Cw&ip=2620%3A154%3Aa10%3Aa001%3A250%3A56ff%3Afeaa%3A6996&id=o-ANG2jqhrk0bVyHUxAM7O1PleJeiZZC7XTtKXG1PWN2FO&itag=18&source=youtube&requiressl=yes&vprv=1&mime=video%2Fmp4&gir=yes&clen=47670343&ratebypass=yes&dur=1020.888&lmt=1586399989142540&fvip=1&fexp=23883098&c=WEB&txp=5531432&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cgir%2Cclen%2Cratebypass%2Cdur%2Clmt&sig=AOq0QJ8wRgIhALPcwi5j910fM5ZIS_SsYFWbki-JaU2q3Q4Wv8rVOhS-AiEAjj_waZ-hRQYXo_X8qBXBraoXXJvxdLzuJ5lfgGHxQwg%3D&video_id=Tke2yVMJaB4&title=Debunking+David+Icke%27s+Crazy+Coronavirus+Conspiracy+on+London+Real&redirect_counter=1&rm=sn-p5qys7e&req_id=a2d348b9ec8fa3ee&cms_redirect=yes&ipbypass=yes&mh=d-&mip=122.177.9.15&mm=31&mn=sn-ci5gup-qxa6&ms=au&mt=1596660755&mv=m&mvi=10&pcm2cms=yes&pl=20&lsparams=ipbypass,mh,mip,mm,mn,ms,mv,mvi,pcm2cms,pl&lsig=AG3C_xAwRgIhALAM07glkFIzyyjb4LHrBpx1abmWA-LcjghLHYESdjMlAiEA2wUhuYfF9EzSUcc0UiI2TUslCHBakEFzI14I03AZQSc%3D'}}
          disableVolume={true}
          disableBack={true}
          controlTimeout={3000}
          //navigator={this.props.navigator}
        />
        </View>

{/* <View style={{height:height/3,width:width*0.8,marginBottom:25}}>
<VideoPlayer
   source={{uri: 'https://r2---sn-ci5gup-qxae7.googlevideo.com/videoplayback?expire=1596671289&ei=2fAqX5O0DpHWxwKaxZngDQ&ip=80.211.65.43&id=o-AI21_v6ORSDCbeN0c-l5BDCBgLKa-13ynQYvkKvpunl5&itag=18&source=youtube&requiressl=yes&vprv=1&mime=video%2Fmp4&gir=yes&clen=15202219&ratebypass=yes&dur=194.977&lmt=1576471424554818&fvip=1&fexp=23883098&c=WEB&txp=5531432&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cgir%2Cclen%2Cratebypass%2Cdur%2Clmt&sig=AOq0QJ8wRQIhANQGve9rj8VmF6VH2SSUmxUbnlj6Fn_aWswmJ17niMcaAiBZl0f2ZWY52ZzCxctu3D43Id-cmPTHfLlWP5IVSJfmfw%3D%3D&video_id=F652A0WP-24&title=Osho+Jain+-+Khush+To+Hai+Na&redirect_counter=1&rm=sn-hpa6d7e&req_id=bfd2b2f0a59ca3ee&cms_redirect=yes&ipbypass=yes&mh=nZ&mip=122.177.9.15&mm=31&mn=sn-ci5gup-qxae7&ms=au&mt=1596658720&mv=m&mvi=7&pl=20&lsparams=ipbypass,mh,mip,mm,mn,ms,mv,mvi,pl&lsig=AG3C_xAwRQIgO7sdldANxg8XjedCGB9WkkOi-MN2jpV9xPfe33w2CZMCIQCFaWxyW7VsVb54NmYQJSsw41jFTG3iKYhfsiJmveH7hA%3D%3D&ir=1&rr=12'}}
   disableVolume={true}
   disableBack={true}
   controlTimeout={3000}
   //navigator={this.props.navigator}
 />
 </View>

<View style={{height:height/3,width:width*0.8,marginBottom:25}}>
<VideoPlayer
   source={{uri: 'https://r2---sn-ci5gup-qxae7.googlevideo.com/videoplayback?expire=1596671289&ei=2fAqX5O0DpHWxwKaxZngDQ&ip=80.211.65.43&id=o-AI21_v6ORSDCbeN0c-l5BDCBgLKa-13ynQYvkKvpunl5&itag=18&source=youtube&requiressl=yes&vprv=1&mime=video%2Fmp4&gir=yes&clen=15202219&ratebypass=yes&dur=194.977&lmt=1576471424554818&fvip=1&fexp=23883098&c=WEB&txp=5531432&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cgir%2Cclen%2Cratebypass%2Cdur%2Clmt&sig=AOq0QJ8wRQIhANQGve9rj8VmF6VH2SSUmxUbnlj6Fn_aWswmJ17niMcaAiBZl0f2ZWY52ZzCxctu3D43Id-cmPTHfLlWP5IVSJfmfw%3D%3D&video_id=F652A0WP-24&title=Osho+Jain+-+Khush+To+Hai+Na&redirect_counter=1&rm=sn-hpa6d7e&req_id=bfd2b2f0a59ca3ee&cms_redirect=yes&ipbypass=yes&mh=nZ&mip=122.177.9.15&mm=31&mn=sn-ci5gup-qxae7&ms=au&mt=1596658720&mv=m&mvi=7&pl=20&lsparams=ipbypass,mh,mip,mm,mn,ms,mv,mvi,pl&lsig=AG3C_xAwRQIgO7sdldANxg8XjedCGB9WkkOi-MN2jpV9xPfe33w2CZMCIQCFaWxyW7VsVb54NmYQJSsw41jFTG3iKYhfsiJmveH7hA%3D%3D&ir=1&rr=12'}}
   disableVolume={true}
   disableBack={true}
   controlTimeout={3000}
   //navigator={this.props.navigator}
 />
 </View>

<View style={{height:height/3,width:width*0.8,marginBottom:25}}>
<VideoPlayer
   source={{uri: 'https://r2---sn-ci5gup-qxae7.googlevideo.com/videoplayback?expire=1596671289&ei=2fAqX5O0DpHWxwKaxZngDQ&ip=80.211.65.43&id=o-AI21_v6ORSDCbeN0c-l5BDCBgLKa-13ynQYvkKvpunl5&itag=18&source=youtube&requiressl=yes&vprv=1&mime=video%2Fmp4&gir=yes&clen=15202219&ratebypass=yes&dur=194.977&lmt=1576471424554818&fvip=1&fexp=23883098&c=WEB&txp=5531432&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cgir%2Cclen%2Cratebypass%2Cdur%2Clmt&sig=AOq0QJ8wRQIhANQGve9rj8VmF6VH2SSUmxUbnlj6Fn_aWswmJ17niMcaAiBZl0f2ZWY52ZzCxctu3D43Id-cmPTHfLlWP5IVSJfmfw%3D%3D&video_id=F652A0WP-24&title=Osho+Jain+-+Khush+To+Hai+Na&redirect_counter=1&rm=sn-hpa6d7e&req_id=bfd2b2f0a59ca3ee&cms_redirect=yes&ipbypass=yes&mh=nZ&mip=122.177.9.15&mm=31&mn=sn-ci5gup-qxae7&ms=au&mt=1596658720&mv=m&mvi=7&pl=20&lsparams=ipbypass,mh,mip,mm,mn,ms,mv,mvi,pl&lsig=AG3C_xAwRQIgO7sdldANxg8XjedCGB9WkkOi-MN2jpV9xPfe33w2CZMCIQCFaWxyW7VsVb54NmYQJSsw41jFTG3iKYhfsiJmveH7hA%3D%3D&ir=1&rr=12'}}
   disableVolume={true}
   disableBack={true}
   controlTimeout={3000}
   //navigator={this.props.navigator}
 />
 </View>

<View style={{height:height/3,width:width*0.8,marginBottom:25}}>
<VideoPlayer
   source={{uri: 'https://r2---sn-ci5gup-qxae7.googlevideo.com/videoplayback?expire=1596671289&ei=2fAqX5O0DpHWxwKaxZngDQ&ip=80.211.65.43&id=o-AI21_v6ORSDCbeN0c-l5BDCBgLKa-13ynQYvkKvpunl5&itag=18&source=youtube&requiressl=yes&vprv=1&mime=video%2Fmp4&gir=yes&clen=15202219&ratebypass=yes&dur=194.977&lmt=1576471424554818&fvip=1&fexp=23883098&c=WEB&txp=5531432&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cgir%2Cclen%2Cratebypass%2Cdur%2Clmt&sig=AOq0QJ8wRQIhANQGve9rj8VmF6VH2SSUmxUbnlj6Fn_aWswmJ17niMcaAiBZl0f2ZWY52ZzCxctu3D43Id-cmPTHfLlWP5IVSJfmfw%3D%3D&video_id=F652A0WP-24&title=Osho+Jain+-+Khush+To+Hai+Na&redirect_counter=1&rm=sn-hpa6d7e&req_id=bfd2b2f0a59ca3ee&cms_redirect=yes&ipbypass=yes&mh=nZ&mip=122.177.9.15&mm=31&mn=sn-ci5gup-qxae7&ms=au&mt=1596658720&mv=m&mvi=7&pl=20&lsparams=ipbypass,mh,mip,mm,mn,ms,mv,mvi,pl&lsig=AG3C_xAwRQIgO7sdldANxg8XjedCGB9WkkOi-MN2jpV9xPfe33w2CZMCIQCFaWxyW7VsVb54NmYQJSsw41jFTG3iKYhfsiJmveH7hA%3D%3D&ir=1&rr=12'}}
   disableVolume={true}
   disableBack={true}
   controlTimeout={3000}
   //navigator={this.props.navigator}
 />
 </View>

<View style={{height:height/3,width:width*0.8,marginBottom:25}}>
<VideoPlayer
   source={{uri: 'https://r2---sn-ci5gup-qxae7.googlevideo.com/videoplayback?expire=1596671289&ei=2fAqX5O0DpHWxwKaxZngDQ&ip=80.211.65.43&id=o-AI21_v6ORSDCbeN0c-l5BDCBgLKa-13ynQYvkKvpunl5&itag=18&source=youtube&requiressl=yes&vprv=1&mime=video%2Fmp4&gir=yes&clen=15202219&ratebypass=yes&dur=194.977&lmt=1576471424554818&fvip=1&fexp=23883098&c=WEB&txp=5531432&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cgir%2Cclen%2Cratebypass%2Cdur%2Clmt&sig=AOq0QJ8wRQIhANQGve9rj8VmF6VH2SSUmxUbnlj6Fn_aWswmJ17niMcaAiBZl0f2ZWY52ZzCxctu3D43Id-cmPTHfLlWP5IVSJfmfw%3D%3D&video_id=F652A0WP-24&title=Osho+Jain+-+Khush+To+Hai+Na&redirect_counter=1&rm=sn-hpa6d7e&req_id=bfd2b2f0a59ca3ee&cms_redirect=yes&ipbypass=yes&mh=nZ&mip=122.177.9.15&mm=31&mn=sn-ci5gup-qxae7&ms=au&mt=1596658720&mv=m&mvi=7&pl=20&lsparams=ipbypass,mh,mip,mm,mn,ms,mv,mvi,pl&lsig=AG3C_xAwRQIgO7sdldANxg8XjedCGB9WkkOi-MN2jpV9xPfe33w2CZMCIQCFaWxyW7VsVb54NmYQJSsw41jFTG3iKYhfsiJmveH7hA%3D%3D&ir=1&rr=12'}}
   disableVolume={true}
   disableBack={true}
   controlTimeout={3000}
   //navigator={this.props.navigator}
 />
 </View>

<View style={{height:height/3,width:width*0.8,marginBottom:25}}>
<VideoPlayer
   source={{uri: 'https://r2---sn-ci5gup-qxae7.googlevideo.com/videoplayback?expire=1596671289&ei=2fAqX5O0DpHWxwKaxZngDQ&ip=80.211.65.43&id=o-AI21_v6ORSDCbeN0c-l5BDCBgLKa-13ynQYvkKvpunl5&itag=18&source=youtube&requiressl=yes&vprv=1&mime=video%2Fmp4&gir=yes&clen=15202219&ratebypass=yes&dur=194.977&lmt=1576471424554818&fvip=1&fexp=23883098&c=WEB&txp=5531432&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cgir%2Cclen%2Cratebypass%2Cdur%2Clmt&sig=AOq0QJ8wRQIhANQGve9rj8VmF6VH2SSUmxUbnlj6Fn_aWswmJ17niMcaAiBZl0f2ZWY52ZzCxctu3D43Id-cmPTHfLlWP5IVSJfmfw%3D%3D&video_id=F652A0WP-24&title=Osho+Jain+-+Khush+To+Hai+Na&redirect_counter=1&rm=sn-hpa6d7e&req_id=bfd2b2f0a59ca3ee&cms_redirect=yes&ipbypass=yes&mh=nZ&mip=122.177.9.15&mm=31&mn=sn-ci5gup-qxae7&ms=au&mt=1596658720&mv=m&mvi=7&pl=20&lsparams=ipbypass,mh,mip,mm,mn,ms,mv,mvi,pl&lsig=AG3C_xAwRQIgO7sdldANxg8XjedCGB9WkkOi-MN2jpV9xPfe33w2CZMCIQCFaWxyW7VsVb54NmYQJSsw41jFTG3iKYhfsiJmveH7hA%3D%3D&ir=1&rr=12'}}
   disableVolume={true}
   disableBack={true}
   controlTimeout={3000}
   //navigator={this.props.navigator}
 />
 </View>

<View style={{height:height/3,width:width*0.8,marginBottom:25}}>
<VideoPlayer
   source={{uri: 'https://r2---sn-ci5gup-qxae7.googlevideo.com/videoplayback?expire=1596671289&ei=2fAqX5O0DpHWxwKaxZngDQ&ip=80.211.65.43&id=o-AI21_v6ORSDCbeN0c-l5BDCBgLKa-13ynQYvkKvpunl5&itag=18&source=youtube&requiressl=yes&vprv=1&mime=video%2Fmp4&gir=yes&clen=15202219&ratebypass=yes&dur=194.977&lmt=1576471424554818&fvip=1&fexp=23883098&c=WEB&txp=5531432&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cgir%2Cclen%2Cratebypass%2Cdur%2Clmt&sig=AOq0QJ8wRQIhANQGve9rj8VmF6VH2SSUmxUbnlj6Fn_aWswmJ17niMcaAiBZl0f2ZWY52ZzCxctu3D43Id-cmPTHfLlWP5IVSJfmfw%3D%3D&video_id=F652A0WP-24&title=Osho+Jain+-+Khush+To+Hai+Na&redirect_counter=1&rm=sn-hpa6d7e&req_id=bfd2b2f0a59ca3ee&cms_redirect=yes&ipbypass=yes&mh=nZ&mip=122.177.9.15&mm=31&mn=sn-ci5gup-qxae7&ms=au&mt=1596658720&mv=m&mvi=7&pl=20&lsparams=ipbypass,mh,mip,mm,mn,ms,mv,mvi,pl&lsig=AG3C_xAwRQIgO7sdldANxg8XjedCGB9WkkOi-MN2jpV9xPfe33w2CZMCIQCFaWxyW7VsVb54NmYQJSsw41jFTG3iKYhfsiJmveH7hA%3D%3D&ir=1&rr=12'}}
   disableVolume={true}
   disableBack={true}
   controlTimeout={3000}
   //navigator={this.props.navigator}
 />
 </View> */}
 </View>
    )
    
  }

  if(isConnectedContext.isConnected && loading == true)
  {
    return (
      
      <View >
        <View style={{paddingBottom: (height*4)/12}}>
      {renderMainHeader()}
          </View>
          <Shimmer>
          <View style={{alignItems:'center'}}>
          
      <Image 
      source={{uri:"https://storage.googleapis.com/papyrus-fa45c.appspot.com/HomeScreen/WhatsApp%20Image%202020-03-29%20at%206.17.51%20PM.jpeg"}}
      style={{height: height/3,width: width/3}}/>
      </View>
      </Shimmer>  
      </View>  
       
    )
    }
  else if(isConnectedContext.isConnected == true || (flips.length != 0))
  {
    return (
      <View style = {{paddingBottom:30}}>
          {renderMainHeader()}
          {/* <ScrollView>
          {renderVideos()}
          </ScrollView> */}
    <View key={key} style = {{paddingBottom:100}}>
      {renderPodcasts()}
      </View>
      </View>
    );
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


export default withFirebaseHOC(HomeScreen);


const styles = StyleSheet.create({
  flex: {
    flex: 0,
  },
  separator: {
    borderBottomColor: '#d1d0d4',
    borderBottomWidth: 1,
    paddingTop:10
  },
  column: {
    flexDirection: 'column'
  },
  row: {
    flexDirection: 'row'
  },
  badgeStyle: {
    position: 'absolute',
    top: 15,
    right: 5
  },
  header: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.sizes.padding,
    paddingTop: theme.sizes.padding * 1.33,
    paddingBottom: theme.sizes.padding * 0.66,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  articles: {
  },
  destinations: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 30,
  },
  destination: {
    width: width - (theme.sizes.padding * 2),
    height: width * 0.6,
    marginHorizontal: theme.sizes.margin,
    paddingHorizontal: theme.sizes.padding,
    paddingVertical: theme.sizes.padding * 0.66,
    borderRadius: theme.sizes.radius,
  },
  destinationInfo: {
    position: 'absolute',
    borderRadius: theme.sizes.radius,
    paddingHorizontal: theme.sizes.padding,
    paddingVertical: theme.sizes.padding / 2,
    bottom: 10,
    left: (width - (theme.sizes.padding * 4)) / (Platform.OS === 'ios' ? 3.2 : 3),
    backgroundColor: theme.colors.white,
    width: width - (theme.sizes.padding * 4),
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
    marginHorizontal: 8,
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
    height: (width - (theme.sizes.padding * 2)) / 2,
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
    shadowColor: theme.colors.black,
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
    borderColor: theme.colors.active,
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
  AppHeader:
  {
 flexDirection:'row',
 backgroundColor: '#101010', 
  },
  storie: {
    height: 50,
    width: 50,
    borderRadius: 60,
    marginLeft: 7,
    borderWidth: 1,
    borderColor: '#dddddd',
  }, 
    sideMenuIcon:
  {
    resizeMode: 'center',
    width: 28, 
    height: 28, 
    marginRight: 10,
    marginLeft: 20
    
  },
});