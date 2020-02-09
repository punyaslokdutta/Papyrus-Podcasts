import ProfileFollowerScreen from './screens/components/Profile/ProfileFollowerScreen'
import ProfileFollowingScreen from './screens/components/Profile/ProfileFollowingScreen'

import React, {Component} from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Dimensions, Button, ScrollView, NativeModules} from 'react-native';
import {createSwitchNavigator,
  createAppContainer,
  } from 'react-navigation'
import NavigationService from './screens/navigation/NavigationService';


  import { createBottomTabNavigator, createMaterialTopTabNavigator } from 'react-navigation-tabs';
  import { createStackNavigator } from 'react-navigation-stack';
  import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
  
import thunk from 'redux-thunk';
import userReducer from './reducers/userReducer'
import rootReducer from './reducers/rootReducer';
import otherUserReducer from './reducers/otherUserReducer'

import AuthLoadingScreen from './screens/AuthLoadingScreen'
import SignInScreen from './screens/SignInScreen'
import SignUpScreen from './screens/SignUpScreen'
import SignOut from './screens/SignOut'
import HomeScreen from './screens/HomeScreen'
import Explore from './screens/Explore'
import SearchScreen from './screens/components/Explore/SearchScreen'
import PodcastPlayer from './screens/PodcastPlayer'
import SelectScreen from './screens/SelectScreen'
import StartRecordScreen from './screens/StartRecordScreen'
import PreviewScreen from './screens/PreviewScreen'
import TagsScreen from './screens/TagsScreen'
import CategoryScreen from './screens/CategoryScreen'
import RecordBook from './screens/RecordBook'
import StatisticsScreen from './screens/StatisticsScreen'
import Icon from 'react-native-vector-icons/FontAwesome'
import {Container, Content, Header, Body} from 'native-base'
import { Block, Text } from './screens/components/categories/components/';
import { theme } from './screens/components/categories/constants';
import ActivityScreen from './screens/ActivityScreen'
import SettingsScreen from './screens/SettingsScreen'
import editProfile  from './screens/components/Profile/editProfile'
import firebaseApi, {FirebaseProvider} from './screens/config/Firebase'
import PlayerProvider from './screens/components/PodcastPlayer/PlayerProvider';
import Profile_StatsScreen from './screens/components/Profile/Profile_StatsScreen'
import CategoryTabNavigator from './screens/navigation/CategoryTabNavigator'
import ProfileTabNavigator from './screens/navigation/ProfileTabNavigator'
import ExploreTabNavigator from './screens/navigation/ExploreTabNavigator'
import UserStatsScreen from './screens/components/Explore/UserStatsScreen'
import {createStore,combineReducers, applyMiddleware} from 'redux'
//import store from './reducers/store'
import {Provider} from 'react-redux'

import UserFollowingScreen from './screens/components/Explore/UserFollowingScreen';
import UserFollowerScreen from './screens/components/Explore/UserFollowerScreen';
import InfoScreen from './InfoScreen'
import CustomDrawerContentComponent from './screens/navigation/CustomDrawerContentComponent'
import setUserDetails  from './screens/setUserDetails'



//const store = createStore(rootReducer)


//const reducer = combineReducers({ navigation })
//const store = createStore(reducer, applyMiddleware(logger))
var {width:SCREEN_WIDTH, height:SCREEN_HEIGHT}=Dimensions.get('window')
const IS_IPHONE_X = SCREEN_HEIGHT === 812 || SCREEN_HEIGHT=== 896;
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 44 : 20) : 0;
const HEADER_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 88 : 64) : 64;
const NAV_BAR_HEIGHT = HEADER_HEIGHT - STATUS_BAR_HEIGHT;


const AuthStackNavigator= createStackNavigator(
  {
    
    SignIn: SignInScreen,
    SignUp: SignUpScreen, 
    //BooksSelected: BooksSelectedScreen, 
    //ChaptersSelected : ChaptersSelectedScreen, 
    //AuthorsSelected: AuthorsSelectedScreen
  },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    }
   }
)

/////////////
/////////////

  
/*const PreferencesStackNavigator =createStackNavigator(
  {}
)*/








const CategoryStackNavigator=createStackNavigator(
  {
    CategoryScreen : {screen : CategoryScreen,navigationOptions:{
      header:null
    }},
    CategoryTabNavigator : {screen : CategoryTabNavigator,navigationOptions:{
      //header:null
    }} 
  }, 
  {
    //headerMode:'none',
    //initialRouteName:Profile,  
}
)

