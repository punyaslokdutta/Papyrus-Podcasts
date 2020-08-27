import React, { Component, useEffect,useState,useRef } from 'react';
import firestore from '@react-native-firebase/firestore';
import { Text, StyleSheet, View, Animated, Image, Dimensions, ScrollView,TouchableWithoutFeedback,ActivityIndicator, TouchableOpacity,TouchableNativeFeedback } from 'react-native'
import {Card, CardItem,  Body} from 'native-base'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { withFirebaseHOC } from './config/Firebase';
//import Animated, { Easing } from 'react-native-reanimated';
import Shimmer from 'react-native-shimmer';
import * as Animatable from 'react-native-animatable'
import Icon from 'react-native-vector-icons/FontAwesome'
import {useSelector, useDispatch} from "react-redux"
import moment from "moment";
import Toast from 'react-native-simple-toast'
import Tooltip from 'react-native-walkthrough-tooltip';
import ImageZoom from 'react-native-image-pan-zoom';

import * as theme from './components/constants/theme';

const { width, height } = Dimensions.get('window');
//const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView)

const AnimatedIcon = Animatable.createAnimatableComponent(Icon)

const RecordBook = (props) => {

  const  userID = props.firebase._getUid();
  const privateUserID = "private" + userID;
  const dispatch = useDispatch();
  const [loading,setLoading] = useState(false);
  const bookID = props.navigation.state.params.bookID;
  const [article,setArticle] = useState(null);
  var smallAnimatedBookmarkIcon = useRef();
  const bookmarked = useSelector(state=>state.userReducer.isBookBookmarked[bookID]);
  const [bookmarkedState,setBookmarkedState] = useState(bookmarked);

  const recordBookWalkthroughDone = useSelector(state=>state.userReducer.recordBookWalkthroughDone);
  const [toolTipRecordVisible,setToolTipRecordVisible] = useState(false);
  const [toolTipBookmarkVisible,setToolTipBookmarkVisible] = useState(false);

  const scrollX = new Animated.Value(0);
  
  useEffect(() => {
    if(props.navigation.state !== undefined)
    {
      setLoading(true);
      retrieveData();
    }
    
  },[props.navigation.state])

  useEffect(() => {
    if(recordBookWalkthroughDone == false){
      setTimeout(() => {
        setToolTipRecordVisible(true)
      },300)
    }
  },[])
  function handleSmallAnimatedBookmarkIconRef  (ref) {
    smallAnimatedBookmarkIcon = ref
  }


  async function addToBookmarks() {
    const picturesArray = [];
    picturesArray.push(article.bookPictures[0]);
 
   firestore().collection('users').doc(userID).collection('privateUserData').doc(privateUserID).collection('bookmarkContent').add({
     bookmarkedOn : moment().format(),
     bookName : article.bookName,
     bookID : article.bookID,
     bookPictures : picturesArray,
     bookDescription : article.bookDescription,
     authors: article.authors
   }).then(function(docRef){
     firestore().collection('users').doc(userID).collection('privateUserData').doc(privateUserID).collection('bookmarkContent').doc(docRef.id).set({
       bookmarkID : docRef.id
     },{merge:true})
     
     Toast.show("Saved to Collections");
   }).catch(function(error){
     console.log("Error in adding book bookmarks to user's book bookmarks collection: ",error);
   })
   
    firestore().collection('users').doc(userID).collection('privateUserData').doc(privateUserID).set({
        booksBookmarked : firestore.FieldValue.arrayUnion(article.bookID)
    },{merge:true}).catch(function(error){
      console.log("Error in adding bookID to booksBookmarked in user's private document: ",error);
    })
 
   dispatch({type:"ADD_TO_BOOKS_BOOKMARKED",payload:article.bookID});
 
 }


 async function removeFromBookmarks() {

  firestore().collection('users').doc(userID).collection('privateUserData').doc(privateUserID).collection('bookmarkContent')
     .where("bookID",'==',article.bookID).get().then(function(querySnapshot){
       querySnapshot.forEach(function(doc) {
         if(doc._data.chapterID === undefined || doc._data.chapterID === null)
         {
            doc.ref.delete().then(function() {
              Toast.show("Removed from Collections");
            }).catch(function(error){
           console.log("Error in removing book bookmarks from user's bookmarks collection: ",error);
         });
         }
       });
     });
  
   firestore().collection('users').doc(userID).collection('privateUserData').doc(privateUserID).set({
       booksBookmarked : firestore.FieldValue.arrayRemove(article.bookID)
     },{merge:true}).catch(function(error){
       console.log("Error in removing bookID from booksBookmarked in user's private document: ",error);
     })
 
   dispatch({type:"REMOVE_FROM_BOOKS_BOOKMARKED",payload:article.bookID});
 
 }

  function handleOnPressBookmark() {
    //smallAnimatedBookmarkIcon.bounceIn();
    if(bookmarked != true)
    {
      smallAnimatedBookmarkIcon.bounceIn();
      setBookmarkedState(true);
      addToBookmarks();
    }
    else
    {
      smallAnimatedBookmarkIcon.bounceIn();
      setBookmarkedState(false);
      removeFromBookmarks();
      
    }
    //setBookmarkedState(!bookmarkedState);
  }


  async function retrieveData () {
  
    console.log('[Record Book] Retrieving Data');
    try{
      console.log("bookID: ",bookID);
      
      let bookDoc = await firestore().collection('books').doc(bookID).get();
      setArticle(bookDoc._data);
    }
    catch(error){
      console.log(error)
    }
    finally {
      setLoading(false);
    }
    
  };

  async function setRecordBookWalkthroughInFirestore() {
    firestore().collection('users').doc(userID).collection('privateUserData').doc(privateUserID).set({
      recordBookWalkthroughDone : true
    },{merge:true}).then(() => {
        console.log("recordBookWalkthroughDone set in firestore successfully");       
    }).catch((error) => {
        console.log("Error in updating value of recordBookWalkthroughDone in firestore");
    })
  }

  function renderDots () {
    const dotPosition = Animated.divide(scrollX, width);
    return (
      <View style={[ styles.flex, styles.row, styles.dotsContainer ]}>
        {article.bookPictures && article.bookPictures.map((item, index) => {
          const opacity = dotPosition.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [0.5, 1, 0.5],
            extrapolate: 'clamp'
          });
          return (
            <Animated.View
              key={`step-${item}-${index}`}
              style={[styles.dots, styles.activeDot,{ opacity }]}
            />
          )
        })}
      </View>
    )
  }

  function renderRatings (rating) {
    const stars = new Array(5).fill(0);
    if(rating > 0)
    {
      return (
        stars.map((item, index) => {
          const activeStar = Math.floor(rating) >= (index + 1);
          return (
            <FontAwesome
              name="star"
              key={`star-${index}`}
              size={theme.sizes.font}
              color={theme.colors[activeStar ? 'active' : 'gray']}
              style={{ marginRight: 4 }}
            />
          )
        })
      )
    }
    else
    {
      return null;
    }
    
  }

  

    if(article != null) 
    { 
      return (
        <ScrollView  scrollEventThrottle={16} >
        <View style={styles.flex,{paddingBottom:height*2/11}}>
          <View style={[styles.flex]}>
            <Animated.ScrollView
            horizontal
            pagingEnabled
            scrollEnabled
            showsHorizontalScrollIndicator={false}
            decelerationRate={0.998}
            scrollEventThrottle={16}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }],
              {useNativeDriver:true}
              )}
          >
            {
               article.bookPictures && article.bookPictures.map((img, index) => 
               <ImageZoom cropWidth={width}
               cropHeight={width}
               imageWidth={width}
               imageHeight={width}>
                 <TouchableWithoutFeedback>
                <Image
                  key={`${index}-${img}`}
                  source={{ uri: img }}
                  resizeMode='contain'
                  style={{ width:width, height: width }}
                />
                </TouchableWithoutFeedback>
                </ImageZoom>
                
              )
            }
          </Animated.ScrollView>
          {renderDots()}
        </View>
        <View style={[styles.flex, styles.content]}>
          <View style={[styles.flex, styles.contentHeader]}>
            <View style={{flexDirection:'row'}}>
              <View>
            <Text style={styles.title}>{article.bookName}</Text>
            <Text> 
                {
                  article.authors.map(item => (
                    <Text style={{fontFamily:'Andika-R',fontSize:15}}>
                    {item}
                    {"\n"}
                    </Text>
                   ))
                } 
                </Text>
                {
                  article.bookRating !== undefined && article.bookRating !== null && 
                  article.bookRating > 0 &&
                  <View style={[
                    styles.row,
                    { alignItems: 'center', marginVertical: theme.sizes.margin / 2, flexDirection:'row' }
                  ]}>
                    {renderRatings(article.bookRating)}
                    <Text style={{ color: theme.colors.active }}>
                      {article.bookRating} 
                    </Text>
                    <View style={{paddingLeft:10}}>
                
                    </View>
                    </View>
                }
            
              </View>
               
            </View>

            
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',paddingTop:20,paddingBottom:20,paddingLeft:width/4}}>
            <View style={{width:width/2 - theme.sizes.padding}}>  
            <TouchableNativeFeedback onPress={()=>{
              dispatch({type:"SET_FROM_RECORD_BOOK_CHAPTER",payload:true})
              props.navigation.navigate('AddBookReviewScreen',{bookItem:article,chapterItem:null})
            }}>
            <View style={{width:width/6,alignItems:'center'}}>
              <Tooltip
              isVisible={toolTipRecordVisible}
              placement='right'
              content={
              <View style={{width:width/3}}>
              {/* <Image source={{uri:"https://storage.googleapis.com/papyrus-fa45c.appspot.com/flips/Book-Notes.jpg"}}
                      style={{height:width/2,width:width/2}}/> */}
              <Text style={{fontFamily:"Andika-R"}}>Create a book podcast</Text>
              </View>}
              onClose={() => {
                setToolTipRecordVisible(false)
                setToolTipBookmarkVisible(true);
              }}
            >
              <View style={{alignItems:'center'}}>
              <FontAwesome name="microphone" color={theme.colors.black} size={theme.sizes.font * 2.0} />
              <Text style={{fontSize:12,textAlign:'center',fontFamily:'Montserrat-Bold',width:width/6}}>Record</Text>
              </View>
              </Tooltip>
              </View>


            </TouchableNativeFeedback>
            </View> 
            
            <View style={{width:width/2}}>
          <TouchableNativeFeedback onPress={() => handleOnPressBookmark()}>
          <View style={{width:width/3}}>
          <Tooltip
              isVisible={toolTipBookmarkVisible}
              placement='left'
              content={
              <View style={{width:width/3}}>
              {/* <Image source={{uri:"https://storage.googleapis.com/papyrus-fa45c.appspot.com/flips/Book-Notes.jpg"}}
                      style={{height:width/2,width:width/2}}/> */}
              <Text style={{fontFamily:"Andika-R"}}>Save this book in your collections</Text>
              </View>}
              onClose={() => {
                setToolTipBookmarkVisible(false);
                dispatch({type:"SET_RECORD_BOOK_WALKTHROUGH",payload:true});
                setRecordBookWalkthroughInFirestore();
              }}
            >
          <View style={{alignItems:'center'}}>
                  <AnimatedIcon
                    ref={handleSmallAnimatedBookmarkIconRef}
                    name={bookmarked ? 'bookmark' : 'bookmark-o'}
                    color={bookmarked ? 'black' : 'black'}
                    size={20}
                    style={{height:30,width:30}}
                  />
           <Text style={{fontSize:12,textAlign:'center',fontFamily:'Montserrat-Regular',width:width/3}}>Want to Read</Text>

          </View>
          </Tooltip>
          </View>
                </TouchableNativeFeedback>
            </View>
            </View> 

            <View style={{borderRadius: 10 ,width:((width*4)/5 ), paddingTop :5}}>
            <View>
              {/* <Text style={{fontSize:20, paddingBottom:10, fontFamily:'Montserrat-SemiBold'}}>Description</Text> */}
              <Text style={{fontFamily:'Benne-Regular',fontSize:19,lineHeight:30}}>
                {article.bookDescription}
              </Text>
            </View>
            </View>
            
          </View>
        </View>
      </View>
      </ScrollView>
    )
  }
  else
  {
    return (
    <View style={{paddingTop:height*5/12}}>
       <ActivityIndicator size={"large"} color={"black"}/>
    </View>
    );
  }
  
}

