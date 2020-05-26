import React, {Component,useState,useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import { StyleSheet,ImageBackground, View,SafeAreaView, TextInput, Platform, StatusBar,NativeModules,TouchableOpacity, ScrollView, Image,Dimensions, Animated,SectionList,ActivityIndicator , NativeEventEmitter} from 'react-native';
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
import BookmarkBookItem from './components/Profile/BookmarkBookItem';
var {width, height}=Dimensions.get('window')

const BookmarkScreenBooks = (props) => {
  
  const  userID = props.firebase._getUid();
  const privateUserID = "private" + userID;
  const [books,setBooks] = useState([]);
  const limit = 3;
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

        let query = await firestore().collection('users').doc(userID).collection('privateUserData').doc(privateUserID)
            .collection('bookmarkContent').orderBy('bookmarkedOn','desc').limit(limit).onSnapshot((querySnapshot) => {
            var documentData_books = [];

            querySnapshot.forEach(function(doc) {
                documentData_books.push(doc.data());
            });
            var lastVisibleBook = lastVisible;
            if(documentData_books.length != 0)      
                lastVisibleBook = documentData_books[documentData_books.length - 1].bookmarkedOn; 
        
            setBooks(documentData_books);
            setLastVisible(lastVisibleBook);
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

  
  async function retrieveMoreBooks()
  {
    console.log("[BookMarkScreen] retrieveMoreBooks starts()")
    setRefreshing(true);
    try{   
      let additionalBookDocuments =  await firestore().collection('users').doc(userID).collection('privateUserData').doc(privateUserID)
                                        .collection('bookmarkContent').orderBy('bookmarkedOn','desc').startAfter(lastVisible).limit(limit).get()
      console.log(lastVisible);
      let documentData = additionalBookDocuments.docs.map(document => document.data());
      console.log(documentData);
      if(documentData.length != 0) 
      {
        let lastVisibleBook = documentData[documentData.length - 1].bookmarkedOn;
        if(lastVisible != lastVisibleBook) 
        {
          setBooks([...books, ...documentData]);
          setLastVisible(lastVisibleBook);
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
    if(books.length >= 3 && books.length < 48)
    {
        if(!onEndReachedCalledDuringMomentum){
            retrieveMoreBooks();
            setOnEndReachedCalledDuringMomentum(true);
          }
    }
  }
  
function renderBook({item,index})  {
       //console.log("item: ",item);
    return (
        <View>
        <View style={{height:15}}/>
        <BookmarkBookItem book={item} index={index} navigation={props.navigation}/>
        <View style={{height:15}}/>
        </View>
    )
  }

  function renderFooter() 
  {
    try {
      if (refreshing === true) {
        return (
          <ActivityIndicator color={'black'}/>
           
        )
      }
      else {
        return <View style={[styles.separator]} />;
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  function separator(){
    return(
      <View style={[styles.separator]} />
    )
  }

  function renderBooks()
  {
    return (  
      <FlatList
      data={books}
      renderItem={renderBook}
      //numColumns={2}
      showsVerticalScrollIndicator={false}
      keyExtractor={item => item.bookID}
      //style={{backgroundColor:'#212121'}}
      //ListHeaderComponent={renderHeader}
      ItemSeparatorComponent={separator}
      ListFooterComponent={renderFooter}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      refreshing={refreshing}
      onMomentumScrollBegin={() => { setOnEndReachedCalledDuringMomentum(false); }}
    />   
    )
  }

  
  if(loading == true || (loading == false && books.length == 0))// && headerPodcastsLimit.length == 0))
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
      {renderBooks()}
      </View>
    );
  }
}


export default withFirebaseHOC(BookmarkScreenBooks);


const styles = StyleSheet.create({
  separator: {
    borderBottomColor: '#d1d0d4',
    borderBottomWidth: 1
  },
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