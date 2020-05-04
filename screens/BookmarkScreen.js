import React, {Component,useState,useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import { StyleSheet, View,SafeAreaView, TextInput, Platform, StatusBar,NativeModules,TouchableOpacity, ScrollView, Image,Dimensions, Animated,SectionList,ActivityIndicator , NativeEventEmitter} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import { FlatList } from 'react-native-gesture-handler';
import BookList from './components/Home/BookList'
import * as theme from '../screens/components/constants/theme';
import Podcast from './components/Home/Podcast'
import {Text} from './components/categories/components';
import { useSelector} from 'react-redux';
import { Badge } from 'react-native-elements'
import Shimmer from 'react-native-shimmer';
import { withFirebaseHOC } from './config/Firebase';

var {width, height}=Dimensions.get('window')

const BookMarkScreen = (props) => {
  
  const  userID = props.firebase._getUid();
  const privateUserID = "private" + userID;
  const [podcasts,setPodcasts] = useState([]);
  const limit = 6;
  const [lastVisible,setLastVisible] = useState(null);
  const [loading,setLoading] = useState(false);
  const [refreshing,setRefreshing] = useState(false);
  const [onEndReachedCalledDuringMomentum,setOnEndReachedCalledDuringMomentum] = useState(true);

  useEffect(() => {
    retrieveData();
  },[])  

  async function retrieveData() 
  {
    setLoading(true);
    try{
      console.log("[BookMarkScreen] Retrieving Data");

      let podcasts = await firestore().collection('users').doc(userID).collection('privateUserData').doc(privateUserID).collection('bookmarks')
                    .orderBy('bookmarkedOn','desc').limit(limit).onSnapshot((querySnapshot) => {
                        var documentData_podcasts = [];

                        querySnapshot.forEach(function(doc) {
                            documentData_podcasts.push(doc.data());
                        });
                        var lastVisiblePodcast = lastVisible;
                        if(documentData_podcasts.length != 0)      
                            lastVisiblePodcast = documentData_podcasts[documentData_podcasts.length - 1].bookmarkedOn; 
                  
                        setPodcasts(documentData_podcasts);
                        setLastVisible(lastVisiblePodcast);
                    },function(error) {
                        console.log("Error in onSnapshot Listener in BookmarkScreen: ",error);
                      })
     
      }
    catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false);
    }
  };

  
  async function retrieveMorePodcasts()
  {
    console.log("[BookMarkScreen] retrieveMorePodcasts starts()")
    setRefreshing(true);
    try{   
      let additionalPodcastDocuments =  await firestore().collection('users').doc(userID).collection('privateUserData').doc(privateUserID)
                                        .collection('bookmarks').orderBy('bookmarkedOn','desc').startAfter(lastVisible).limit(limit).get()
      console.log(lastVisible);
      let documentData = additionalPodcastDocuments.docs.map(document => document.data());
      console.log(documentData);
      if(documentData.length != 0) 
      {
        let lastVisiblePodcast = documentData[documentData.length - 1].bookmarkedOn;
        if(lastVisible != lastVisiblePodcast) 
        {
          setPodcasts([...podcasts, ...documentData]);
          setLastVisible(lastVisiblePodcast);
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
    if(podcasts.length >= 5 && podcasts.length < 48)
    {
        if(!onEndReachedCalledDuringMomentum){
            retrieveMorePodcasts();
            setOnEndReachedCalledDuringMomentum(true);
          }
    }
  }

//   function renderMainHeader()
//   {
//     return (
//     <View style={styles.AppHeader}>
//       <TouchableOpacity onPress={()=>props.navigation.toggleDrawer()}>
//         {
//           (numNotifications == 0)
//           ?
//           <View style={{paddingLeft: 15 ,paddingVertical:18} }>
//             <Icon name="bars" size={22} style={{color:'white'}}/>
//           </View>
//           :
//           <View style={{flexDirection:'row',paddingLeft: 15,paddingVertical:18} }>
//           <Icon name="bars" size={22} style={{color:'white'}}/>
//           <Badge
//           width={5}
//           textStyle={{fontSize:8}}
//           value={numNotifications}
//           status="error"
//           containerStyle={styles.badgeStyle}
//           />
//           </View>
//         }
      

//       </TouchableOpacity>
//       <View>
//       <Text style={{paddingTop:theme.sizes.padding/2,color:'white',fontSize:theme.sizes.font*1,paddingLeft:theme.sizes.padding/2,paddingRight:10}}>Bookmarks </Text> 

//       </View>

//       </View>
//     )
//   }  
  
  function renderDatas({item,index})
  {
      return(
        <View>
      <Podcast podcast={item} isBookmark={true} index={index} navigation={props.navigation}/>
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

  function renderPodcasts()
  {
    return (  
      <FlatList
      data={podcasts}
      renderItem={renderDatas}
      numColumns={2}
      showsVerticalScrollIndicator={false}
      keyExtractor={item => item.podcastID}
      //ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.001}
      refreshing={refreshing}
      onMomentumScrollBegin={() => { setOnEndReachedCalledDuringMomentum(false); }}
    />   
    )
  }

  
  if(loading == true || (loading == false && podcasts.length == 0))// && headerPodcastsLimit.length == 0))
  {
    return (
      
      <View >
          <Shimmer>
          <View style={{alignItems:'center'}}>
          
      <Image 
      source={{uri:"https://storage.googleapis.com/papyrus-fa45c.appspot.com/BookMarkScreen/WhatsApp%20Image%202020-03-29%20at%206.17.51%20PM.jpeg"}}
      style={{height: height/3,width: width/3}}/>
      </View>
      </Shimmer>  
      </View>  
       
    )
  }
  else
  {
    return (
    <View>
      {renderPodcasts()}
      </View>
    );
  }
}


export default withFirebaseHOC(BookMarkScreen);


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