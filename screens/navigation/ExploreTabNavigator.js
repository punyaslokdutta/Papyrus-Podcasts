
import React, {Component,useState} from 'react';
import UserBookPodcast from '../components/Explore/UserBookPodcast';
import UserChapterPodcast from '../components/Explore/UserChapterPodcast';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import { StyleSheet, View, TouchableOpacity, Image, Dimensions, Button, ScrollView} from 'react-native';
import { Block, Text } from '../components/categories/components'
import { theme } from '../components/categories/constants';
import UserStatsScreen from '../components/Explore/UserStatsScreen'
import { withFirebaseHOC } from '../config/Firebase';
import CustomUserHeader from './CustomUserHeader';


var {width:SCREEN_WIDTH, height:SCREEN_HEIGHT}=Dimensions.get('window')
const IS_IPHONE_X = SCREEN_HEIGHT === 812 || SCREEN_HEIGHT=== 896;
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 44 : 20) : 0;
const HEADER_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 88 : 64) : 64;
const NAV_BAR_HEIGHT = HEADER_HEIGHT - STATUS_BAR_HEIGHT;
  
  const ExploreTabNavigator = createMaterialTopTabNavigator(
    {
      UserBookPodcast : { screen: props => <UserBookPodcast {...props}/>,navigationOptions:{
        tabBarLabel:'books',
        tabBarIcon:({tintColor})=>(
          <Icon name="book" color={tintColor} size={20}/>
        )
      }},
      UserChapterPodcast : { screen: props => <UserChapterPodcast {...props}/>,navigationOptions:{
        tabBarLabel:'Chapters',
        tabBarIcon:({tintColor})=>(
          <Icon name="newspaper-o" color={tintColor} size={20}/>
        )
      }}
    },
    {tabBarOptions:{
    
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
         initialRouteName:'UserChapterPodcast',
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