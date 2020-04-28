import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
import {useSelector, useDispatch} from "react-redux";
import React, {Component} from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Dimensions, Button, ScrollView,NativeModules} from 'react-native';
import {Container, Content, Header, Body} from 'native-base'
import { theme } from '../components/categories/constants';
import { Block, Text } from '../components/categories/components/';

import ActivityScreen from '../ActivityScreen';
import SettingsScreen from '../SettingsScreen';



var {width:SCREEN_WIDTH, height:SCREEN_HEIGHT}=Dimensions.get('window')
const IS_IPHONE_X = SCREEN_HEIGHT === 812 || SCREEN_HEIGHT=== 896;
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 44 : 20) : 0;
const HEADER_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 88 : 64) : 64;
const NAV_BAR_HEIGHT = HEADER_HEIGHT - STATUS_BAR_HEIGHT;


const CustomDrawerContentComponent = (props) =>
{
    const name = useSelector(state=>state.userReducer.name);
    const username = useSelector(state=>state.userReducer.userName);
    const photoURL = useSelector(state=>state.userReducer.displayPictureURL);
    const dispatch = useDispatch();

return(  
  <Container style={{backgroundColor:'#101010'}}>
   
    <Body style={{alignItems:'center', paddingTop: SCREEN_HEIGHT/8}}>
     <Image style={styles.drawerimage}
       source={{uri : photoURL}}
     />
     <Block flex={false} row center space="between" style={{paddingTop:30, paddingLeft:5}}>
<Text style={{color:'white', fontSize:SCREEN_HEIGHT/40 }}>{name}</Text>
          
    </Block>
    <Block flex={false} row center space="between" style={{ paddingLeft:5}}>
<Text style={{color:'white', fontFamily:'san-serif',textAlign:'center'}}>{username}</Text>
          
    </Block>


    <Content style={{ paddingTop: SCREEN_HEIGHT/18}}>
    
    <DrawerItems {...props} onItemPress = {
          ( route ) =>       
          {    
            switch(route.route.routeName)
            {
                case 'Home':
                  props.onItemPress(route);
                  break;
                case 'Drafts':
                  { dispatch({type:"TOGGLE_PLAY_PAUSED"})
    
                    NativeModules.ReactNativeRecorder.sampleMethodTwo()}
                  break;
                case 'Activity':
                  props.onItemPress(route);
                  break;
                case 'Settings':
                  props.onItemPress(route);
                  break;  
            }
          }
          } 
          activeBackgroundColor='#101010'   style={{backgroundColor: '#ffffff', }} labelStyle={{color: '#ffffff', fontSize: SCREEN_HEIGHT/35}}/>
          
          <Text style={{textAlign:'center', paddingTop:SCREEN_HEIGHT/4,color:'#dddd'}}>v1.0.7</Text>
    
    </Content>
    </Body>
  </Container>
 );
 }

export default CustomDrawerContentComponent;

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
  
  
  
  