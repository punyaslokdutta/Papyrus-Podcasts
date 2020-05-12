import React, { useState, useContext, useReducer, useEffect} from 'react';
import Slider from '@react-native-community/slider';

import {
  View, StyleSheet, Text, Dimensions, TouchableWithoutFeedback,TouchableOpacity
} from 'react-native';
//import { Icon } from 'expo';
import Icon from 'react-native-vector-icons/FontAwesome'
import {useDispatch, useSelector} from "react-redux"
import TextTicker from 'react-native-text-ticker'

const { width,height } = Dimensions.get('window');

const areEqual = (prevProps, nextProps) => {
    console.log("prevProps: ",prevProps);
    console.log("nextProps: ",nextProps);
    return ((prevProps.podcastName === nextProps.podcastName) && (prevProps.bookName === nextProps.bookName))
};

const TextMarquee = React.memo((props)=> {


    return (
        <View style={{paddingLeft: 0}}>
          <TextTicker
          style={{ fontSize: 15,fontWeight:'bold',paddingLeft:width/20,paddingRight:width/2,color:'white' }}
          duration={20000}
          loop
          bounce
          repeatSpacer={0}
          marqueeDelay={500}
          useNativeDriver={true} 
        >  
          {props.podcastName}{" "} <Text style={{color:'#A9A9A9'}}>~ {props.bookName}{" "}</Text>  
        </TextTicker>  
        </View> 
    )
    },areEqual)

export default TextMarquee;

