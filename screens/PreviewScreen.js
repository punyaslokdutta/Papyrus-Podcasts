

import React, {Component} from 'react';
import { TouchableOpacity,StyleSheet, Text, View, Button, SafeAreaView, Dimensions, Image, TextInput, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import FontAwesome, { Icons } from 'react-native-fontawesome';
import ImagePicker from 'react-native-image-picker'



const { width, height } = Dimensions.get('window');





const options = {
  title: 'Select Podcast Cover',
  chooseFromLibraryButtonTitle: 'Select from Library'
};
class PreviewScreen extends Component {
  constructor(props)
  {
    super(props)
    this.state={
      PodcastImage: null
    }
  }

  uploadImage=()=>
  {
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);
    
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
    
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
    
        this.setState({
          PodcastImage: source,
        });
      }
    });
  }
   
    render() {
      return (
        <SafeAreaView style={{flex:1, backgroundColor:'#101010'}}>
         <View style={styles.AppHeader}>
        <TouchableOpacity onPress={()=>this.props.navigation.goBack(null)}>
        <View style={{paddingLeft: width/12 ,paddingVertical:height/20, flexDirection:'row'} }>
          <Icon name="times" size={20} style={{color:'white'}}/>
          <Text style={{fontFamily:'san-serif-light', color:'white', paddingLeft:(width*7)/35, fontSize:20}}>New Podcast</Text>
        </View>
        </TouchableOpacity>
        </View>  

      <View style={{flexDirection:'row'}}> 
      <View style={{ paddingLeft: width/8, paddingVertical:height/30, flexDirection:'column'} }>
      <View>
      <Image source={this.state.PodcastImage} style={{width:height/6, height:height/6, borderRadius:60, borderColor: 'white', borderWidth :1}}/>
      </View>


        <View style={{ paddingTop:width/15}}>

                <TouchableOpacity style={{ alignItems: 'center', justifyContent:'center', height:height/16, width:height/6, borderRadius:15, backgroundColor:'rgb(22, 33, 25)', borderColor:'rgba(255, 255, 255, 0.5)', borderWidth: 1 }}
                onPress={this.uploadImage} >
            <Text style={{ alignItems: 'center', fontFamily:'sans-serif-light', color:'white', justifyContent:'center'}} >Choose Image</Text>
                </TouchableOpacity>
        </View>  
      </View> 
      <View>
      
      </View>
      </View> 

      <View style={{paddingLeft:width/8}}>
      <TextInput
            style={styles.TextInputStyleClass}
            underlineColorAndroid="transparent"
            placeholder={"A short description of the Book/Chapter"}
            placeholderTextColor={"white"}
            numberOfLines={6}
            multiline={true}
          />
      </View> 


      <View style={{ paddingTop:width/3, alignItems:'center'}}>

                <TouchableOpacity style={{ alignItems: 'center', justifyContent:'center', height:height/16, width:height/6, borderRadius:15, backgroundColor:'rgb(22, 33, 25)', borderColor:'rgba(255, 255, 255, 0.5)', borderWidth: 1 }}
                onPress={this.uploadImage} >
            <Text style={{ alignItems: 'center', fontFamily:'sans-serif-light', color:'white', justifyContent:'center'}} >Share</Text>
                </TouchableOpacity>
        </View>  


      
          
        </SafeAreaView>
      );
    }
  }

export default PreviewScreen;


const styles = StyleSheet.create({
  AppHeader:
  {
 flexDirection:'row',
 backgroundColor: '#101010'
  },
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
    TextInputStyleClass:{
 
      //textAlign: 'center',
      fontFamily:'san-serif-light',
      fontStyle:'italic', 
      color:'white',
      height: height/6,
      borderWidth: 2,
      borderColor: '#9E9E9E',
      borderRadius: 20 ,
      backgroundColor : "black",
      height: height/6, 
      width:(width*3)/4, 
      paddingLeft:10,
      paddingRight:10
       
      }
});
