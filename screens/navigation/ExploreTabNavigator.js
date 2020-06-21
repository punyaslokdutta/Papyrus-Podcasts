
import React, {Component,useState} from 'react';
import UserPodcasts from '../components/Explore/UserPodcasts';
import UserBookmarks from '../components/Explore/UserBookmarks';
import UserReposts from '../components/Explore/UserReposts';

import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import { StyleSheet, View, TouchableOpacity, Image, Dimensions, Button, ScrollView} from 'react-native';
import { theme } from '../components/categories/constants';
import CustomUserHeader from './CustomUserHeader';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import ProfileTabBar from './CustomProfileTabBar';


var {width:SCREEN_WIDTH, height:SCREEN_HEIGHT}=Dimensions.get('window')
const IS_IPHONE_X = SCREEN_HEIGHT === 812 || SCREEN_HEIGHT=== 896;
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 44 : 20) : 0;
const HEADER_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 88 : 64) : 64;
const NAV_BAR_HEIGHT = HEADER_HEIGHT - STATUS_BAR_HEIGHT;
  
  const ExploreTabNavigator = createMaterialTopTabNavigator(
    {
      UserBookmarks: {screen:UserBookmarks, navigationOptions:{
        tabBarLabel:'Saved',
        tabBarIcon:({tintColor})=>(
          <Icon name="bookmark" color={tintColor} size={20}/>
        )
      }},
      UserReposts: {screen:UserReposts, navigationOptions:{
        tabBarLabel:'Reposts',
        tabBarIcon:({tintColor})=>(
          <EvilIcon name="retweet" color={tintColor} size={30}/>
        )
      }},
      UserPodcasts : { screen: props => <UserPodcasts {...props}/>,navigationOptions:{
        tabBarLabel:'Podcasts',
        tabBarIcon:({tintColor})=>(
          <FontAwesome5Icon name="microphone-alt" color={tintColor} size={25}/>
        )
      }},

    },
    {
      tabBarComponent: props => <ProfileTabBar {...props}/>,

      tabBarOptions:{
    
      showIcon: true,
      showLabel: true,
      activeTintColor:'black',
      inactiveTintColor:'grey',
      borderTopWidth: 0,
      elevation :5,
      adaptive: true, 
      style:
      {
        height: 60, 
        backgroundColor: 'white'
      },
      indicatorStyle: {
        borderBottomColor: 'black',
        borderBottomWidth: 2,
      },
      labelStyle: {
        fontSize: 10,
      }
    }, 
       navigationOptions:
       {
         tabBarVisible: true,
         headerVisible: true,
         initialRouteName:'UserBookmarks',
        header: props => <CustomUserHeader {...props} />, 
         
       }
      }
  )
  
  export default ExploreTabNavigator;

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
      drawerimage:
      {
        height: 100, 
        width:100, 
        borderRadius:50, 
  
      }, 
      contentContainer: {
        flexGrow: 1,
      },
      navContainer: {
        height: HEADER_HEIGHT,
        marginHorizontal: 10,
      },
      statusBar: {
        height: STATUS_BAR_HEIGHT,
        backgroundColor: 'transparent',
      },
      navBar: {
        height: NAV_BAR_HEIGHT,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: 'transparent',
      },
      titleStyle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
      },
      header: {
        paddingHorizontal: theme.sizes.base * 2,
        paddingTop: theme.sizes.base * 2.5,
        paddingBottom :theme.sizes.base * 0.5,
      }, 
       avatar: {
      height: theme.sizes.base * 2.2,
      width: theme.sizes.base * 2.2,
      borderRadius: theme.sizes.base * 2.2, 
      
    }
  });