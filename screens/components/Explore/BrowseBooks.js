

import React, {Component} from 'react';
import { StyleSheet, Text, View, Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import FontAwesome, { Icons } from 'react-native-fontawesome';



class BrowseBooks extends Component {
   
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
        
        <View style={{height:60, width:120, marginLeft:20, borderwidth:4, borderColor:'#dddddd',overflow:'hidden', paddingRight:10,borderRadius:10}}>
                        <Image source={this.props.ImageUri} style={{width:120, height:60, resizeMode:'cover',  overflow:'hidden', paddingRight:10}}/>
                    </View>

                 
      );
    }
  }

export default BrowseBooks;


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
