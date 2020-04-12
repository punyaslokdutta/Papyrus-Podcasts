

import React, {Component} from 'react';
import { StyleSheet, Text, View, Image, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import FontAwesome, { Icons } from 'react-native-fontawesome';
import Octicons from 'react-native-vector-icons/Octicons';
import * as theme from '../constants/theme'
import { TouchableOpacity } from 'react-native-gesture-handler';
import RecordBook from '../../RecordBook';
import {useDispatch} from "react-redux"

var {width, height}=Dimensions.get('window')
const areEqual = (prevProps, nextProps) => true

  const ExploreBook = React.memo((props)=> {
  
    console.log("Inside ExploreBook")
    console.log(props);
    const dispatch=useDispatch();

      const item = props.item
      console.log(item)
        return (
          
           <View style={[styles.shadow,{height:height/7, width:(width*5)/12 + 10, marginLeft:20, borderwidth:4, borderColor:'#dddddd',overflow:'hidden', paddingRight:10,borderRadius:5}]}>
           <TouchableOpacity onPress={(()=>
            {
              dispatch({type:"SET_PODCAST", payload: props.item})
              dispatch({type:"ADD_NAVIGATION", payload:props.navigation})
              dispatch({type:"SET_NUM_LIKES", payload: props.item.numUsersLiked})
            })}>
           <Image style={[{width:(width*5)/12, height:height/7, resizeMode:'cover',borderRadius:5,overflow:'hidden', paddingRight:10}]} source={{ uri: ((item === null || item === undefined)  ? null : item.podcastPictures[0]) }} />

           </TouchableOpacity>
           </View>
          
          );
    },areEqual);
  

export default ExploreBook;

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
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 3,
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
