import CategoryBook from '../components/categories/CategoryBook';
import CategoryPodcast from '../components/categories/CategoryPodcast';
import CategoryChapter from '../components/categories/CategoryChapter'; 
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import { StyleSheet, View, TouchableOpacity, Image, Dimensions, Button, ScrollView} from 'react-native';
import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { theme } from '../components/categories/constants';
import { Text } from '../components/categories/components';
import ExtraDimensions from 'react-native-extra-dimensions-android';
const STATUS_BAR_HEIGHT= ExtraDimensions.getStatusBarHeight();

const CustomCategoryHeader = props => {
    {console.log("Inside Custom Category header//////////////////////////////////// ")}
    // {console.log(props.navigation.state)}
    // {console.log(props.navigation.state.routes[1].params)}
       if(props === undefined || props.navigation === undefined || props.navigation.state === undefined || props.navigation.state.routes[1] === undefined || 
                             props.navigation.state.routes[1].params === undefined)
        {
           return (
               <Text> WOOOOOOOOOOOOOO </Text>
           );
        }
        else
        {
            return (
                <View style={{backgroundColor:'black',flexDirection:'row',marginTop:STATUS_BAR_HEIGHT}}>
                 {/* <TouchableOpacity onPress={() => props.navigation.navigate('CategoryScreen')}>
                <Image
                  resizeMode="contain"
                  source={'../../assets/icons/Back.png'}
                  style={{ width: 10, height: 50, marginTop: 2,paddingLeft: theme.sizes.base}}
                />
                </TouchableOpacity>  */}
                
              <Text h2 style={{color:'white',paddingVertical:10,paddingLeft:10,paddingRight:10}}>{props.navigation.state.routes[1].params.category}</Text>
                </View>
              );
        }
        
    
    
  };

const CategoryTabNavigator = createMaterialTopTabNavigator(
    {
      
       CategoryBook:{ screen: CategoryBook,navigationOptions:{
        tabBarLabel:'books',
        tabBarIcon:({tintColor})=>(
          <Icon name="book" color={tintColor} size={20}/>
        )
      }},
      CategoryPodcast: {screen:CategoryPodcast, navigationOptions:{
        tabBarLabel:'Podcasts',
        tabBarIcon:({tintColor})=>(
          <Icon name="newspaper-o" color={tintColor} size={20}/>
        )
      }}, 

      // CategoryChapter:{ screen: CategoryChapter,navigationOptions:{
      //   tabBarLabel:'Chapters',
      //   tabBarIcon:({tintColor})=>(
      //     <Icon name="book" color={tintColor} size={20}/>
      //   )
      // }} 
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
        backgroundColor: 'white',
        
      },
      indicatorStyle: {
        borderBottomColor: 'black',
        borderBottomWidth: 2,
      },
      labelStyle: {
        fontSize: 10,
      }
    }, 
    backBehavior : "none",
       navigationOptions:
       {
         tabBarVisible: true,
         headerVisible: true,
            header: props => <CustomCategoryHeader {...props}/>, 
         
       }
      }
    //   {console.log(props.navigation.state)}
    )

export default CategoryTabNavigator;