import { Text, Dimensions,View, StyleSheet,ImageBackground, TouchableOpacity,TouchableNativeFeedback } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import React, { Component, useEffect,useState,useRef } from 'react';
import * as theme from '../constants/theme';
import * as Animatable from 'react-native-animatable'
import Icon from 'react-native-vector-icons/FontAwesome'
import {useSelector, useDispatch} from "react-redux"
import { withFirebaseHOC } from '../../config/Firebase';
import firestore from '@react-native-firebase/firestore';
import moment from "moment";
import LinearGradient from 'react-native-linear-gradient';


const { width, height } = Dimensions.get('window');

const areEqual = (prevProps, nextProps) => true
const AnimatedIcon = Animatable.createAnimatableComponent(Icon);

const BookItem = React.memo((props) => {
  console.log("BookItem rendered");
  var bookmarked = null;
  if(props.item.chapterID !== undefined)
  {
    bookmarked = useSelector(state=>state.userReducer.isChapterBookmarked[props.item.chapterID]);
  }
  else
  {
    bookmarked = useSelector(state=>state.userReducer.isBookBookmarked[props.item.bookID]);
  }

  const [bookmarkedState,setBookmarkedState] = useState(bookmarked);
  const  userID = props.firebase._getUid();
  const privateUserID = "private" + userID;
  const dispatch = useDispatch();
  var smallAnimatedBookmarkIcon = useRef();


  function handleSmallAnimatedBookmarkIconRef  (ref) {
    smallAnimatedBookmarkIcon = ref
  }


  async function addToBookmarks() {

    const picturesArray = [];
    picturesArray.push(props.item.bookPictures[0]);

    if(props.item.chapterID !== undefined)
    {
      firestore().collection('users').doc(userID).collection('privateUserData').doc(privateUserID).collection('bookmarkContent').add({
        bookmarkedOn : moment().format(),
        bookName : props.item.bookName,
        chapterName : props.item.chapterName,
        bookID : props.item.bookID,
        chapterID : props.item.chapterID,
        bookPictures : picturesArray,
        bookDescription : props.item.bookDescription,
        authors : props.item.authors
      }).then(function(docRef){
        firestore().collection('users').doc(userID).collection('privateUserData').doc(privateUserID).collection('bookmarkContent').doc(docRef.id).set({
          bookmarkID : docRef.id
        },{merge:true})

        Toast.show("Saved to Collections");
      }).catch(function(error){
        console.log("Error in adding chapter bookmarks to user's book bookmarks collection: ",error);
      })

      firestore().collection('users').doc(userID).collection('privateUserData').doc(privateUserID).set({
         chaptersBookmarked : firestore.FieldValue.arrayUnion(props.item.chapterID)
      },{merge:true}).catch(function(error){
        console.log("Error in adding chapterID to chaptersBookmarked in user's private document: ",error);
      })

      dispatch({type:"ADD_TO_CHAPTERS_BOOKMARKED",payload:props.item.chapterID});
    }
    else
    {
      firestore().collection('users').doc(userID).collection('privateUserData').doc(privateUserID).collection('bookmarkContent').add({
        bookmarkedOn : moment().format(),
        bookName : props.item.bookName,
        bookID : props.item.bookID,
        bookPictures : picturesArray,
        bookDescription : props.item.bookDescription,
        authors : props.item.authors

      }).then(function(docRef){
        firestore().collection('users').doc(userID).collection('privateUserData').doc(privateUserID).collection('bookmarkContent').doc(docRef.id).set({
          bookmarkID : docRef.id
        },{merge:true})

        Toast.show("Saved to Collections");
      }).catch(function(error){
        console.log("Error in adding book bookmarks to user's book bookmarks collection: ",error);
      })

      firestore().collection('users').doc(userID).collection('privateUserData').doc(privateUserID).set({
         booksBookmarked : firestore.FieldValue.arrayUnion(props.item.bookID)
      },{merge:true}).catch(function(error){
        console.log("Error in adding bookID to booksBookmarked in user's private document: ",error);
      })
      dispatch({type:"ADD_TO_BOOKS_BOOKMARKED",payload:props.item.bookID});

    }
 }

 async function removeFromBookmarks() {

  if(props.item.chapterID !== undefined)
  {
    firestore().collection('users').doc(userID).collection('privateUserData').doc(privateUserID).collection('bookmarkContent')
     .where("chapterID",'==',props.item.chapterID).get().then(function(querySnapshot){
       querySnapshot.forEach(function(doc) {

            doc.ref.delete().then(function() {
              Toast.show("Removed from Collections");
            }).catch(function(error){
              console.log("Error in removing book bookmarks from user's bookmarks collection: ",error);
            });

       });
     });

   firestore().collection('users').doc(userID).collection('privateUserData').doc(privateUserID).set({
       chaptersBookmarked : firestore.FieldValue.arrayRemove(props.item.chapterID)
     },{merge:true}).catch(function(error){
       console.log("Error in removing chapterID from booksBookmarked in user's private document: ",error);
     })

   dispatch({type:"REMOVE_FROM_CHAPTERS_BOOKMARKED",payload:props.item.chapterID});
  }
  else
  {
    firestore().collection('users').doc(userID).collection('privateUserData').doc(privateUserID).collection('bookmarkContent')
     .where("bookID",'==',props.item.bookID).get().then(function(querySnapshot){
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
       booksBookmarked : firestore.FieldValue.arrayRemove(props.item.bookID)
     },{merge:true}).catch(function(error){
       console.log("Error in removing bookID from booksBookmarked in user's private document: ",error);
     })

   dispatch({type:"REMOVE_FROM_BOOKS_BOOKMARKED",payload:props.item.bookID});
  }
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



    return (
        <TouchableNativeFeedback activeOpacity={0.8} onPress={() => {
          if(props.item.chapterID !== undefined)
          {
            props.navigation.navigate('RecordChapter', { chapterID: props.item.chapterID, bookID : props.item.bookID });
          }
          else
          {
            props.navigation.navigate('RecordBook', { bookID : props.item.bookID });
          }
        }}>
          <View style={{flex:1,flexDirection:'row'}}>
          <View style={{flexDirection:'row'}}>
             <View style={{flexDirection:'column'}}>
             <View style={{flexDirection: 'row'}}>
              <View style={{flexDirection:'column'}}>

              <ImageBackground
            style={{height:height/4,width:width/3,borderRightWidth:1}}
            imageStyle={{ borderBottomLeftRadius:10,borderTopLeftRadius:10 }}
            source={{ uri: props.item.bookPictures['0'] }}
          >
                  <LinearGradient  colors={['transparent','transparent','transparent','transparent','transparent','transparent','transparent','transparent','black','black','black']} >
                  <View style={{height:height/4,width:width/3,borderBottomLeftRadius:10 }}>

       <Text style={{color:'white',position:'absolute',fontFamily:'Montserrat-Bold',bottom:2,left:3,right:4,fontSize:15}}>
       {"  "}{props.item.bookName.slice(0,35)}
        {
          (props.item.bookName.length > 35)  &&  ".."
        }

      </Text>
      </View>

            </LinearGradient>


          </ImageBackground>

               <View
                    style={{
                    height:1,
                    width:width/3 - 10,
                    marginTop:1,
                    marginLeft:10,
                    borderLeftWidth:width/3 - 10,
                    color: 'black',
                    }}
                    />
               </View>
                <View
                    style={{
                    height:height/4 - 2,
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
                width:width/3 - 9,
                marginTop:1.5,
                marginLeft:12,
                borderLeftWidth:width/3 - 9,
                color: 'black',
                }}
                />
            </View>
            <View
                style={{
                height:height/4 - 1,
                width:5,
                marginTop:4,
                borderLeftWidth: 1,
                color: 'black',
                }}
                />
            </View>
            </View>
        </TouchableNativeFeedback>
      )

}, areEqual)

export default withFirebaseHOC(BookItem);


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
  books: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 30,
  },
  destination: {
    width: width - (theme.sizes.padding * 2),
    height: height/3,
    marginHorizontal: theme.sizes.margin*1.5,
    paddingHorizontal: theme.sizes.padding,
    paddingVertical: theme.sizes.padding * 0.66,
    borderRadius: theme.sizes.radius,
  },
  destinationInfo: {
    position: 'absolute',
    borderRadius: theme.sizes.radius,
    paddingHorizontal: theme.sizes.padding,
    paddingVertical: theme.sizes.padding / 2,
    bottom: height/100,
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
    height: (width - (theme.sizes.padding * 2)) / 2,
  },
  avatar: {
    width: theme.sizes.padding,
    height: theme.sizes.padding,
    borderRadius: ((theme.sizes.padding) * 2) / 1,
  },
  rating: {
    fontSize: theme.sizes.font * 1.5,
    color: theme.colors.white,
    fontWeight: 'bold'
  },
  shadow: {
    shadowColor: theme.colors.dark_green,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
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
  }
});



