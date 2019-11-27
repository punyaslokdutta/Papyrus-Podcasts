

import React, {Component} from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Dimensions} from 'react-native';
import {createSwitchNavigator,
  createAppContainer,
  createBottomTabNavigator,
  createStackNavigator,
  DrawerItems} from 'react-navigation'
  import { createDrawerNavigator } from 'react-navigation-drawer';
//import { createStore, combineReducers, applyMiddleware } from 'redux'
//import logger from 'redux-logger'
import AuthLoadingScreen from './screens/AuthLoadingScreen'
import SignInScreen from './screens/SignInScreen'
import SignUpScreen from './screens/SignUpScreen'
import SignOut from './screens/SignOut'
import HomeScreen from './screens/HomeScreen'
import Explore from './screens/Explore'
import Profile from './screens/Profile'
import PodcastPlayer from './screens/PodcastPlayer'
import SelectScreen from './screens/SelectScreen'
import StartRecordScreen from './screens/StartRecordScreen'
import PreviewScreen from './screens/PreviewScreen'
import TagsScreen from './screens/TagsScreen'
import CategoryScreen from './screens/CategoryScreen'
import RecordBook from './screens/RecordBook'
import StatisticsScreen from './screens/StatisticsScreen'
//import store from './src/store'
//import { Provider } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome'
import FontAwesome, { Icons } from 'react-native-fontawesome';

import {Container, Content, Header, Body} from 'native-base'
import { Card, Badge, Block, Text } from './screens/components/categories/components/';
import { theme, mocks } from './screens/components/categories/constants';
import ActivityScreen from './screens/ActivityScreen'
import SettingsScreen from './screens/SettingsScreen'
import editProfile  from './screens/components/Profile/editProfile'
import firebaseApi, {FirebaseProvider} from './screens/config/Firebase'
import PlayerProvider from './screens/components/PodcastPlayer/PlayerProvider';




//const reducer = combineReducers({ navigation })
//const store = createStore(reducer, applyMiddleware(logger))
var {width:WIDTH, height:HEIGHT}=Dimensions.get('window')
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


/*const PreferencesStackNavigator =createStackNavigator(
  {}
)*/

const ProfileStackNavigator=createStackNavigator(
  {
    Profile : {screen : Profile}, 
    editProfile : {screen : editProfile}
  }, 
  {
    //initialRouteName:Profile,
    headerMode: 'none'
  }
)
ProfileStackNavigator.navigationOptions = ({ navigation }) => {
  /*if(navigation.state.index==0){
      return {
          tabBarVisible: false,
      };
  }*/
  return {
      tabBarVisible: true,
  }
}

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
    Category: {screen: CategoryScreen,
      navigationOptions:{
        tabBarLabel:'Categories',
        tabBarIcon:({tintColor})=>(
          <Icon name="cubes" color={tintColor} size={24}/>
        )
      } 
    },
    Profile: {screen:ProfileStackNavigator,
      navigationOptions:{
        tabBarLabel:'Profile',
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
      height: 50, 
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
   
    <Body style={{alignItems:'center', paddingTop: HEIGHT/8}}>
     <Image style={styles.drawerimage}
       source={require('./assets/images/plants_3.png')}
     />
     <Block flex={false} row center space="between" style={{paddingTop:30, paddingLeft:5}}>
          <Text style={{color:'white', fontSize:HEIGHT/40 }}>Punyaslok Dutta</Text>
          
    </Block>
    <Block flex={false} row center space="between" style={{ paddingLeft:5}}>
          <Text style={{color:'white', fontFamily:'san-serif'}}>@punyaslokdutta</Text>
          
    </Block>

    <Content style={{ paddingTop: HEIGHT/18}}>
    
    <DrawerItems {...props}  activeBackgroundColor='#101010'   style={{backgroundColor: '#ffffff', }} labelStyle={{color: '#ffffff', fontSize: HEIGHT/35}}/>
    
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
    Stats: {screen:StatisticsScreen, 
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
    drawerWidth: WIDTH/2,
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
export default class App extends Component {
  //..
  render(){
    return(
    <PlayerProvider>
    <FirebaseProvider value={firebaseApi}>
    <AppContainer/> 
    </FirebaseProvider>
    </PlayerProvider>
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
    drawerimage:
    {
      height: 100, 
      width:100, 
      borderRadius:50, 

    }, 
});



