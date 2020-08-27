import React, {Component, useState, useEffect, useRef,useContext} from 'react';
import { StyleSheet, Text, View, Image, Dimensions,} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import * as theme from '../constants/theme'
import { TouchableOpacity, TouchableHighlight,TouchableNativeFeedback } from 'react-native-gesture-handler';
import RecordBook from '../../RecordBook' 
import firestore from '@react-native-firebase/firestore';
import {useSelector,useDispatch} from 'react-redux';
import moment from "moment";


var {width, height}=Dimensions.get('window')
 /* useContext doesn't let you subscribe to a part of the context value (or some memoized selector) without fully re-rendering.*/
 //const areEqual = (prevProps, nextProps) => true;
 const areEqual = (prevProps, nextProps) => true

 const BookmarkBookItem = (props)=> {
  
  console.log("PROPS = ",props);

  console.log("Inside BookmarkBookItem");
   console.log("Book Authors : ",props.book.authors);
  console.log("Book Name : ",props.book.bookName)
        return (
          <TouchableNativeFeedback onPress={() => {
              props.navigation.navigate('RecordBook', { bookID : props.book.bookID })
          }}>
              <View style={{flexDirection:'column',padding:width/64}}>
              <View style={{flexDirection:'row',alignItems:'flex-end',justifyContent:'flex-end'}}>
                <Icon name="bookmark" size={15}/>
        <Text style={{ color:'black', paddingLeft:7,fontFamily:'Montserrat-Bold', fontSize:theme.sizes.font * 1.0 }}>
            {moment(props.book.bookmarkedOn).fromNow()}
            </Text>
              </View>
             <View style={{flex:1,flexDirection:"row",width:width,height:height*9/40}}>
             
             <View style={{flexDirection:'row'}}>
             <View style={{flexDirection:'column'}}>
             <View style={{flexDirection: 'row'}}>
              <View style={{flexDirection:'column'}}>
              <Image style={{width:width/4,height:height/5,borderTopLeftRadius:10
                ,borderBottomLeftRadius:10,marginRight:1}} source={ {uri: props.book.bookPictures[0]}} />
               <View
                    style={{
                    height:1,
                    width:width/4 - 10,
                    marginTop:1,
                    marginLeft:10,
                    borderLeftWidth:width/4 - 10,
                    color: 'black',
                    }}
                    />
               </View>
                <View
                    style={{
                    height:height/5 - 2,
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
                width:width/4 - 9,
                marginTop:1.5,
                marginLeft:12,
                borderLeftWidth:width/4 - 9,
                color: 'black',
                }}
                />
            </View>
            <View
                style={{
                height:height/5 - 1,
                width:5,
                marginTop:4,
                borderLeftWidth: 1,
                color: 'black',
                }}
                />
            </View>
               <View style={[styles.flex, styles.column, styles.shadow, { width:(width*2)/3,paddingLeft:theme.sizes.padding/8, paddingTop: theme.sizes.padding / 4 }]}>
                 <View style={{height:(height)/20}}>
                   
                  <Text style={{ fontSize: theme.sizes.font * 1.0,fontFamily:'Montserrat-Bold' }}>{props.book.bookName.slice(0,50)}
                       {(props.book.bookName.length > 50) ? ".." : ""}</Text> 
                 </View>
               <View style ={{height:(height)/20}}>
               {
                    
                    props.book.authors &&
                    props.book.authors.map((item,index) => (
                      (index<=1) &&
                      <Text style={{ fontSize: theme.sizes.font * 0.8,color: theme.colors.gray_green,fontFamily:'Montserrat-Bold' }}>{item}</Text>
                      
                    ))    
               }

               </View>
               <View>
            <Text style={{ height:height/10,fontFamily:'Montserrat-Regular',fontSize: theme.sizes.font * 0.8,color: 'gray' }}>
                {props.book.bookDescription.slice(0,200)}
                {props.book.bookDescription.length > 200 && "..."}
            </Text>
               </View>
              <View style={[
              styles.row,
              { alignItems: 'center', justifyContent: 'space-between'}
              ]}>
                
              </View>
            </View>
        
          </View>
          </View>
      </TouchableNativeFeedback>
        );
      
  };

export default BookmarkBookItem;


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
  shadow: {
    shadowColor: theme.colors.black,
    shadowOffset: {
      width: 4,
      height: 6,
    },
    shadowOpacity: 2,
    shadowRadius: 10,
    elevation: 10,
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