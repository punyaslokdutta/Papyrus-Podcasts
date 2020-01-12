

import React, {Component} from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Dimensions, Button, ScrollView} from 'react-native';
import {createSwitchNavigator,
  createAppContainer,
  } from 'react-navigation'
  import { createBottomTabNavigator } from 'react-navigation-tabs';
  import { createStackNavigator } from 'react-navigation-stack';
  import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
  import {createMaterialTopTabNavigator} from 'react-navigation-tabs'
//import { createStore, combineReducers, applyMiddleware } from 'redux'
//import logger from 'redux-logger'
import AuthLoadingScreen from './screens/AuthLoadingScreen'
import SignInScreen from './screens/SignInScreen'
import SignUpScreen from './screens/SignUpScreen'
import SignOut from './screens/SignOut'
import HomeScreen from './screens/HomeScreen'
import Explore from './screens/Explore'
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
import {PlayerProvider} from './screens/components/PodcastPlayer/PlayerProvider';
import ProfileBookPodcast from './screens/components/Profile/ProfileBookPodcast'
import ProfileChapterPodcast from './screens/components/Profile/ProfileChapterPodcast'
import Profile_StatsScreen from './screens/components/Profile/Profile_StatsScreen'
import CategoryPodcast from './screens/components/categories/CategoryPodcast'
import CategoryBook from './screens/components/categories/CategoryBook'
import CategoryTabNavigator from './screens/navigation/CategoryTabNavigator'
import {createStore } from 'redux'
import {Provider} from 'react-redux'
import rootReducer from './reducers/rootReducer';


const store =createStore(rootReducer)


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

const ProfileTabNavigator =createMaterialTopTabNavigator(
{
   ProfileBookPodcast:{ screen: ProfileBookPodcast,navigationOptions:{
    tabBarLabel:'Books',
    tabBarIcon:({tintColor})=>(
      <Icon name="book" color={tintColor} size={20}/>
    )
  }}, 
   ProfileChapterPodcast: {screen:ProfileChapterPodcast, navigationOptions:{
    tabBarLabel:'Chapters',
    tabBarIcon:({tintColor})=>(
      <Icon name="newspaper-o" color={tintColor} size={20}/>
    )
  }}, 

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
   navigationOptions:
   {
     tabBarVisible: true,
     //headerVisible: true,
       header: props => <CustomProfileHeader {...props} />, 
     
   }
  }

)





const CustomProfileHeader = props => {
  {console.log("Inside Custom profile header ")}
  {console.log(props)}
  return (

      <View style={{alignItems:'center',justifyContent:'center',paddingTop: 30, flexDirection:'column'}}>
        <View style={{flexDirection:'column'}}>
          <Text h3 >Ella Alderson's</Text>
          <View style = {{alignItems:'center'}}>
          <Text h2 bold>Collections</Text>
          </View>
          </View>
          
          <TouchableOpacity style={{alignItems:'center'}} onPress={() => props.navigation.navigate('Profile_StatsScreen')}>
          <Image
              source={require('./assets/images/avatar.png')}
              style={styles.avatar}
            />
            </TouchableOpacity>
          </View>
  );
};

const CategoryStackNavigator=createStackNavigator(
  {
    CategoryScreen : {screen : CategoryScreen},
    CategoryTabNavigator : {screen : CategoryTabNavigator,navigationOptions:{
      //header:null
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
    Explore: {screen:Explore,
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
    PodcastPlayer: {screen :PodcastPlayer,
    navigationOptions:{
      header:null
   }},
   RecordBook: {screen :RecordBook,
    navigationOptions:{
      header:null
   }}

   
  
  },
    
      /*{
        headerMode: 'none',
        navigationOptions: {
          headerVisible: false,
        }
       }*/
    
     

  
)

const CustomDrawerContentComponent=(props)=>
(
  
  <Container style={{backgroundColor:'#101010'}}>
   
    <Body style={{alignItems:'center', paddingTop: SCREEN_HEIGHT/8}}>
     <Image style={styles.drawerimage}
       source={require('./assets/images/avatar.png')}
     />
     <Block flex={false} row center space="between" style={{paddingTop:30, paddingLeft:5}}>
          <Text style={{color:'white', fontSize:SCREEN_HEIGHT/40 }}>Ella Alderson</Text>
          
    </Block>
    <Block flex={false} row center space="between" style={{ paddingLeft:5}}>
          <Text style={{color:'white', fontFamily:'san-serif'}}>@ellaalderson</Text>
          
    </Block>

    <Content style={{ paddingTop: SCREEN_HEIGHT/18}}>
    
    <DrawerItems {...props}  activeBackgroundColor='#101010'   style={{backgroundColor: '#ffffff', }} labelStyle={{color: '#ffffff', fontSize: SCREEN_HEIGHT/35}}/>
    
    </Content>
    </Body>
  </Container>
)
const AppDrawerNavigator=createDrawerNavigator(
 {
    Home: {screen : AppStackNavigator, 
      navigationOptions: {
        drawerIcon: () => (<Icon name="home" size={24} style={{ color: 'white' }} />),
      }},
    "My Drafts": {screen:StatisticsScreen, 
      navigationOptions: {
        drawerIcon: () => (<Icon name="line-chart" size={22} style={{ color: 'white' }} />),
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

 //FirebaseConsumer is wrapped around withFirebaseHOC() which provides Firebase Apis
export default class App extends Component {
  //..
  render(){
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



