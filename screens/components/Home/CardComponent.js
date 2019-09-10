

import React, {Component} from 'react';
import { StyleSheet, Text, View, Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import FontAwesome, { Icons } from 'react-native-fontawesome';
import {Card, CardItem, Thumbnail, Body, Left, Right, Button} from 'native-base'



class CardComponent extends Component {
   
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
        
       <Card style={{paddingleft:10, paddingRight:10, paddingTop:10, borderRadius:10}}>
           <CardItem style={{height:170, width:50, paddingLeft:20, borderRadius:10}}>
               
               <Image source={require('../../../assets/boggart.jpg')} style={{width:60, height:70, resizeMode:'cover',  overflow:'hidden',}}/>
                
           </CardItem>
       </Card>

                 
      );
    }
  }

export default CardComponent;


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
