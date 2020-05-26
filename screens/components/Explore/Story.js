import React, {Component} from 'react';
import { StyleSheet, Text, View, Image,Dimensions} from 'react-native';
import * as theme from '../constants/theme'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { withFirebaseHOC } from '../../config/Firebase';
import { useDispatch } from 'react-redux';


var {width, height}=Dimensions.get('window')
const areEqual = (prevProps, nextProps) => true

  const Story = React.memo((props)=> {
  
    const dispatch = useDispatch();
    console.log("Inside [Story]")
    //console.log(props.item);
    const  userid = props.firebase._getUid();
      const item = props.item
      var text2 = "FOLLOW"
      if(item.isUserFollower !== undefined && item.isUserFollower[userid] === true)
      {
        text2 = "FOLLOWING"
        console.log(item.isUserFollower[userid])
      }
      
      const isUserSame = (props.item.id == userid);
      var exploreName = props.item.name;
      if(exploreName.length > 10){
        exploreName = exploreName.slice(0,10) + '...';
      }
        
   
      return (
        <View>
        {
          isUserSame ? <TouchableOpacity onPress={() => props.navigation.navigate('ProfileTabNavigator')}>
              <View style={[styles.shadow,{marginLeft: 15}]}>
              <Image source={{ uri: props.item.displayPicture }} style={styles.storie} />
              <Text style={styles.username}>{exploreName}</Text>
              </View>
              </TouchableOpacity>
            :

            (
              <TouchableOpacity onPress={() => {
                dispatch({type:"SET_OTHER_PRIVATE_USER_ITEM",payload:props.item})
                props.navigation.navigate('ExploreTabNavigator',{userData:props.item})}}>
              <View style={[styles.shadow,{marginLeft: 15}]}>
              <Image source={{ uri: props.item.displayPicture }} style={styles.storie} />
              <Text style={styles.username}>{exploreName}</Text>
              </View>
              </TouchableOpacity>
            )
        }
       </View>
                 
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
    height: width/4,
    width: width/4,
    borderRadius: 60,
    marginLeft: 7,
    borderWidth: 1,
    borderColor: '#dddddd',
},
username: {
    alignSelf: 'center',
    fontWeight: '200',
    fontFamily: 'sans-serif-light',
    paddingBottom:10
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
  //height: 10
}
});
