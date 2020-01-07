

import React, {Component} from 'react';
import { StyleSheet, Text, View, Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import FontAwesome, { Icons } from 'react-native-fontawesome';
import * as theme from '../constants/theme'


class Story extends Component {
   
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
        
        <View style={[styles.shadow,{marginLeft: 15}]}>
        <Image source={this.props.ImageUri}  style={styles.storie} />
        <Text style={styles.username}>{this.props.username}</Text>
        </View>
                 
      );
    }
  }

export default Story;


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