export default withFirebaseHOC(RecordBook);

const styles = StyleSheet.create({
  TouchableOpacityStyle: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
    fontFamily:'Montserrat-Bold'
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 6.25,
    borderColor: theme.colors.active,
  },
  FloatingButtonStyle: {
    resizeMode: 'contain',
    width: 50,
    height: 50,
    //backgroundColor:'black'
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
  header: {
    // backgroundColor: 'transparent',
    paddingHorizontal: theme.sizes.padding,
    paddingTop: theme.sizes.padding,
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  back: {
    width: theme.sizes.base * 3,
    height: theme.sizes.base * 3,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  content: {
    // backgroundColor: theme.colors.active,
    // borderTopLeftRadius: theme.sizes.border,
    // borderTopRightRadius: theme.sizes.border,
  },
  contentHeader: {
    backgroundColor: 'transparent',
    padding: theme.sizes.padding,
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: theme.sizes.radius*4,
    borderTopRightRadius: theme.sizes.radius*4,
    marginTop: -theme.sizes.padding / 2,
  },
  avatar: {
    position: 'absolute',
    top: -theme.sizes.margin,
    right: theme.sizes.margin,
    width: theme.sizes.padding * 2,
    height: theme.sizes.padding * 2,
    borderRadius: theme.sizes.padding,
  },
  shadow: {
    shadowColor: theme.colors.black,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  indicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 80
  },
  dotsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 36,
    right: 0,
    left: 0
  },
  dots: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 6,
    backgroundColor: theme.colors.gray,
  },
  title: {
    fontSize: theme.sizes.font * 2,
    fontFamily:'HeadlandOne-Regular'
  },
  description: {
    fontSize: theme.sizes.font * 1.2,
    lineHeight: theme.sizes.font * 2,
    color: theme.colors.black,
    //fonFamily: 'sans-serif-light'
    
  }
});
