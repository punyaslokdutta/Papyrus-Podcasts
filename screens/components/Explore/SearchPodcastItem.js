import React, {Component, useState, useEffect, useContext} from 'react';
import { StyleSheet, Text, View, Image, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import * as theme from '../constants/theme'
import { TouchableOpacity } from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import { useDispatch } from 'react-redux';

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

 const areEqual = (prevProps, nextProps) => true
 const SearchPodcastItem = React.memo((props)=> {
  console.log("Inside SearchPodcastItem");
  console.log("props.podcast : ",props.podcast);
  const dispatch = useDispatch();
  
  var createdOn = moment(props.podcast.createdOn).fromNow();

  if(createdOn === null)
    createdOn = props.podcast.createdOn.slice(0,10);

  async function retrievePodcastDocument()
  {
    try{
    const podcastCollection = await firestore().collectionGroup('podcasts')
                             .where('podcastID','==',props.podcast.objectID).get();
    const podcastDocumentData = podcastCollection.docs[0]._data;
    console.log("[SearchPodcastItem] podcastDocumentData : ", podcastDocumentData);
    dispatch({type:"SET_CURRENT_TIME", payload:0})
    dispatch({type:"SET_DURATION", payload:podcastDocumentData.duration})
    dispatch({type:"SET_PAUSED", payload:false})
    dispatch({type:"ADD_NAVIGATION", payload:props.navigation})
    dispatch({type:"SET_PODCAST", payload: podcastDocumentData})
    dispatch({type:"SET_NUM_LIKES", payload: podcastDocumentData.numUsersLiked})
    }
    catch(error){
      console.log("Error in retrievePodcastDocument() in SearchPodcastItem: ",error);
    }
  }
        return (
          <TouchableOpacity onPress={() => {
            retrievePodcastDocument();
          }}>
             <View style={{flex:1,flexDirection:"row",paddingBottom:theme.sizes.padding/4,paddingLeft:width/64,width:width,height:height/6}}>
             
             <View style={{flexDirection: 'row', justifyContent: 'flex-end',paddingTop:height/48,paddingLeft:width/24}}>
              <Image style={{width:width/4,height:height/8}} source={ {uri: props.podcast.podcastPicture}} />
            </View>

               <View style={[styles.flex, styles.column, styles.shadow, { width:(width*2)/3,paddingLeft:theme.sizes.padding, paddingTop: theme.sizes.padding / 4 }]}>
                 <View style={{height:(height)/12,paddingBottom:20}}>
                  <Text style={{ fontSize: theme.sizes.font * 1.0, fontWeight: '500' }}>{props.podcast.podcastName.slice(0,50)}
                       {(props.podcast.podcastName.length > 50) ? ".." : ""}</Text> 
                {
                  (props.podcast.chapterName !== null && props.podcast.chapterName !== undefined) &&
                  <Text style={{  fontSize: theme.sizes.font * 0.8,color: theme.colors.gray_green }}>
                  {props.podcast.chapterName}
                </Text>
                }
              <Text style={{  fontSize: theme.sizes.font * 0.8,color: theme.colors.gray_green }}>
                  {props.podcast.bookName}
                </Text>
                </View>
               <View style={{paddingTop:5}}>
                  <Text style={{ fontSize:theme.sizes.font * 0.8,color: theme.colors.gray_green }}>{props.podcast.podcasterName}</Text>
               </View>
          
              <View style={[
              styles.row,
              { alignItems: 'center', justifyContent: 'space-between'}
              ]}>
                
                <Text style={{  fontSize: theme.sizes.font * 0.8,color: theme.colors.gray_green }}>
                {createdOn}
                </Text>
                
              </View>
              
            </View>
        
          </View>
      </TouchableOpacity>
        );
      
  }, areEqual);

export default SearchPodcastItem;