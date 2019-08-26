

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
        <Card key={this.props.index}style={[{width:((width*3) /4) }, {height:((height) / 3 )} ]} >
        <TouchableOpacity onPress={()=> this.onPressed() }style={[{width:((width*3)/4) }, {height:(height) / 6 },{paddingLeft:width/12} ,{marginBottom:2}, {paddingTop:5}]}>
        <Image style={{ width: width/3, height:  width/3, borderRadius:width/3, paddingLeft:width/24}} source={this.props.Info.ImageUri}/>
        </TouchableOpacity>

        <Text style={{fontFamily:'sans-serif-light', color:'black', paddingLeft:5, fontSize:20, fontWeight:'bold', paddingTop:10}}>{this.props.Info.Book}</Text>
        <Text style={{fontFamily:'sans-serif-light', color:'black', paddingLeft:5, fontSize:15, }}>{this.props.Info.Storyteller}</Text>
       

        
      
        
       
        </Card>
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
