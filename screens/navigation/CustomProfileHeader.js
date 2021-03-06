import React, {Component} from 'react';
import { StyleSheet,StatusBar, View,Text, TouchableOpacity,TouchableNativeFeedback, Image, Dimensions, Button, ScrollView} from 'react-native';
import { Block } from '../components/categories/components'
import { theme } from '../components/categories/constants';
import {useSelector} from 'react-redux'
import ExtraDimensions from 'react-native-extra-dimensions-android';
const STATUS_BAR_HEIGHT= ExtraDimensions.getStatusBarHeight();

var {width:SCREEN_WIDTH, height:SCREEN_HEIGHT}=Dimensions.get('window')
const IS_IPHONE_X = SCREEN_HEIGHT === 812 || SCREEN_HEIGHT=== 896;
//const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 44 : 20) : 0;
const HEADER_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 88 : 64) : 64;
const NAV_BAR_HEIGHT = HEADER_HEIGHT - STATUS_BAR_HEIGHT;


const CustomProfileHeader = props => {
    console.log("[CustomProfileHeader] rendering CustomProfileHeader");

    const name = useSelector(state=>state.userReducer.name);
    var lastCharacter = null;
    if(name != null)
      lastCharacter = name[name.length-1];
    const profilePicURL = useSelector(state=>state.userReducer.displayPictureURL)
    return (
      <View style={{marginTop:STATUS_BAR_HEIGHT}}>
      <StatusBar
               barStyle="dark-content"
               //backgroundColor='transparent'
               translucent
               //hidden={true}
               />
      <TouchableNativeFeedback style={{alignItems:'center',marginTop:STATUS_BAR_HEIGHT}} onPress={() => {
        console.log("TouchableOpacity clicked");
        props.navigation.navigate('Profile_StatsScreen')
      }}>
        <View style={{alignItems:'center',justifyContent:'center',paddingTop: 30,paddingBottom:15, flexDirection:'column'}}>
          <View style={{alignItems:'center',flexDirection:'column'}}>
            {
              lastCharacter == 's'
              ?
              <Text style={{fontSize:theme.sizes.h3,fontFamily:'Montserrat-Regular'}}>{name}'</Text>
              :
              <Text style={{fontSize:theme.sizes.h3,fontFamily:'Montserrat-Regular'}}>{name}'s</Text>
            }
            <View style = {{alignItems:'center'}}>
          <Text style={{fontFamily:'Montserrat-Bold',fontSize:theme.sizes.h2,paddingRight:5}}>Collections{"  "}</Text>
            </View>
            </View>
            
            <Image
                source={{uri : profilePicURL}}
                style={styles.avatar}
              />
              
            </View>
            </TouchableNativeFeedback>
            </View>
    );
  };

  export default CustomProfileHeader;

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
  