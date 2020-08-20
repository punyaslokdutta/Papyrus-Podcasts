import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
import {useSelector, useDispatch} from "react-redux";
import ToggleSwitch from 'toggle-switch-react-native';
import React, {Component, useState, useEffect} from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Dimensions, Button, ScrollView,NativeModules} from 'react-native';
import {Container, Content, Header, Body} from 'native-base';
import Toast from 'react-native-simple-toast';
import { theme } from '../components/categories/constants';
import { Block, Text } from '../components/categories/components/';
import Icon from 'react-native-vector-icons/FontAwesome'
import { Badge } from 'react-native-elements'
import FontistoIcon from 'react-native-vector-icons/Fontisto';
import ActivityScreen from '../ActivityScreen';
import SettingsScreen from '../SettingsScreen';
import firestore from '@react-native-firebase/firestore';
import {withFirebaseHOC} from '../config/Firebase';
import Tooltip from 'react-native-walkthrough-tooltip';


var {width:SCREEN_WIDTH, height:SCREEN_HEIGHT}=Dimensions.get('window')
const IS_IPHONE_X = SCREEN_HEIGHT === 812 || SCREEN_HEIGHT=== 896;
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 44 : 20) : 0;
const HEADER_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 88 : 64) : 64;
const NAV_BAR_HEIGHT = HEADER_HEIGHT - STATUS_BAR_HEIGHT;


