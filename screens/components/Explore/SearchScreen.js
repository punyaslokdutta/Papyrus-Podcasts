import React, {Component} from 'react';
import { StyleSheet, Text, View,TextInput, Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import FontAwesome, { Icons } from 'react-native-fontawesome';



class SearchScreen extends React.Component {
    
    componentDidMount()
    {
      console.log("COMPONENNNNNNNNNNNNNNNNNT         DID MOUNT        JJKBJ")
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
		}*/console.log("IN SEARCH SCREENNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN")
      return (
        
      <View style={{backgroundColor:'black',flex:1}}>
       <View style={{paddingVertical:30,flexDirection:'row',backgroundColor:'black'}}>
         <TextInput underlineColorAndroid="transparent" placeholder="Search Books, Chapters, Authors" placeholderTextColor="black"  style={{ flex:1, fontWeight:'700',borderRadius:8, backgroundColor:'#dddd',
            elevation:1, paddingHorizontal: 10/*marginTop: Platform.OS=='android'?30:null*/}}
            />
         </View>
</View>
                 
      );
    }
  }

export default SearchScreen;


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