////////////////


const ExploreStackNavigator=createStackNavigator(
  {
     Explore : {screen : Explore,navigationOptions:{
       header:null
     }}, 
    SearchScreen : {screen : SearchScreen,navigationOptions: {
       header: null,
   }},
     ExploreTabNavigator : {screen : ExploreTabNavigator,navigationOptions:{

     }},
      UserStatsScreen : {screen : UserStatsScreen,navigationOptions:{

      }},
      UserFollowingScreen : {screen : UserFollowingScreen,navigationOptions:{

      }},
      UserFollowerScreen : {screen : UserFollowerScreen,navigationOptions:{

      }}

  }, 
  {
    //headerMode:'none',
    //initialRouteName:Profile,
   
   
}
)


const ProfileStackNavigator=createStackNavigator(
  {
     ProfileTabNavigator : {screen : ProfileTabNavigator}, 
    editProfile : {screen : editProfile,navigationOptions: {
       header: null,
   }}, 
    Profile_StatsScreen:{screen: Profile_StatsScreen, navigationOptions: {
     // header: null,
  }},
  ProfileFollowingScreen:{screen:ProfileFollowingScreen,navigationOptions: {
      //header:null
    }},
    ProfileFollowerScreen: {screen:ProfileFollowerScreen,navigationOptions: {
      //header:null
    }},
    UserFollowingScreen : {screen : UserFollowingScreen,navigationOptions:{

    }},
    UserFollowerScreen : {screen : UserFollowerScreen,navigationOptions:{

    }},
    UserStatsScreen:{screen : UserStatsScreen,navigationOptions:{

    }},
    ExploreTabNavigator : {screen : ExploreTabNavigator,navigationOptions:{

    }}
  }, 
  {
    //headerMode:'none',
    //initialRouteName:Profile,
   
   
}
)
/*ProfileStackNavigator.navigationOptions = ({ navigation }) => {
  /*if(navigation.state.index==0){
      return {
          tabBarVisible: false,
      };
  }
  return {
      //tabBarVisible: true,
     header: props => <CustomProfileHeader {...props} />, 
     headerStyle: {        
      backgroundColor: "transparent"      
    }
  }
}*/

const RecordStackNavigator= createStackNavigator(
  {
    SelectScreen: {screen:SelectScreen},
    //StartRecord: {screen:StartRecordScreen},
    PreviewScreen: {screen:PreviewScreen},
    Tags : {screen:TagsScreen} ,
  },
  {
    //initialRouteName: SelectScreen ,
    headerMode:'none',
  }
    
     
    
     

  
)

RecordStackNavigator.navigationOptions = ({ navigation }) => {
  /*if(navigation.state.index==0){
      return {
          tabBarVisible: false,
      };
  }*/
  return {
      tabBarVisible: false,
  }
}

const HomeStackNavigator= createStackNavigator(
  {
    HomeScreen :{screen: HomeScreen},
   // RecordBook :{screen: RecordBook},

  },
  {
    headerMode:'none',
  }
)

HomeStackNavigator.navigationOptions = ({ navigation }) => {
  /*if(navigation.state.index==0){
      return {
          tabBarVisible: false,
      };
  }*/
  return {
      tabBarVisible: true,
  }
}

const AppTabNavigator=createBottomTabNavigator(
  {
    Home: {screen:HomeStackNavigator, 
    navigationOptions:{
      tabBarLabel:'Home',
      tabBarIcon:({tintColor})=>(
        <Icon name="home" color={tintColor}  size={24}/>
      )
    }},
    Explore: {screen:ExploreStackNavigator,
      navigationOptions:{
        tabBarLabel:'Explore',
        tabBarIcon:({tintColor})=>(
          <Icon name="search" color={tintColor}  size={26}/>
        )
      } 
    },
   Record: {screen:RecordStackNavigator,
      navigationOptions:{
        tabBarLabel:'Record',
        tabBarIcon:({tintColor})=>(
          <Icon name="microphone" color={tintColor} size={26}/>
        )
      } 
   },
    Category: {screen: CategoryStackNavigator,
      navigationOptions:{
        tabBarLabel:'Categories',
        tabBarIcon:({tintColor})=>(
          <Icon name="cubes" color={tintColor} size={24}/>
        )
      } 
    },
    Profile: {screen:ProfileStackNavigator,
      navigationOptions:{
        tabBarLabel:'Collections',
        tabBarIcon:({tintColor})=>(
          <Icon name="user-circle" color={tintColor} size={24}/>
        )
      } 
    }, 
    



  },{initialRouteName:'Home',
  order:['Home', 'Explore', 'Record', 'Category', 'Profile'],
  headerMode: 'none',
  navigationOptions:
  {
    tabBarVisible: true,
    headerVisible: false
  }, 
  tabBarOptions:{
    activeTintColor:'black',
    inactivetintcolor:'grey',
    backgroundColor:'white',
    borderTopWidth: 0,
    elevation :5,
    adaptive: true, 
    style:
    {
      paddingBottom: SCREEN_HEIGHT/100,
      height: SCREEN_HEIGHT/11, 
    },
  }, 
   

  }
)




