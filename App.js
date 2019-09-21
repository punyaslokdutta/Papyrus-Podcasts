

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
//import store from './src/store'
//import { Provider } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome'
import FontAwesome, { Icons } from 'react-native-fontawesome';





//const reducer = combineReducers({ navigation })
//const store = createStore(reducer, applyMiddleware(logger))

const AuthStackNavigator= createStackNavigator(
  {
    
    SignIn: SignInScreen,
    SignUp: SignUpScreen
  },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    }
   }
)

const RecordStackNavigator= createStackNavigator(
  {
    SelectScreen: {screen:SelectScreen},
    StartRecord: {screen:StartRecordScreen},
    Preview: {screen:PreviewScreen},
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
    Profile: {screen:Profile,
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
const AppDrawerNavigator=createDrawerNavigator(
 {
    Home: AppStackNavigator,
    //SignOut: SignOut
   

    
  }

)
const AppSwitchNavigator = createSwitchNavigator(
  {
    
    AuthLoading : AuthLoadingScreen,
    Auth : AuthStackNavigator, // this will be a stack navigator
    App : AppDrawerNavigator //this is the drawer navigator 
  },
)

const App =createAppContainer(AppSwitchNavigator); // ^3.0.8 react-navigation 


export default App;




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



