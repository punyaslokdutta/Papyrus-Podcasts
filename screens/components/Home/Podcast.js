

import React, {Component, useState, useEffect, useContext} from 'react';
import { StyleSheet, Text, View, Image, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import FontAwesome, { Icons } from 'react-native-fontawesome';
import Octicons from 'react-native-vector-icons/Octicons';
import * as theme from '../constants/theme'
import { TouchableOpacity } from 'react-native-gesture-handler';
import PodcastPlayer from '../../PodcastPlayer'
//import {usePlayerContext} from '../PodcastPlayer/usePlayerContext'
import PlayerContext from '../PodcastPlayer/PlayerContext'


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
      height: (height)/3,
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



/*const defaultState = {
  podcast: null, 
  eventSource:"Podcast"
};*/

 //const eventSource="Podcast"
 const areEqual = (prevProps, nextProps) => true;
 const Podcast= React.memo((props)=> {
  //const [ playerGlobalState,  playerGlobalDispatch] = usePlayerContext();

  //const {eventSource }= playerGlobalState;
  //const [podcastState, setPodcastState] =useState(props)
  console.log(props);

   const context = useContext(PlayerContext)
   //const {setPodcast} =playerGlobalDispatch;


  /*useEffect(() => {
    //setPodcastState(props);
  }, []);*/

    /*constructor(props)
    {
        super(props)
        {
          this.state={
           key: this.props.index,

           navigation: this.props.navigation,
           eventSource: eventSourcePodcast
         };
        }
    }*/

    /*function setGlobalPodcast(podcast, eventSource)
    {

     setPodcast(podcast, eventSource);
    }*/
        return (   
          <View style={[
            styles.flex, styles.column, styles.recommendation, styles.shadow, 
            {marginLeft: theme.sizes.margin },
           
          ]} key ={props.index}>
            
           <View style={[styles.flex, styles.recommendationHeader]}>
           <TouchableOpacity  onPress={()=>{context.setPodcast(props.podcast)}}>
           <Image style={[styles.recommendationImage]} source={{ uri: props.podcast.Podcast_Pictures["0"]}} />

           </TouchableOpacity>
          <View style={[ styles.flex, styles.row, styles.recommendationOptions ]}>
            <Icon
              name={props.podcast.saved ? 'bookmark' : 'bookmark-o'}
              color={theme.colors.white}
              size={theme.sizes.font * 1.25}
            />
          </View>
        </View>
            <View style={[styles.flex, styles.column, styles.shadow, { justifyContent: 'space-evenly', padding: theme.sizes.padding / 2 }]}>
              <Text style={{ fontSize: theme.sizes.font * 1.25, fontWeight: '500', paddingBottom: theme.sizes.padding / 4.5, }}>{props.podcast.Podcast_Name}</Text>
              <Text style={{ color: theme.colors.caption }}>{props.podcast.Language}</Text>
              <View style={[
                styles.row,
                { alignItems: 'center', justifyContent: 'space-between', marginTop: theme.sizes.margin }
              ]}>
                
                <Text style={{ color: theme.colors.black }}>
                  {props.podcast.Timestamp}
                </Text>
              </View>
            </View>
          </View>
          
          );
    
  }, areEqual);

export default Podcast;