const CustomDrawerContentComponent = (props) =>
{
    const showMusicPlayerTooltip = useSelector(state=>state.userReducer.showMusicPlayerTooltip);
    const name = useSelector(state=>state.userReducer.name);
    const userID = props.firebase._getUid();
    const privateDataID = "private" + userID;
    const musicRedux=useSelector(state=>state.musicReducer.music)
    const username = useSelector(state=>state.userReducer.userName);
    const photoURL = useSelector(state=>state.userReducer.displayPictureURL);
    const numNotifications = useSelector(state=>state.userReducer.numNotifications);
    const isMusicEnabled = useSelector(state=>state.userReducer.isMusicEnabled);
    const musicPreferencesArray = useSelector(state=>state.userReducer.musicPreferencesArray);
    const isPodcastPlaying = useSelector(state=>state.rootReducer.isPodcastPlaying);

    const [toolTipVisible,setToolTipVisible] = useState(false);
    const dispatch = useDispatch();

  useEffect(() => {
    //setToolTipVisible(false);
  },[])
  
  useEffect(() => {
    showMusicPlayerTooltip == true && setToolTipVisible(true);
  },[showMusicPlayerTooltip])
  
    async function modifyMusicPreferenceInDatabase(isOn) {
      firestore().collection('users').doc(userID).collection('privateUserData').doc(privateDataID).set({
        musicPlayerEnabled : isOn 
      },{merge:true}).then(() => {
        console.log("Successfully set the musicPlayer preference in database");
      }).catch((error) => {
      console.log("Error in setting musicPlayer preference in database");
      })
    }

return(  
  <Container style={{backgroundColor:'#101010'}}>
   
    <Body style={{alignItems:'center', paddingTop: SCREEN_HEIGHT/8}}>
      <TouchableOpacity onPress={() => props.navigation.navigate('Profile_StatsScreen')}>
     <Image style={styles.drawerimage}
       source={{uri : photoURL}}
     />
     </TouchableOpacity>
     <TouchableOpacity 
     style={{paddingTop:8}}
      onPress={() => props.navigation.navigate('Profile_StatsScreen')}>
<Text style={{color:'white', textAlign:'center',fontSize:SCREEN_HEIGHT/40,fontFamily:'Montserrat-Bold' }}>{name}</Text>
    </TouchableOpacity>
    {/* <Block flex={false} row center space="between" style={{ paddingLeft:5}}>
<Text style={{color:'white', fontFamily:'san-serif',textAlign:'center'}}>{username}</Text>
          
    </Block> */}
    


    <Content style={{ paddingTop: SCREEN_HEIGHT/18}}>
    
    <DrawerItems {...props} 
       getLabel = {(scene) => {
        
           switch(scene.route.routeName)
           {
             case "Home":
                return (
                  <View style={{flexDirection:'row',paddingBottom:SCREEN_HEIGHT/35}}>
                  <Icon name="home" size={25} style={{ color: 'white',paddingTop:SCREEN_HEIGHT/150,paddingLeft:SCREEN_WIDTH/20,paddingRight:SCREEN_WIDTH/20 }} />
                  <Text style={{color:'white',fontSize:22,fontFamily:'Montserrat-Bold'}}>{props.getLabel(scene)}{"    "}</Text>
                  </View>
                  )
              case "Drafts":
                return (
                  <View style={{flexDirection:'row',paddingBottom:SCREEN_HEIGHT/35}}>
                  <Icon name="hdd-o" size={25} style={{ color: 'white',paddingTop:SCREEN_HEIGHT/150,paddingLeft:SCREEN_WIDTH/20,paddingRight:SCREEN_WIDTH/20 }} />
                  <Text style={{color:'white',fontSize:22,fontFamily:'Montserrat-Bold'}}>{props.getLabel(scene)}{"    "}</Text>
                  </View>
                )
              case "Activity":
                return (
                  <View style={{flexDirection:'row',paddingBottom:SCREEN_HEIGHT/35}}>
                   <View style={{flowDirection:'row'}}>
                  <Icon name="bell" size={25} style={{ color: 'white',paddingTop:SCREEN_HEIGHT/150,paddingLeft:SCREEN_WIDTH/20,paddingRight:SCREEN_WIDTH/20 }} />
                  {
                    numNotifications!=0 &&  
                    <Badge
                    width={5}
                    textStyle={{fontSize:8}}
                    value={numNotifications}
                    status="error"
                    containerStyle={styles.badgeStyle}
                    />
                  }
                  
                    </View>
                  <Text style={{color:'white',fontSize:22,fontFamily:'Montserrat-Bold'}}>{props.getLabel(scene)}{"    "}</Text>
                  
                  </View>
                )
              case "Settings":
                return (
                  <View style={{flexDirection:'row',paddingBottom:SCREEN_HEIGHT/25}}>
                  <Icon name="cog" size={25} style={{ color: 'white',paddingTop:SCREEN_HEIGHT/150,paddingLeft:SCREEN_WIDTH/20,paddingRight:SCREEN_WIDTH/20 }} />
                  <Text style={{color:'white',fontSize:22,fontFamily:'Montserrat-Bold'}}>{props.getLabel(scene)}{"    "}</Text>
                  </View>
                )
              // case "Write":
              //   return (
              //     <View style={{flexDirection:'row',paddingBottom:SCREEN_HEIGHT/25}}>
              //     <Icon name="cog" size={25} style={{ color: 'white',paddingTop:SCREEN_HEIGHT/150,paddingLeft:SCREEN_WIDTH/20,paddingRight:SCREEN_WIDTH/20 }} />
              //     <Text style={{color:'white',fontSize:22,fontFamily:'Montserrat-Bold'}}>{props.getLabel(scene)}{"    "}</Text>
              //     </View>
              //   )
              default:
                return null   
           }   
        
       }}

      onItemPress = {
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
                case 'Write':
                  props.onItemPress(route);
                  break;  
            }
          }
          } 
          activeBackgroundColor='#101010'   style={{backgroundColor: '#ffffff', }} labelStyle={{color: '#ffffff', fontSize: SCREEN_HEIGHT/35}}/>
          {/* <Text style={{textAlign:"center",fontFamily:'Montserrat-Bold',paddingTop:20,color:'#dddd'}}> Music </Text> */}
          
            <View style={{ alignItems:'center',marginTop:SCREEN_HEIGHT/10}}>
            <Tooltip
            isVisible={toolTipVisible}
            content={<Text>Use this switch to toggle Music Player</Text>}
            onClose={() => setToolTipVisible(false)}
          >
            <ToggleSwitch
              isOn={isMusicEnabled && !isPodcastPlaying}
              onColor="white"
              offColor='#dddd'
              labelStyle={{ color: "black", fontWeight: "900" }}
              size="medium"
              onToggle={isOn => {
                console.log("changed to : ", isOn)
                if(isOn == true && isPodcastPlaying == true)
                  Toast.show("Close the podcast to play background music.");
                else{
                  modifyMusicPreferenceInDatabase(isOn);
                  console.log("musicRedux: ",musicRedux);
                  dispatch({type:"SET_IS_MUSIC_ENABLED",payload:isOn})
                }
                
              }}
            />
            </Tooltip>

            </View>
          
          <Text style={{textAlign:'center',fontFamily:'Montserrat-Bold', paddingTop:SCREEN_HEIGHT/10,color:'#dddd'}}>v1.0.23</Text>
    
    </Content>

    </Body>
  </Container>
 );
 }

export default withFirebaseHOC(CustomDrawerContentComponent);

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
    },
    badgeStyle: {
      position: 'absolute',
      top: 5,
      right: 20
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
  
  
  
  