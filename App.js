import ProfileFollowerScreen from './screens/components/Profile/ProfileFollowerScreen'
import ProfileFollowingScreen from './screens/components/Profile/ProfileFollowingScreen'
import React, {Component} from 'react';
import CustomDrawerContentComponent from './screens/navigation/CustomDrawerContentComponent';
import setUserDetails from './screens/setUserDetails'
import { StyleSheet, View, TouchableOpacity, Image, Text,Dimensions, Button, ScrollView, Alert, NativeModules,Linking,Platform} from 'react-native';
import AddBookReviewScreen from './screens/components/Record/AddBookReviewScreen'
import store from './store';
import {createSwitchNavigator,
  createAppContainer,
  } from 'react-navigation'
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { MenuProvider } from 'react-native-popup-menu';

import FlipPreviewScreen from './screens/components/Record/FlipPreviewScreen';
import TabBar from './screens/navigation/CustomAppTabBar';
import LikersScreen from './screens/components/PodcastPlayer/LikersScreen'
import setPreferences from './setPreferences'
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
import { fromRight , fromLeft} from 'react-navigation-transitions';
import SplashScreen from 'react-native-splash-screen';
import WelcomeScreen from './screens/WelcomeScreen';
import thunk from 'redux-thunk';
import LottieView from 'lottie-react-native';

import EditMusicPreferences from './screens/EditMusicPreferences';
import ExploreFlipScreenVertical from './screens/components/Explore/ExploreFlipScreenVertical';
import ProfileFlipScreenVertical from './screens/components/Profile/ProfileFlipScreenVertical';
import updateAnimation from './assets/animations/10251-update-para-coverme.json'
import userReducer from './reducers/userReducer';
import rootReducer from './reducers/rootReducer';
import flipReducer from './reducers/flipReducer';
import recorderReducer from './reducers/recorderReducer';
import musicReducer from './reducers/musicReducer';
import categoryReducer from './reducers/categoryReducer';
import AuthLoadingScreen from './screens/AuthLoadingScreen'
import SignInScreen from './screens/SignInScreen'
import SignUpScreen from './screens/SignUpScreen'
import HomeScreen from './screens/HomeScreen'
import Explore from './screens/Explore'
import PodcastPlayer from './screens/PodcastPlayer'
import MusicPlayer from './screens/components/Music/MusicPlayer';
import SelectTabNavigator from './screens/SelectTabNavigator'
import PreviewScreen from './screens/PreviewScreen'
import CategoryScreen from './screens/CategoryScreen'
import RecordBook from './screens/RecordBook'
import RecordChapter from './screens/RecordChapter'
import StatisticsScreen from './screens/StatisticsScreen'
import Icon from 'react-native-vector-icons/FontAwesome'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons'
import { theme } from './screens/components/categories/constants';
import ActivityScreen from './screens/ActivityScreen'
import SettingsScreen from './screens/SettingsScreen'
import editProfile  from './screens/components/Profile/editProfile'
import firebaseApi, {FirebaseProvider} from './screens/config/Firebase'
import {NetworkProvider} from './screens/config/NetworkProvider';
import PlayerProvider from './screens/components/PodcastPlayer/PlayerProvider';
import MusicProvider from './screens/components/Music/MusicProvider';
import Profile_StatsScreen from './screens/components/Profile/Profile_StatsScreen'
import CategoryTabNavigator from './screens/navigation/CategoryTabNavigator'
import ProfileTabNavigator from './screens/navigation/ProfileTabNavigator'
import ExploreTabNavigator from './screens/navigation/ExploreTabNavigator'
import UserStatsScreen from './screens/components/Explore/UserStatsScreen'
import SaveExploreBooks from './screens/components/Profile/SaveExploreBooks';
import RepostPodcastsScreen from './screens/components/Profile/RepostPodcastsScreen';
import {createStore,combineReducers, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import UserFollowingScreen from './screens/components/Explore/UserFollowingScreen';
import UserFollowerScreen from './screens/components/Explore/UserFollowerScreen';
import InfoScreen from './InfoScreen'
import CustomUserHeader from './screens/navigation/CustomUserHeader'
import SearchTabNavigator from './screens/navigation/SearchTabNavigator';
import SearchBookChapterTabNavigator from './screens/navigation/SearchBookChapterTabNavigator';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';
import MainFlipItem from './screens/components/Home/MainFlipItem';
import FlipsExploreScreen from './screens/components/Explore/FlipsExploreScreen';

const  {width:SCREEN_WIDTH, height:SCREEN_HEIGHT}=Dimensions.get('window')
const IS_IPHONE_X = SCREEN_HEIGHT === 812 || SCREEN_HEIGHT=== 896;
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 44 : 20) : 0;
const HEADER_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 88 : 64) : 64;
const NAV_BAR_HEIGHT = HEADER_HEIGHT - STATUS_BAR_HEIGHT;


