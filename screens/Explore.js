import React, {Component, useState,useEffect, useRef, createRef} from 'react';
import firestore from '@react-native-firebase/firestore';
import { StyleSheet, Text, View, SafeAreaView, ActivityIndicator, TextInput, Platform, StatusBar,TouchableOpacity,Dimensions, ScrollView, Image, NativeModules, NativeEventEmitter} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import TrendingPodcast from './components/Explore/TrendingPodcast'
import TopChapters from './components/Explore/TopChapters';
import Story from './components/Explore/Story'
import ExploreBook from './components/Explore/ExploreBook'
import { Badge } from 'react-native-elements'
import {useSelector, useDispatch} from "react-redux"

const {width,height} = Dimensions.get('window')

const Explore = (props) => {

  var [storytellers,setStorytellers] = useState([]);
  var [podcasts,setPodcasts] = useState([]);
  var [books,setBooks] = useState([]);
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
    
    // Trending podcasts
    try{
      let podcastQuery = await firestore().collectionGroup('podcasts').where('isTrendingPodcast','==',true).get();
      let documentPodcasts = podcastQuery.docs.map(document => document.data());
      setPodcasts(documentPodcasts);
    }
    catch(error){
      console.log(error)
    }

    // Short Stories
    try{
      let bookQuery = await firestore().collectionGroup('podcasts').where('isShortStory','==',true).get();
      let documentBooks = bookQuery.docs.map(document => document.data());
      setBooks(documentBooks);
    }
    catch(error){
      console.log(error)
    }

    // Classic Novels
    try{
      let chapterQuery = await firestore().collectionGroup('podcasts').where('isClassicNovel','==',true).get();
      let documentChapters = chapterQuery.docs.map(document => document.data());
      setChapters(documentChapters);
    }
    catch(error){
      console.log(error)
    }
    setLoading(false);
  }

      useEffect(
        () => {
          fetchExploreItems();
          //console.log("EXPLORE USE EFFECT - props.navigation.state.params : ",props.navigation.state);
          if(props.navigation.state.params !== undefined && props.navigation.state.params.podcastID !== undefined 
                   && props.navigation.state.params.podcastID !== null)
                   {
                    console.log("podcast to be played: ",props.navigation.state.params.podcastID);
                    fetchPodcastItem(props.navigation.state.params.podcastID);
                   }
            

          console.log("Explore Use EFFECT Ends");
          //const eventEmitter=new NativeEventEmitter(NativeModules.ReactNativeRecorder);
      },[])

      async function fetchPodcastItem(podcastID)
      {
        let podcastItem = await firestore().collectionGroup('podcasts').where('podcastID','==',podcastID).get();
        let podcastData = podcastItem.docs[0]._data;

        dispatch({type:"ADD_NAVIGATION", payload:props.navigation})
        dispatch({type:"SET_CURRENT_TIME", payload:0})
        dispatch({type:"SET_DURATION", payload:podcastData.duration});
        dispatch({type:"SET_PAUSED", payload:false})
        dispatch({type:"SET_LOADING_PODCAST", payload:true});
        dispatch({type:"SET_PODCAST", payload: podcastData}) 
        dispatch({type:"SET_NUM_LIKES", payload: podcastData.numUsersLiked})
      }

      useEffect( () => {
        if(props.navigation.state.params !== undefined && props.navigation.state.params.podcastID !== undefined 
          && props.navigation.state.params.podcastID !== null)
          {
            console.log("[Use Effect of props.navigation.state] podcast to be played: ",props.navigation.state.params.podcastID);
            fetchPodcastItem(props.navigation.state.params.podcastID);
          }
            
      },[props.navigation.state])

    function renderStoryTellers()
    {
      console.log("storytellers: ",storytellers);

      return storytellers.map((item, index)=>
      {
        return(<Story item={item} index={index} key ={index} navigation={props.navigation}/>)
      })
    };

    function renderSectionStoryTellers()
    {
      return (
        <View style={{flexDirection:'row' , flexWrap:'wrap'}}>
        <View style={{flexDirection:'row' , flexWrap:'wrap',paddingBottom:10}}>{renderStoryTellers()}</View>
        </View>
      )
    }

    function renderPodcasts()
    {
       return podcasts.map((item, index)=>
      {
        return(<TrendingPodcast item={item} index={index} key ={index} navigation={props.navigation}/>)
      })

    }

    function renderSectionPodcasts()
    {
        return (
          <View style={{flexDirection:'row' , flexWrap:'wrap'}}>
          <View style={{flexDirection:'row' , flexWrap:'wrap',paddingBottom:10}}>{renderPodcasts()}</View>
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
        <View style={{flexDirection:'row' , flexWrap:'wrap'}}>
        <View style={{flexDirection:'row' , flexWrap:'wrap',paddingBottom:10}}>{renderChapters()}</View>
        </View>
       
      )
    }

    function renderBooks()
    {
       return books.map((item, index)=>
      {
        return(<ExploreBook item={item} index={index} key ={index} navigation={props.navigation}/>)
      })

    }

    function renderSectionBooks()
    {
      return (
        <View style={{flexDirection:'row' , flexWrap:'wrap'}}>
        <View style={{flexDirection:'row' , flexWrap:'wrap',paddingBottom:10}}>{renderBooks()}</View>
        </View>
       
      )
    }
 
    function renderMainHeader() 
    {
      return (
      <View style={styles.AppHeader}>
        <TouchableOpacity onPress={()=>props.navigation.toggleDrawer()}>
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
        </TouchableOpacity>
        <View style={{flex:1, paddingVertical:10}}>
          <TouchableOpacity onPress={() => {
            dispatch({type:"SET_ALGOLIA_QUERY", payload:"papyrus"})
            dispatch({type:"SET_EXPLORE_SCREEN_AS_PREVIOUS_SCREEN", payload:true})
            props.navigation.navigate('SearchTabNavigator',{fromExplore:true})}}>
        <View style={{flexDirection:'row',height:startHeaderHeight, backgroundColor: 'white', paddingRight: 13, paddingVertical:10}}>
       
            <Text style={{ flex:1, fontWeight:'400',borderRadius:2,backgroundColor:'#dddd',fontSize:13,
              paddingTop: 7, paddingHorizontal: 10 }}>
           
              <Icon style={{paddingHorizontal:10,paddingTop:20 }} name="search" size={15} />
             

              {"  "}Search by podcasts,books,chapters,authors
               </Text>

        </View>
        </TouchableOpacity>
        </View>
        </View>
      )
    }
     
      if(loading == true)
      {
        return (
          <View>
          <View style={{paddingBottom: (height*5)/12}}>
        {renderMainHeader()}
            </View>
        <ActivityIndicator/>
        </View>    
        )
      }
      else
      {
        return (
     
          <SafeAreaView style={{flex:1, backgroundColor:'white'}}>
          {renderMainHeader()}
          <ScrollView  scrollEventThrottle={16}>
          <View style={{height:120}}>
          <View style={{flex:1}}>
          <Text style={{fontSize:20, fontWeight:'200', paddingHorizontal: 20, textShadowColor:'black',fontFamily:'sans-serif-light'}}>
                          {sections.length != 0 && sections[0].sectionName}
                      </Text>
          </View>
          <View style={{flex:3,paddingTop:10}}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
         
          {renderSectionStoryTellers()}
          </ScrollView>
          </View>
         
          </View>
             
              <View style={{flex:1 , backgroundColor:'white', paddingTop:10}}>
                      <Text style={{fontSize:20, fontWeight:'normal', paddingHorizontal: 20, textShadowColor:'black',fontFamily:'sans-serif-light'}}>
                      {sections.length != 0 && sections[1].sectionName}
                      </Text>
              </View>  
                  <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{paddingTop:10}}>
                     
                      {renderSectionPodcasts()}
                  </ScrollView>
                  <View style={{flex:1 , backgroundColor:'white', paddingTop:10}}>
                  <Text style={{fontSize:20, fontWeight:'normal', paddingHorizontal: 20, textShadowColor:'black', fontFamily:'sans-serif-light'}}>
                  {sections.length != 0 && sections[2].sectionName}
                      </Text>
              </View>
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{paddingTop:10}}>
              {renderSectionBooks()}
                   
                  </ScrollView>
                  <View style={{flex:1 , backgroundColor:'white', paddingTop:10}}>
                  <Text style={{fontSize:20, fontWeight:'normal', paddingHorizontal: 20,  textShadowColor:'black', fontFamily:'sans-serif-light'}}>
                  {sections.length != 0 && sections[3].sectionName}
                      </Text>
                      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{paddingTop:10}}>
                      {renderSectionChapters()}                
                     
                  </ScrollView>
              </View>
             
                 
              </ScrollView>
          </SafeAreaView>
        )
      }
  }

export default Explore;


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
