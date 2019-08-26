

import React, {Component} from 'react';
import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import FontAwesome, { Icons } from 'react-native-fontawesome';
import {Card, CardItem, Thumbnail, Body, Left, Right, Button} from 'native-base'


var {width, height}=Dimensions.get('window')

class AuthorCard extends Component {
    constructor(props)
    {
        super(props)
        {
            
            state={
                key:this.props.Info.index,
            }
        }
    
    

    }
    onPressed()
    {
        
        //this.props.navigation.navigate(
            //'PodcastPlayer',
            
         // );
    }
   
    render() {
        /*const shadowOpt = {
			width:160,
			height:170,
			color:"#000",
			border:2,
			radius:3,
			opacity:0.2,
			x:0,
			y:3,
			style:{marginVertical:5}
		}*/
      return (
        <View style={{justifyContent: 'center',paddingBottom: 20 , paddingTop:2, paddingLeft: width/8} }>
        
        </View>
        
      );
    }
  }

export default AuthorCard;


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
});