const AuthStackNavigator= createStackNavigator(
  {

    SignInScreen: SignInScreen,
    SignUpScreen: SignUpScreen,
    WelcomeScreen: WelcomeScreen
  },
  {
    headerMode: 'none',
    initialRouteName:'WelcomeScreen',
    transitionConfig: () => fromRight(),
    navigationOptions: {
      headerVisible: false,

    }
   }
)



const CategoryStackNavigator=createStackNavigator(
  {
    CategoryScreen : {screen : CategoryScreen,navigationOptions:{
      //header:null
      title: '    Categories  ',
      headerTintColor: 'white',
        headerStyle: {
          backgroundColor: 'black'
        }
    }},
    CategoryTabNavigator : {screen : CategoryTabNavigator,navigationOptions:{
    }}
  },
  {
    //headerMode:'none',
    initialRouteName:'CategoryScreen',
    transitionConfig: () => fromRight(),
  }
)




const ExploreStackNavigator=createStackNavigator(
  {
     Explore : {screen : Explore,navigationOptions:{
       header:null
     }},
     FlipsExploreScreen : {screen : FlipsExploreScreen}
     //MainFlipItem : {screen: MainFlipItem},
  },
  {
    //headerMode:'none',
    //initialRouteName:'CategoryScreen',
    transitionConfig: () => fromRight(),
  }

)


const ProfileStackNavigator=createStackNavigator(
  {
     ProfileTabNavigator : {screen : ProfileTabNavigator},
     SaveExploreBooks : {screen : SaveExploreBooks},
     RepostPodcastsScreen : {screen : RepostPodcastsScreen},
     //MainFlipItem : {screen: MainFlipItem},
     ProfileFlipScreenVertical : {screen : ProfileFlipScreenVertical},
    editProfile : {screen : editProfile,navigationOptions: {
       header: null,
   }},
    Profile_StatsScreen:{screen: Profile_StatsScreen, navigationOptions: {
      title: 'Stats  ',
      headerTintColor: 'white',
        headerStyle: {
          backgroundColor: 'black'
        }
  }},
    ProfileFollowingScreen:{screen:ProfileFollowingScreen,navigationOptions: {
      title: 'Following   ',
      headerTintColor: 'white',
        headerStyle: {
          backgroundColor: 'black'
        }
    }},
    ProfileFollowerScreen: {screen:ProfileFollowerScreen,navigationOptions: {
      title: 'Followers   ',
      headerTintColor: 'white',
        headerStyle: {
          backgroundColor: 'black'
        }
    }}
  },
  {
    //headerMode:'none',
    //initialRouteName:'CategoryScreen',
    transitionConfig: () => fromRight(),
  }
)

const RecordStackNavigator= createStackNavigator(
  {
    SelectTabNavigator: {screen:SelectTabNavigator},
    AddBookReviewScreen: {screen:AddBookReviewScreen},
    //AddFlipScreen: {screen:AddFlipScreen},
    FlipPreviewScreen : {screen:FlipPreviewScreen}
  },
  {
    headerMode:'none',
    initialRouteName:'SelectTabNavigator',
    transitionConfig: () => fromRight(),
  }
)

RecordStackNavigator.navigationOptions = ({ navigation }) => {
  return {
      tabBarVisible: false,
  }
}

const HomeStackNavigator= createStackNavigator(
  {
    HomeScreen :{screen: HomeScreen},
    //MainFlipItem : {screen: MainFlipItem}
  },
  {
    headerMode:'none',
  }
)

HomeStackNavigator.navigationOptions = ({ navigation }) => {
  return {
      tabBarVisible: true,
  }
}

const AppTabNavigator=createBottomTabNavigator(
  {
    Home: {screen:HomeStackNavigator,
    navigationOptions:{
      tabBarIcon:({tintColor})=>( <Entypo name="home" color={tintColor}  size={24}/> )
    }},
    
    Explore: {screen:ExploreStackNavigator,
      navigationOptions:{
        tabBarIcon:({tintColor})=>( <Icon name="search" color={tintColor}  size={24}/> )
      }
    },
    Record: {screen:RecordStackNavigator,
      navigationOptions:{
          tabBarIcon:({tintColor})=>(
          <MaterialCommunityIcon style={{paddingTop:1}} name="plus-circle" color={'black'} size={SCREEN_HEIGHT/18}/>
        )
      }
   },
    Category: {screen: CategoryStackNavigator,
      navigationOptions:{
        tabBarIcon:({tintColor})=>(
          <Icon name="cubes" color={tintColor} size={24}/>
        )
      }
    },
    Profile: {screen:ProfileStackNavigator,
      navigationOptions:{
        tabBarIcon:({tintColor})=>(
          <Icon name="user-circle" color={tintColor} size={28}/>
        )
      }
    },
  },{
  tabBarComponent: props => <TabBar {...props}/>,
  initialRouteName:'Explore',
  order:['Home', 'Explore', 'Record', 'Category', 'Profile'],
  headerMode: 'none',
  navigationOptions: ({ navigation }) => ({
    tabBarVisible: true,
    headerVisible: false,
    tabBarOnPress: (scene, jumpToIndex) => {
      console.log("TabBar Pressed");
    }
  }),
  tabBarOptions:{
    activeTintColor:'black',
    inactiveTintColor:'gray',
    backgroundColor:'white',
    borderTopWidth: 0,
    elevation :5,
    adaptive: true,
    style:
    {
      //paddingBottom: SCREEN_HEIGHT/100,
      height: SCREEN_HEIGHT/20,
    },
  },
  }
)


