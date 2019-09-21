

import React, {Component} from 'react';
import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import FontAwesome, { Icons } from 'react-native-fontawesome';
import {Card, CardItem, Thumbnail, Body, Left, Right, Button} from 'native-base'
import PodcastPlayer from '../../../screens/PodcastPlayer'


var {width, height}=Dimensions.get('window')

class CardComp extends Component {
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
        
        this.props.navigation.navigate(
            'PodcastPlayer',
            
          );
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
        
        <Card key={this.props.index}  style={[{width:((width) /2)-5 }, {height:(height) / 3 }]}>
        <Text style={{fontFamily:'sans-serif-light', color:'black', paddingLeft:5, fontSize:16, fontWeight:'bold', paddingTop:10}}>{this.props.Info.Book}</Text>
        <Text style={{fontFamily:'sans-serif-light', color:'black', paddingLeft:5, fontSize:10, }}>{this.props.Info.Storyteller}</Text>
       
        <TouchableOpacity onPress={()=> this.onPressed() }style={[{width:((width) /2)-10 }, {height:(height) / 6 },{paddingLeft:5},{paddingRight:5} ,{marginBottom:2}, {paddingTop:5}]}>
        <Image style={{flex:1, width: undefined, height:  undefined, borderRadius:5, padding:10}} source={this.props.Info.ImageUri}/>
        </TouchableOpacity>

        <Button transparent style={{paddingLeft:5}}>
          <Icon name='bookmark-o' size={20} />

          </Button>
      
        
       
        </Card>
        
      );
    }
  }

export default CardComp;


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
