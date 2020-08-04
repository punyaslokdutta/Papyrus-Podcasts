
import React, {Component, useState, useEffect, useContext, useRef} from 'react';
import { StyleSheet, Text, View, Image, Dimensions,TouchableNativeFeedback, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import * as Animatable from 'react-native-animatable'
import * as theme from '../constants/theme';
import {useDispatch,useSelector} from "react-redux"
import moment from 'moment';
import { Divider } from '../categories/components';
import {withFirebaseHOC} from '../../config/Firebase';
import firestore from '@react-native-firebase/firestore';
import Toast from 'react-native-simple-toast'

var {width, height}=Dimensions.get('window')
const AnimatedIcon = Animatable.createAnimatableComponent(Icon)

 /* useContext doesn't let you subscribe to a part of the context value (or some memoized selector) without fully re-rendering.*/
 //const areEqual = (prevProps, nextProps) => true;
 const areEqual = (prevProps, nextProps) => true
 const SaveBookItem = React.memo((props)=> {
  console.log("Inside SaveBookItem")

  const  userID = props.firebase._getUid();
  const privateUserID = "private" + userID;
  const bookmarked = useSelector(state=>state.userReducer.isBookBookmarked[props.book.bookID]);
  var smallAnimatedBookmarkIcon = useRef();
  const [bookmarkedState,setBookmarkedState] = useState(bookmarked);

  const dispatch = useDispatch();


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


  
  function handleSmallAnimatedBookmarkIconRef  (ref) {
    smallAnimatedBookmarkIcon = ref
  }

  async function removeFromBookmarks() {

    firestore().collection('users').doc(userID).collection('privateUserData').doc(privateUserID).collection('bookmarkContent')
       .where("bookID",'==',props.book.bookID).get().then(function(querySnapshot){
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
         booksBookmarked : firestore.FieldValue.arrayRemove(props.book.bookID)
       },{merge:true}).catch(function(error){
         console.log("Error in removing bookID from booksBookmarked in user's private document: ",error);
       })
   
     dispatch({type:"REMOVE_FROM_BOOKS_BOOKMARKED",payload:props.book.bookID});
   
   }

  async function addToBookmarks() {
    const picturesArray = [];
    picturesArray.push(props.book.bookPictures[0]);
 
   firestore().collection('users').doc(userID).collection('privateUserData').doc(privateUserID).collection('bookmarkContent').add({
     bookmarkedOn : moment().format(),
     bookName : props.book.bookName,
     bookID : props.book.bookID,
     bookPictures : picturesArray,
     bookDescription : props.book.bookDescription,
     authors: props.book.authors
   }).then(function(docRef){
     firestore().collection('users').doc(userID).collection('privateUserData').doc(privateUserID).collection('bookmarkContent').doc(docRef.id).set({
       bookmarkID : docRef.id
     },{merge:true})
     
     Toast.show("Saved to Collections");
   }).catch(function(error){
     console.log("Error in adding book bookmarks to user's book bookmarks collection: ",error);
   })
   
    firestore().collection('users').doc(userID).collection('privateUserData').doc(privateUserID).set({
        booksBookmarked : firestore.FieldValue.arrayUnion(props.book.bookID)
    },{merge:true}).catch(function(error){
      console.log("Error in adding bookID to booksBookmarked in user's private document: ",error);
    })
 
   dispatch({type:"ADD_TO_BOOKS_BOOKMARKED",payload:props.book.bookID});
 
 }

    return (
        <TouchableOpacity  activeOpacity={0.5} onPress={()=> {
            props.navigation.navigate('RecordBook',{ bookID : props.book.bookID });
        }}>
        <View style={[
        styles.flex, styles.column, styles.recommendation, styles.shadow, 
        {marginLeft: theme.sizes.margin },
        ]} key ={props.index}>
        <View style={[styles.flex, styles.recommendationHeader]}>
        
        <Image style={[styles.recommendationImage]} source={ {uri: props.book.bookPictures["0"]}} />

        
        
    </View>
    
    <View style={[styles.flex, styles.column, styles.shadow, { paddingLeft: theme.sizes.padding / 8,paddingRight: theme.sizes.padding / 8}]}>
            
            <View style={{height:height/20}}> 
            <Text style={{ fontSize: theme.sizes.font * 1.0, fontFamily:'Montserrat-Bold',height:height/20 }}>{props.book.bookName.slice(0,50)}
            {(props.book.bookName.length > 50) ? ".." : ""}</Text> 
            </View>
            

            <View style ={{height:(height)/45}}>
            <View>
            <Text style={{ fontFamily:'Montserrat-Bold',fontSize: theme.sizes.font * 0.8,color: theme.colors.gray_green,height:height/45 }}> {props.book.authors[0]}</Text>
            {
                props.book.authors.length >=2 && 
                <Text style={{ fontFamily:'Montserrat-Bold',fontSize: theme.sizes.font * 0.8,color: theme.colors.gray_green,height:height/45 }}>{props.book.authors[1]}</Text>
            }
            {
                props.book.authors.length >=3 && 
                <Text style={{ fontFamily:'Montserrat-Bold',fontSize: theme.sizes.font * 0.8,color: theme.colors.gray_green,height:height/45 }}> {props.book.authors[2]}</Text>
            }
            </View>
            <View>
        <Text style={{ fontFamily:'Montserrat-Regular',fontSize: theme.sizes.font * 0.8,color: theme.colors.gray_green,height:height/45 }}> Published in {props.book.publicationYear}</Text>
            </View>
            
            </View>
        
            
          
            </View>
            <View style={{alignItems:'flex-end'}}>
            <Text>{"\n\n"}</Text>
            <TouchableNativeFeedback style={{borderWidth:1,borderColor:'black',paddingLeft:20,marginTop:5}} onPress={() => handleOnPressBookmark()}>
            <AnimatedIcon
                    ref={handleSmallAnimatedBookmarkIconRef}
                    name={bookmarked ? 'bookmark' : 'bookmark-o'}
                    color={bookmarked ? 'black' : 'black'}
                    size={20}
                    style={{height:30,width:30}}
                  />
            </TouchableNativeFeedback>
            </View>
            
        </View>
       
        </TouchableOpacity>
        
        );
    

}, areEqual);

export default withFirebaseHOC(SaveBookItem);

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