const AppStackNavigator= createStackNavigator(
  {
    AppTabNavigator:
    {
      screen: AppTabNavigator,
      navigationOptions: {
        header: null
       }
    },
    EditMusicPreferences : {screen : EditMusicPreferences,
      navigationOptions:{
        title: 'Music Preferences   ',
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: 'black'
        }
     }},
    ExploreFlipScreenVertical : {screen : ExploreFlipScreenVertical},
 
    PlayerProvider: {
      screen: PlayerProvider,
      navigationOptions:{
        header:null
     }
    },
    MusicProvider: {
      screen : MusicProvider
    },
    LikersScreen: {
      screen: LikersScreen,
      navigationOptions:{
        title: 'Likes   ',
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: 'black'
        }
     }
    },
    InfoScreen: {
      screen: InfoScreen,
      navigationOptions:{
        //header:null
        title: 'About  ',
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: 'black'
        }
     }
    },
    MainFlipItem : {screen: MainFlipItem},
    ExploreTabNavigator : {screen : ExploreTabNavigator,navigationOptions:{
    //  header: props => <CustomUserHeader {...props} />
    }},
    CustomUserHeader : {screen : CustomUserHeader,navigationOptions:{

    }},
     UserStatsScreen : {screen : UserStatsScreen,navigationOptions:{
          title: 'Stats  ',
          headerTintColor: 'white',
        headerStyle: {
          backgroundColor: 'black'
        }
     }},
     UserFollowingScreen : {screen : UserFollowingScreen,navigationOptions:{
          title: 'Following   ',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: 'black'
          }
     }},
     UserFollowerScreen : {screen : UserFollowerScreen,navigationOptions:{
          title: 'Followers   ',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: 'black'
          }
     }},
    //  Activity: {screen:ActivityScreen,
    //   navigationOptions: {
    //    //header:null
    //    title: 'Activities',
    //    headerTintColor: 'white',
    //    headerStyle: {
    //       backgroundColor: 'black'
    //     }
    //   }},
    PodcastPlayer: {screen :PodcastPlayer,
    navigationOptions:{
      header:null
   }},
   MusicPlayer: {
     screen : MusicPlayer
   },
   RecordBook: {screen :RecordBook,
    navigationOptions:{
      //header:null
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: 'black'
      }
   }},
   RecordChapter: {screen :RecordChapter,
    navigationOptions:{
      //header:null
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: 'black'
      }
   }},
   PreviewScreen: {screen:PreviewScreen,navigationOptions:{
    header : null
}},
   SearchTabNavigator: {screen: SearchTabNavigator,navigationOptions:{
         //header : null
   }},
   SearchBookChapterTabNavigator: {screen: SearchBookChapterTabNavigator,navigationOptions:{
    //header : null
}}
  },
  {

    transitionConfig: () => fromRight(),
    navigationOptions: {
      headerVisible: false,

    }
   }

)


const AppDrawerNavigator=createDrawerNavigator(
 {
    Home: {screen : AppStackNavigator,
      navigationOptions: {
        drawerLabel: "Home  ",
        //drawerIcon: () => (<Icon name="home" size={25} style={{ color: 'white' }} />),
      }},
    Drafts: {screen: StatisticsScreen,
      navigationOptions: {
        drawerLabel: "Drafts ",
        // drawerIcon: () => (<TouchableOpacity onPress={()=>{NativeModules.ReactNativeRecorder.sampleMethodTwo()}}>
        //   <Icon name="hdd-o" size={25} style={{ color: 'white' }} />
        //   </TouchableOpacity>),
      }},
    Activity: {screen:ActivityScreen,
      navigationOptions: {
        drawerLabel: "Activity  ",
       // drawerIcon: () => (<Icon name="bell" size={25} style={{ color: 'white' }} />),
      }},
    Settings: {screen:SettingsScreen,
      navigationOptions: {
        drawerLabel: "Settings ",
       // drawerIcon: () => (<Icon name="cog" size={25} style={{ color: 'white' }} />),
      }}
  },
  {
    drawerWidth: SCREEN_WIDTH/2,
    drawerPosition: 'left',
    drawerType: 'slide',
    initialRouteName: 'Home',
    overlayColor: 1,
    drawerOpenRoute:'DrawerOpen',
    drawerCloseRoute :'DrawerClose',
    drawerToggleRoute:'DrawerToggle',
    contentComponent: CustomDrawerContentComponent,
    contentOptions: {
      activeTintColor: '#dddd',
      inactiveTintColor: '#dddd'
    },


  }


)
const AppSwitchNavigator = createSwitchNavigator(
  {
    AuthLoading : AuthLoadingScreen,
    setUserDetails : setUserDetails,
    Auth : AuthStackNavigator,
    App : AppDrawerNavigator ,
    setPreferences: setPreferences
  },
  {
    initialRouteName:'AuthLoading'
  }
)

 const AppContainer = createAppContainer(AppSwitchNavigator);
