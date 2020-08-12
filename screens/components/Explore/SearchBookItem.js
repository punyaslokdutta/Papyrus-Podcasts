import React, {Component, useState, useEffect, useRef,useContext} from 'react';
import { StyleSheet, Text, View, Image, Dimensions,TouchableNativeFeedback} from 'react-native';
import * as theme from '../constants/theme'

var {width, height}=Dimensions.get('window')
 /* useContext doesn't let you subscribe to a part of the context value (or some memoized selector) without fully re-rendering.*/
 //const areEqual = (prevProps, nextProps) => true;
 const areEqual = (prevProps, nextProps) => true

 const SearchBookItem = React.memo((props)=> {
  
  console.log("PROPS = ",props);  
  console.log("Inside SearchBookItem");
   console.log("Book Authors : ",props.book.authors);
  console.log("Book Name : ",props.book.bookName)
        return (
          <TouchableNativeFeedback onPress={() => {
              props.navigation.navigate('RecordBook', {bookID : props.book.objectID })
          }
          }>

             <View style={{flex:1,flexDirection:"row",paddingLeft:width/64,width:width,height:height/6}}>
             
             <View style={{flexDirection: 'row', justifyContent: 'flex-end',paddingTop:height/48,paddingLeft:width/24}}>
              <Image style={{width:width/4,height:height/8}} source={ {uri: props.book.bookCover}} />
            </View>

               <View style={[styles.flex, styles.column, styles.shadow, { width:(width*2)/3,paddingLeft:theme.sizes.padding, paddingTop: theme.sizes.padding / 4 }]}>
                 <View style={{height:(height)/16}}>
                   
                  <Text style={{ fontSize: theme.sizes.font * 1.0, fontFamily:'Montserrat-SemiBold' }}>{props.book.bookName.toString().slice(0,50)}
                       {(props.book.bookName.toString().length > 50) ? ".." : ""}</Text> 
                 </View>
               <View style ={{height:(height)/20}}>
               {
                    
                    props.book.authors.map((item,index) => (
                      (index<=1) &&
                      <Text style={{ fontSize: theme.sizes.font * 0.8,color: theme.colors.gray_green,fontFamily:'Montserrat-Regular' }}>{item}</Text>
                      
                    ))    
               }

               </View>
          
              <View style={[
              styles.row,
              { alignItems: 'center', justifyContent: 'space-between'}
              ]}>
                
                <Text style={{  fontSize: theme.sizes.font * 0.8,color: theme.colors.gray_green,fontFamily:'Montserrat-Regular' }}>
                  Published in {props.book.publicationYear}
                </Text>
                {/* <View style={{alignItems: 'flex-end',paddingRight:5}}>
                  <Icon
                    name={props.book.saved ? 'bookmark' : 'bookmark-o'}
                    color={theme.colors.black}
                    size={theme.sizes.font * 1.25}
                  />
                </View> */}
              </View>
              <View>
              <Text style={{  fontSize: theme.sizes.font * 0.8,color: theme.colors.gray_green }}>
                  {props.book.bookRating}
                </Text>
                </View>
            </View>
        
          </View>
      </TouchableNativeFeedback>
        );
      
  }, areEqual);

export default SearchBookItem;


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