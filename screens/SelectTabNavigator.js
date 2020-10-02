
import React, { useState, useRef, useEffect, useCallback} from 'react';
import { TouchableOpacity,StyleSheet, Text, Image,View, SafeAreaView, Dimensions, NativeModules,NativeEventEmitter} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import AddFlipScreen from './components/Record/AddFlipScreen';
import AddBookReviewScreen from './components/Record/AddBookReviewScreen';
import VideoChatScreen from './VideoChatScreen';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TagSelect } from 'react-native-tag-select'
import { useDispatch, useSelector} from 'react-redux'
import { theme } from './components/categories/constants';
import { ScrollView } from 'react-native-gesture-handler';
import TrackPlayer, { usePlaybackState,useTrackPlayerProgress } from 'react-native-track-player';

const { width, height } = Dimensions.get('window');

const SelectTabNavigator = createMaterialTopTabNavigator(
  {
    AddFlipScreen : { screen: props => <AddFlipScreen {...props}/>,navigationOptions:{
      tabBarLabel:'Flip ',
      tabBarIcon:({tintColor})=>(
        <Entypo name="news" size={25} color={tintColor}/>
      )
    }}, 
    AddBookReviewScreen : { screen: props => <AddBookReviewScreen {...props}/>,navigationOptions:{
      tabBarLabel:' Podcast ',
      tabBarIcon:({tintColor})=>(
        <Icon name="microphone" size={30} color={tintColor}/>
      )
    }},
    VideoChatScreen : { screen: props => <VideoChatScreen {...props}/>,navigationOptions:{
      tabBarLabel:' Conversations ',
      tabBarIcon:({tintColor})=>(
        <MaterialCommunityIcon name="video-plus" color={tintColor} size={25}/>
      )
    }},
  },
  {
  tabBarPosition: 'bottom',
  lazy: true,
  tabBarOptions:  {
    showIcon: true,//props.navigation.state.params.fromExplore ? false : true,
    //showLabel: props.navigation.state.params.fromExplore ? false : false,
    activeTintColor:'white',
    inactiveTintColor:'grey',
    borderTopWidth: 0,
    elevation :0,
    adaptive: true, 
    style:
    {
      height: 60, 
      backgroundColor: 'black',         
    },
    indicatorStyle: {
      borderBottomColor: 'white',
      borderBottomWidth: 2,
    },
    labelStyle: {
      fontSize: 10,
    }
  }, 
  backBehavior : "none",
     navigationOptions:
     {
       tabBarVisible: true,//props => props.navigation.state.params.fromExplore ? false : false,
       headerVisible: true,
       //header: props => <CustomSearchHeader {...props} />, 
       
     }
    }
  
)
  
      
        // <View style={{paddingTop:height*5/12,flexDirection:'row', backgroundColor:'white',justifyContent:'space-evenly',alignItems:'center',}}>
        //   <TouchableOpacity 
        //   onPress={() => props.navigation.navigate('AddBookReviewScreen')}
        //   >
        //   <Icon name="microphone" size={50} color='black'/>
        //     </TouchableOpacity>
        //     <TouchableOpacity>
        //       <MaterialCommunityIcon name="postage-staamp" size={50} />
        //       </TouchableOpacity>
        // </View>
        


export default SelectTabNavigator;


const styles = StyleSheet.create({
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
  buttonStyle: {
    padding:10,
    backgroundColor: '#202646',
    borderRadius:5
    },
    textStyle: {
      fontSize:20,
    color: '#ffffff',
    textAlign: 'center'
    },
    item: {
      borderWidth: 1,
      borderColor: '#333',    
      backgroundColor: 'transparent'
    },
    label: {
      color: 'white',
      fontSize:12
    },
    itemSelected: {
      backgroundColor: '#333',
    },
    labelSelected: {
      color: '#FFF',
    },
    AppHeader:
  {
 flexDirection:'row',
 backgroundColor: '#101010'
  },
});
