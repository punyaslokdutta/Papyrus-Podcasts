import React, {Component} from 'react';
import { StyleSheet, Text, View, Image,Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import FontAwesome, { Icons } from 'react-native-fontawesome';
import * as theme from '../constants/theme'
import ProfileTabNavigator from '../../navigation/ProfileTabNavigator'
import ExploreTabNavigator from '../../navigation/ExploreTabNavigator'
import { TouchableOpacity } from 'react-native-gesture-handler';
import Explore from '../../Explore'
import { withFirebaseHOC } from '../../config/Firebase';


var {width, height}=Dimensions.get('window')
const areEqual = (prevProps, nextProps) => true

  const Story = React.memo((props)=> {
  
    console.log("Inside Storyyyyyyyyyyyyyyyyyyyyy################################################yyyyyyyyyyyy")
    //console.log(props.item);
    const  userid = props.firebase._getUid();
      const item = props.item
      var text2 = "FOLLOW"
      if(item.isUserFollower !== undefined && item.isUserFollower[userid] === true)
      {
        text2 = "FOLLOWING"
        console.log(item.isUserFollower[userid])
      }
      
      
   
      return (

        <TouchableOpacity onPress={() => props.navigation.navigate('ExploreTabNavigator', {userData:props.item,followsOrNot:text2})}>
        <View style={[styles.shadow,{marginLeft: 15}]}>
        <Image source={{ uri: props.item.displayPicture }} style={styles.storie} />
        <Text style={styles.username}>{props.item.name}</Text>
        </View>
        </TouchableOpacity>
                 
      );
    }, areEqual);
  

export default withFirebaseHOC(Story);


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
  storie: {
    height: 60,
    width: 60,
    borderRadius: 30,
    marginLeft: 7,
    borderWidth: 1,
    borderColor: '#dddddd',
},
username: {
    alignSelf: 'center',
    fontWeight: '200',
    fontFamily: 'sans-serif-light'
},
shadow: {
  shadowColor: theme.colors.black,
  shadowOffset: {
    width: 0,
    height: 50,
    radius: 69
  },
  shadowOpacity: 5,
  shadowRadius: 20,
  elevation: 30,
}
});