const AppStackNavigator= createStackNavigator(
  {
    AppTabNavigator:
    {
      screen: AppTabNavigator,
      /*navigationOptions:({navigation})=>({
        title:'PAPYRUS',
        headerLeft: (
        <TouchableOpacity onPress={()=>navigation.toggleDrawer()}>
        <View style={{paddingHorizontal: 10}}>
          <Icon name="bars" size={24}/>
        </View>
        </TouchableOpacity>
        )
      }
      )*/
      navigationOptions: {
        header: null
    }


    },
    PlayerProvider: {
      screen: PlayerProvider,
      navigationOptions:{
        header:null
     }
    },

    PodcastPlayer: {screen :PodcastPlayer,
    navigationOptions:{
      header:null
   }},
   RecordBook: {screen :RecordBook,
    navigationOptions:{
      header:null
   }},

InfoScreen:{
  screen:InfoScreen,
  navigationOptions:{
    header:null
 }

}
   
  
  },
    
      /*{
        headerMode: 'none',
        navigationOptions: {
          headerVisible: false,
        }
       }*/
    
     

  
)


const AppDrawerNavigator=createDrawerNavigator(
 {
    Home: {screen : AppStackNavigator, 
      navigationOptions: {
        drawerIcon: () => (<Icon name="home" size={24} style={{ color: 'white' }} />),
      }},
    "My Drafts": {screen:StatisticsScreen, 
      navigationOptions: {
        drawerIcon: () => (<TouchableOpacity onPress={()=>{NativeModules.ReactNativeRecorder.sampleMethodTwo()}}><Icon name="line-chart" size={22} style={{ color: 'white' }} /></TouchableOpacity>),
      }}, 
      Activity: {screen:ActivityScreen, 
        navigationOptions: {
          drawerIcon: () => (<Icon name="bell" size={22} style={{ color: 'white' }} />),
        }},
        Settings: {screen:SettingsScreen, 
          navigationOptions: {
            drawerIcon: () => (<Icon name="cog" size={22} style={{ color: 'white' }} />),
          }},
    
    //SignOut: SignOut
   

    
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
      
    }, 
    

  }


)
const AppSwitchNavigator = createSwitchNavigator(
  {
    
    AuthLoading : AuthLoadingScreen,
    setUserDetails : setUserDetails,
    Auth : AuthStackNavigator, // this will be a stack navigator
    App : AppDrawerNavigator ,  //this is the drawer navigator 
    //Preferences: PreferencesStackNavigator 

  },
  {
    initialRouteName:'AuthLoading'
  }
)

//const App =createAppContainer(AppSwitchNavigator); // ^3.0.8 react-navigation 

// const router =createAppContainer(AppSwitchNavigator); 
 const AppContainer =createAppContainer(AppSwitchNavigator);  //top level navigator 

 //reducers
//  const userReducers = combineReducers({
//   userReducer,
//   otherUserReducer 
//  })
 const mainReducer = combineReducers({
     
  userReducer,
  rootReducer
})
// applyMiddleware supercharges createStore with middleware:
const store = createStore(mainReducer, applyMiddleware(thunk))

 //FirebaseConsumer is wrapped around withFirebaseHOC() which provides Firebase Apis
export default class App extends Component {
  //..
  render(){
    console.log("HHOOOWWWW???",store.getState());
    return(
    <Provider store ={store}>
    <PlayerProvider>
    <FirebaseProvider value={firebaseApi}> 
    <AppContainer/> 
    </FirebaseProvider>
    </PlayerProvider>
    </Provider>
    );
  }
}

//export default App;




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



