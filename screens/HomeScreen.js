import React, {Component,useState,useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import { StyleSheet, View,SafeAreaView, TextInput, Platform, StatusBar,NativeModules,TouchableOpacity, 
  ScrollView, Image,Dimensions, Animated,SectionList,ActivityIndicator , 
  NativeEventEmitter,RefreshControl} from 'react-native';
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

var {width, height}=Dimensions.get('window')

const HomeScreen = (props) => {
  
  const uploadPodcastSuccess = useSelector(state=>state.userReducer.uploadPodcastSuccess);
  const numNotifications = useSelector(state=>state.userReducer.numNotifications);
  const userPreferences = useSelector(state=>state.userReducer.userPreferences);
  const [books,setBooks] = useState([]);
  const [headerPodcasts,setHeaderPodcasts] = useState([]);
  const [podcasts,setPodcasts] = useState([]);
  const [flips,setFlips] = useState([]);
  const limit = 8;
  const headerPodcastsLimit = 8;
  const bookLimit = 5;
  const [podcastPresentMap,setPodcastPresentMap] = useState({});
  const [lastVisible,setLastVisible] = useState(null);
  const [loading,setLoading] = useState(false);
  const [refreshing,setRefreshing] = useState(false);
  const [onEndReachedCalledDuringMomentum,setOnEndReachedCalledDuringMomentum] = useState(true);
  const [scrollPosition,setScrollPosition] = useState(0);
  const dispatch = useDispatch();
  

  useEffect(() => {
    console.log("[HomeScreen] useEffect LOG");
    props.navigation.addListener('didFocus', (route) => {
      console.log("HOME TAB PRESSED");
      dispatch({type:"CHANGE_SCREEN"});
      });
    retrieveData();

  },[])  

  useEffect(() => {
    
      console.log("uploadPodcastSuccess1234: ",uploadPodcastSuccess);
      retrieveData();
    
  },[uploadPodcastSuccess])

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
      let podcasts = await firestore().collectionGroup('podcasts').where('genres','array-contains-any',userPreferences)
                    .orderBy('lastEditedOn','desc').limit(initialLimit).get();

      // 8 podcasts of lastEditedOn
      let latestPodcasts = await firestore().collectionGroup('podcasts')
                    .orderBy('lastEditedOn','desc').limit(limit).get();

      let latestFlips = await firestore().collection('flips').orderBy('lastEditedOn','desc').get();
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
         {/* <HomeAnimation/> */}
      </View>
      {renderFlips()}

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

    </View>
    )
  }
  
  function renderFlips(){
    return (
      flips.slice(0,5).map((item,index) => {
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
            index == 0
            &&
            renderFlips()
          } */}
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
      onEndReachedThreshold={0.5}
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


  if(loading == true || (loading == false && podcasts.length == 0 && headerPodcastsLimit.length == 0))
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
  else
  {
    return (
      <View style = {{paddingBottom:30}}>
          {renderMainHeader()}
    <View style = {{paddingBottom:100}}>
      {renderPodcasts()}
      </View>
      </View>
    );
  }
}


export default HomeScreen;


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