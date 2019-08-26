

import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {createSwitchNavigator,
  createAppContainer,
  createDrawerNavigator,
  createBottomTabNavigator,
  createStackNavigator} from 'react-navigation'
//import { createStore, combineReducers, applyMiddleware } from 'redux'
//import logger from 'redux-logger'
import AuthLoadingScreen from './screens/AuthLoadingScreen'
import WelcomeScreen from './screens/WelcomeScreen'
import SignInScreen from './screens/SignInScreen'
import SignUpScreen from './screens/SignUpScreen'
import SignOut from './screens/SignOut'
import HomeScreen from './screens/HomeScreen'
import Explore from './screens/Explore'
import Profile from './screens/Profile'
import Activity from './screens/Activity'
import PodcastPlayer from './screens/PodcastPlayer'
import SelectScreen from './screens/SelectScreen'
import StartRecordScreen from './screens/StartRecordScreen'
import PreviewScreen from './screens/PreviewScreen'
import TagsScreen from './screens/TagsScreen'
import CategoryScreen from './screens/CategoryScreen'
//import store from './src/store'
//import { Provider } from 'react-redux'







import Icon from 'react-native-vector-icons/FontAwesome'
import FontAwesome, { Icons } from 'react-native-fontawesome';





//const reducer = combineReducers({ navigation })
//const store = createStore(reducer, applyMiddleware(logger))

const AuthStackNavigator= createStackNavigator(
  {
    
    Welcome: WelcomeScreen,
    SignIn: SignInScreen,
    SignUp: SignUpScreen
  },
  /*{
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    }
   }*/
)

const RecordStackNavigator= createStackNavigator(
  {
    Select: {screen:SelectScreen},
    StartRecord: {screen:StartRecordScreen},
    Preview: {screen:PreviewScreen},
    Tags : {screen:TagsScreen} ,
  },
  {
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

const AppTabNavigator=createBottomTabNavigator(
  /*{
    HomeScreen:{
      screen: HomeScreen
    },
    SettingsScreen:
    {
      screen:SettingsScreen
    }
  }*/


  {
    Home: {screen:HomeScreen, 
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
    Activity: {screen:Activity,
      navigationOptions:{
        tabBarLabel:'Activity',
        tabBarIcon:({tintColor})=>(
          <Icon name="feed" color={tintColor} size={24}/>
        )
      } 
    },
    Profile: {screen:Profile,
      navigationOptions:{
        tabBarLabel:'Profile',
        tabBarIcon:({tintColor})=>(
          <Icon name="user-circle" color={tintColor} size={24}/>
        )
      } 
    }, 
    Category:{
      screen: CategoryScreen,

    },



  },{initialRouteName:'Home',
  order:['Home', 'Explore', 'Record', 'Activity', 'Profile'],
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
    elevation :5
  }

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
   CategoryScreen: {screen :CategoryScreen,
    navigationOptions:{
   }}
  
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
    Home: AppStackNavigator,
    //SignOut: SignOut
   

    
  }

)
export default createSwitchNavigator(
  {
    
    AuthLoading : AuthLoadingScreen,
    Auth : AuthStackNavigator, // this will be a stack navigator
    App : AppDrawerNavigator //this is the drawer navigator 
  },
)




  class App extends React.Component {
  render() {
    return (
     
      <AppDrawerNavigator/> 
      //remember, Navigator is just  a component 
      
    );
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
});