//  const mainReducer = combineReducers({
//   recorderReducer,
//   userReducer,
//   rootReducer,
//   flipReducer,
//   musicReducer,
//   categoryReducer
// })

// const store = createStore(mainReducer, applyMiddleware(thunk))

// export store;

export default class App extends Component {

  constructor(props)
    {
     super(props)
     {
      this.state={
          currentVersionCode : 24,
          currentVersion : "1.0.23",
          updateLink : "https://play.google.com/apps/internaltest/4698784295424472878",
          //updateLink : "https://play.google.com/apps/testing/com.papyrus_60" 
        }
     }
    }

  componentDidMount = async () => {
    
    try{
      const updateVersionDoc = await firestore().collection('appUpdates').doc('newUpdate').get();
      const updateVersionData = updateVersionDoc.data();
      store.dispatch({type:"SET_BUILD_VERSION",payload:this.state.currentVersion});

      //[IMPORTANT]
    //For alpha update, use this code
      // this.setState({
      //   latestVersion : updateVersionData.updateVersion,
      //   latestVersionCode : updateVersionData.updateVersionCode,
      //   isForcedUpdate : updateVersionData.isForcedUpdate,
      //   updateMessage : updateVersionData.updateMessage
      // })

      // For internal update, use this code
    this.setState({
      latestVersion : updateVersionData.updateInternalTestVersion,
      latestVersionCode : updateVersionData.updateInternalTestVersionCode,
      isForcedUpdate : updateVersionData.isForcedUpdate,
      updateMessage : updateVersionData.updateMessage
    })
    }
    catch(error){
      console.log("Error in reading appUpdates document newUpdate: ",error);
    }
    finally{
      SplashScreen.hide();
    }
    
    

  }


  componentWillUnmount(){
    
    console.log("OUT!!!!!!!");
  }

  render(){

    console.log("REDUX_STORE_STATE: " + store.getState());
    if(this.state.currentVersionCode < this.state.latestVersionCode && this.state.isForcedUpdate)
    {
      return(
        <View>
        
      <LottieView style={{
       paddingLeft:SCREEN_WIDTH/12,
       paddingTop:30,
       height: SCREEN_HEIGHT*12/24,
       width: 300}} source={updateAnimation} autoPlay loop />
       <View style={{marginLeft:10,marginRight:10,marginTop:50}}>
       <Text style={{fontFamily:'Montserrat-Bold',fontSize:20}}> {this.state.updateMessage} </Text>
       <Text style={{fontFamily:'Montserrat-SemiBold'}}>{"\n"} Current App Version : {this.state.currentVersion} </Text>
      <Text style={{fontFamily:'Montserrat-SemiBold'}}> Latest App Version :  {this.state.latestVersion}</Text>
       </View>
       <TouchableOpacity style={{width:SCREEN_WIDTH/3,alignItems:'center',justifyContent:'center',height:30,backgroundColor:'#dddd'}}
            onPress={() => {
         Linking.openURL(this.state.updateLink).catch(err => { 
         console.log("Play console Page Linking error: ",err);
       })
       }}>
         <Text> UPDATE </Text>
         </TouchableOpacity>
       </View>

      // <View>
      //   <Modal>
      //     <View style={{ flex: 1 }}>
      //       <Text>I am the modal content!</Text>
      //     </View>
      //   </Modal>
      //   </View>
      )    
    }
    else
    {
      return(
        <Provider store ={store}>
        <FirebaseProvider value={firebaseApi}>
        <PlayerProvider>
        <MusicProvider>
        <MenuProvider>
        <NetworkProvider>
        <AppContainer/>
        </NetworkProvider>
        </MenuProvider>
        </MusicProvider>
        </PlayerProvider>
        </FirebaseProvider>
        </Provider>
        );
    }
    
  }
}


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



