import React, {Component,useState,useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import { StyleSheet, View,SafeAreaView, TextInput, Platform, StatusBar,NativeModules,TouchableOpacity, ScrollView, Image,Dimensions, Animated,SectionList,ActivityIndicator , NativeEventEmitter} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import FontAwesome, { Icons } from 'react-native-fontawesome';
import {Container, Content, Card, Button} from 'native-base'
import PodcastPlayer from './PodcastPlayer'
import { FlatList } from 'react-native-gesture-handler';
import BookList from './components/Home/BookList'
import * as theme from '../screens/components/constants/theme';
import Podcast from './components/Home/Podcast'
import firebaseApi from './config/Firebase/firebaseApi'
import {Text} from './components/categories/components';
import {withFirebaseHOC} from '../screens/config/Firebase'
import { withNavigation } from 'react-navigation';
import { useSelector, useDispatch } from 'react-redux';

var {width, height}=Dimensions.get('window')
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

var {width, height}=Dimensions.get('window')

const HomeScreen = (props) => {
  
  const userPreferences = useSelector(state=>state.userReducer.userPreferences);
  const [books,setBooks] = useState([]);
  const [headerPodcasts,setHeaderPodcasts] = useState([]);
  const [podcasts,setPodcasts] = useState([]);
  const limit = 8;
  const initialLimit = 40;
  const [lastVisibleID,setLastVisibleID] = useState(null);
  const [loading,setLoading] = useState(false);
  const [refreshing,setRefreshing] = useState(false);
  const [onEndReachedCalledDuringMomentum,setOnEndReachedCalledDuringMomentum] = useState(false);

  // static navigationOptions=({navigation})=>({
  //   title:"Home", 
  //   drawerIcon:()=> <Icon name="home" size={24} style={{color:'white'}}/>
  // });

    // componentDidMount = async () => {
    //   try {
    //     this.retrieveData();
    //   }
    //   catch (error) {
    //     console.log(error);
    //   }
    // };

    async function retrieveData() 
    {
      try {
        setLoading(true);
        
        console.log("[HomeScreen] Retrieving Data");
        //For books in section list
        // let bookDocuments =  await firestore().collection('users').doc(userid).collection('privateUserData')
        // .doc(privateDataID).collection('bookRecommendations').get()
        // let bookPodcasts = bookDocuments.docs.map(document => document.data());

        //For podcasts in section list
        let headerpodcasts = await firestore().collectionGroup('podcasts').where('genres','array-contains-any',userPreferences)
                         .orderBy('createdOn','desc').limit(initialLimit).get()
        
        let documentData_podcasts = headerpodcasts.docs.map(document => document.data());
        var lastVisiblePodcast = lastVisibleID;
        if(documentData_podcasts.length != 0)      
           lastVisiblePodcast = documentData_podcasts[documentData_podcasts.length - 1].podcastID; 

       
        //For Flatlist podcasts
        let mainpodcasts = await firestore().collectionGroup('podcasts').where("genres","array-contains-any",userPreferences)
        .orderBy('createdOn','desc').startAfter(lastVisiblePodcast).limit(limit).get()
       
        let podcastsData = mainpodcasts.docs.map(document => document.data());
        if(podcastsData.length != 0)      
          lastVisiblePodcast = podcastsData[podcastsData.length - 1].podcastID; 

      
       // setBooks(bookPodcasts);
        setHeaderPodcasts(documentData_podcasts);
        setPodcasts(podcastsData);
        setLastVisibleID(lastVisiblePodcast);
        setLoading(false);
        setOnEndReachedCalledDuringMomentum(true);
      }
      catch (error) {
        console.log(error);
      }
    };

    
    async function retrieveMore()
    {
      try
      {
          {console.log("[HomeScreen] retrieveMoreBookPodcasts starts()")}
          setRefreshing(true);
          let additionalQuery = null;
          try{
            additionalQuery =  await firestore().collectionGroup('podcasts').where("genres","array-contains-any",userPreferences)
            .orderBy('createdOn','desc').startAfter(lastVisiblePodcast).limit(limit).get()
          
            {console.log("[HomeScreen] retrieveMorePodcasts afterQuery()")}
                 
          
         }
         catch(error)
         {
           console.log(error);
         }
         let documentSnapshots=null;
         try{
          documentSnapshots = await additionalQuery.get();
         }
         catch(error)
         {
             console.log(error);
         }
       
        let documentData = documentSnapshots.docs.map(document => document.data());
        if(documentData.length != 0)
        {
          let lastVisiblePodcast = documentData[documentData.length - 1].podcastID;
          
          if(lastVisibleID == lastVisiblePodcast)
          {
              setRefreshing(false);
          }
          else
          {
            setRefreshing(false);
            setPodcasts([...podcasts, ...documentData]);
            setLastVisibleID(lastVisiblePodcast);
            setOnEndReachedCalledDuringMomentum(true);
          }
        }
        else
        {
          setRefreshing(false);
        }
      }
      catch(error)
      {
       console.log(error);
      }
    }


    useEffect(() => {
      retrieveData();
    },[])    

    function onEndReached({ distanceFromEnd }) {
      if(!onEndReachedCalledDuringMomentum){
        retrieveMore();
        setOnEndReachedCalledDuringMomentum(true);
      }
    }

    function renderMainHeader()
    {
      return (
      <View style={styles.AppHeader}>
        <TouchableOpacity onPress={()=>props.navigation.toggleDrawer()}>
        <View style={{paddingLeft: 15,paddingRight:10 ,paddingVertical:18} }>
          <Icon name="bars" size={22} style={{color:'white'}}/>
        </View>
        </TouchableOpacity>
        <View>
        <Text style={{fontFamily:'sans-serif-light', color:'white', paddingLeft:15, fontSize:15, paddingTop:20}}>Papyrus</Text>
        </View>

        </View>
      )
    }
   
    function renderSectionBooks(title)
    {     
      switch(title) {
        case "A":
          return (<View>
          
          <View style={{backgroundColor:'white'}}>  
          <Text h2 bold style={{paddingHorizontal: 30,paddingTop:10,paddingBottom:10,   textShadowColor:'black'}}>Record Book Podcasts</Text>
          <BookList navigation={props.navigation} destinations={books}/>
          </View>
          </View>)
        case "B":
          return (<View style={{paddingTop:30,paddingBottom:30}}>
            
            <View style={{backgroundColor:'#c9aa88'}}>
            <Text h2 bold style={{paddingHorizontal: 30,paddingTop:10,paddingBottom:10,   textShadowColor:'black'}}>Record Chapter Podcasts</Text>
          <BookList navigation={props.navigation} destinations={books}/>
          </View>
          </View>)
        case "C":
          return (
          <View style={{paddingTop:30,paddingBottom:30}}>
            
            <View style={{backgroundColor:'#99AFD7'}}>
            <Text h2 bold style={{paddingHorizontal: 30,paddingTop:10,paddingBottom:10,   textShadowColor:'black'}}>Record Chapter Podcasts</Text>
          <BookList navigation={props.navigation} destinations={books}/>
          </View>
          </View>)
        case "D":
          return (<View style={{paddingTop:30,paddingBottom:30}}>
            
            <View style={{backgroundColor:'#C76E95'}}>
            <Text h2 bold style={{paddingHorizontal: 30,paddingTop:10,paddingBottom:10,   textShadowColor:'black'}}>Record Chapter Podcasts</Text>
          <BookList navigation={props.navigation} destinations={books}/>
          </View>
          </View>)
        case "E":
          return (<View style={{paddingTop:30,paddingBottom:30}}>
            
            <View style={{backgroundColor:'#C6FC5F'}}>
            <Text h2 bold style={{paddingHorizontal: 30,paddingTop:10,paddingBottom:10,   textShadowColor:'black'}}>Record Chapter Podcasts</Text>
          <BookList navigation={props.navigation} destinations={books}/>
          </View>
          </View>)
        }
    }

    function renderData({ section, index }) {
      const numColumns  = 2;
  
      if (index % numColumns !== 0) return null;
  
      const items = [];
  
      for (let i = index; i < index + numColumns; i++) {
        if (i >= section.data.length) {
          break;
        }
        items.push(<Podcast isHomeScreen={true} podcast={section.data[i]} key={section.data[i].podcastID}  navigation={props.navigation}  />);
      }
      return (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingRight: width/10
          }}
        >
          {items}
        </View>
      );
    };
    
    function renderHeader()
    {
      var podcasts1 = headerPodcasts.slice(0,8);
      var podcasts2 = headerPodcasts.slice(8,16);
      var podcasts3 = headerPodcasts.slice(16,24);
      var podcasts4 = headerPodcasts.slice(24,32);
      var podcasts5 = headerPodcasts.slice(32,40);
      return(
        // <View><Text>PODCASTS</Text></View>
        <View style={{ paddingBottom:50, marginTop: Platform.OS == 'ios' ? 20 : 30 }}>
          
        <SectionList
          showsVerticalScrollIndicator={false}
          //ItemSeparatorComponent={FlatListItemSeparator}
          sections={[
            { title: 'A', data: podcasts1},
            { title: 'B', data: podcasts2 },
            { title: 'C', data: podcasts3 },
            { title: 'D', data: podcasts4 },
            { title: 'E', data: podcasts5 },
          ]}
          keyExtractor={item => item.podcastID}
          renderSectionHeader={({ section }) => (
            <ScrollView>
                
                {console.log("[HomeScreen] SECTION DATA: ",section)}
                {console.log("[HomeScreen] SECTION TITLE: ",section.title)}

            {/* {renderSectionBooks(section.title)} */}
            <Text h3 bold style={{paddingLeft: 30,   textShadowColor:'black'}}>Discover Podcasts
            </Text>
            </ScrollView>
          )}
          renderItem={renderData}
        />
        
      </View>
      )
    }
    
    function renderDatas({item,index})
    {
       return(
         <View>
        <Podcast podcast={item} index={index} navigation={props.navigation}/>
        </View>
       )
    }

    function renderFooter() 
    {
      try {
        if (refreshing) {
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

    function renderPodcasts()
    {
      return (  
        <FlatList
        data={podcasts}
        renderItem={renderDatas}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.podcastID}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onMomentumScrollBegin={() => { setOnEndReachedCalledDuringMomentum(false); }}
      />   
      )
    }

    
    if(loading == true)
    {
      return (
        <View >
          <View style={{paddingBottom: (height*4)/12}}>
        {renderMainHeader()}
            </View>
            <View style={{alignItems:'center'}}>
            
        <Image 
        source={{uri:"https://storage.googleapis.com/papyrus-fa45c.appspot.com/HomeScreen/WhatsApp%20Image%202020-03-29%20at%206.17.51%20PM.jpeg"}}
        style={{height: height/3,width: width/3}}/>
        </View>  
        </View>    
      )
    }
    else
    {
      return (
        <View>
            {renderMainHeader()}
      <View style = {{paddingBottom:50}}>
        {renderPodcasts()}
        </View>
        </View>
      );
    }
  }


export default HomeScreen;
