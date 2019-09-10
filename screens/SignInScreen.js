

import React, {Component} from 'react';
import {TouchableOpacity, StyleSheet, Text, View, AsyncStorage, Dimensions, ImageBackground} from 'react-native';
import {Button} from 'native-base'
import bgImage from '../assets/bgImage.jpg'
import { TextInput } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome'
import FontAwesome, { Icons } from 'react-native-fontawesome';


var {width:WIDTH, height:HEIGHT}=Dimensions.get('window')

class SignInScreen extends Component {
   
  signIn=async()=>
  {
    await AsyncStorage.setItem('userToken', 'punyaslok') // This AsyncStorage store the token on the device, so that a user can be signed in when he/she revisits
    this.props.navigation.navigate('App')
  }
    render() {
      return (
        <ImageBackground  source ={bgImage} style={styles.backgroundContainer}> 
        <View style={styles.positions}>
          <TextInput style={styles.Input}   placeholder={'Email/Username'} placeholderTextColor={'rgba(255, 255, 255, 0.5)'} underlineColorAndroid='transparent'/>
          
        </View>
        <View style={styles.positions}>
        <TextInput style={styles.Input} placeholder={'Password'} placeholderTextColor={'rgba(255, 255, 255, 0.5)'} underlineColorAndroid='transparent'/>
          </View>
          <View>
          <TouchableOpacity style={{ alignItems: 'center', justifyContent:'center', height:45, width:WIDTH -55, borderRadius:15, backgroundColor:'rgba(0, 0, 0, 0.7)', borderColor:'rgba(255, 255, 255, 0.5)', borderWidth: 1 }}
			onPress={this.signIn}>
          <Text style={{ alignItems: 'center', fontFamily:'sans-serif-light', color:'rgba(255, 255, 255, 0.5)', justifyContent:'center'}} >Login</Text>
              </TouchableOpacity>
           
            </View>
            <View>
            <TouchableOpacity style={{paddingTop:10, }}>
           <Text style={{ fontFamily:'sans-serif-light', color:'rgba(255, 255, 255, 0.5)', fontSize:12 }}>Forgot your Password?</Text>
         </TouchableOpacity>
            </View>
            <View style={{ paddingTop:10 }}>
          
           <Text style={{ fontFamily:'sans-serif-light', color:'rgba(255, 255, 255, 0.5)', fontSize:12 }}>OR Login with </Text>
         
            </View>

            <View style={{flexDirection:'row'}}>
            <TouchableOpacity style={{paddingTop:20,paddingRight:WIDTH/8 }}>
         <Icon name="facebook-square" size={30} style={{color:'rgba(255, 255, 255, 0.8)'}}/>
         </TouchableOpacity>
         <TouchableOpacity style={{paddingTop:20}}>
         <Icon name="google-plus" size={30} style={{color:'rgba(255, 255, 255, 0.8)'}}/>
         </TouchableOpacity>
            </View>
        <View style={{ paddingTop:HEIGHT/6}}>
        <TouchableOpacity	onPress={() => this.props.navigation.navigate('SignUp')}>
        <Text style={{ fontFamily:'sans-serif-light', color:'rgba(255, 255, 255, 0.5)', fontSize:13 }}>Not a Papyrus member yet? Signup here</Text>
       </TouchableOpacity>
        </View>
        

         

         </ImageBackground>
       
      );
    }
  }

export default SignInScreen;


const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    width: null,
    height: null,
    alignItems: 'center',
    paddingTop:HEIGHT/2.3,
  },
  logo:{
    width:120,
    height:120,

  }, 
  logoContainer:{
    alignItems:'center'

  }, 
  logoText:
  {
    color:'#D4AF37', 
    fontSize:20,
    fontWeight:'500',
    marginTop: 10,
    opacity:0.5
  }, 
  Input:{
    width: WIDTH -55, 
    height: 45, 
    borderRadius:20, 
    fontSize:16, 
    paddingLeft:45, 
    backgroundColor:'rgba(0, 0, 0, 0.7)',
    color:'rgba(255, 255, 255, 0.7)', 
    marginHorizontal:25, 
    fontFamily:'sans-serif-light'
  },
   positions:
  {
paddingBottom: 10
  }, 
  
});


/*import React, {Component} from 'react';
import {TouchableOpacity, StyleSheet, Text, View, AsyncStorage, Dimensions} from 'react-native';

// async/await vs callbacks vs promise objects 
var {width:WIDTH, height:HEIGHT}=Dimensions.get('window')
class SignInScreen extends React.Component {

  signIn=async()=>
  {
    await AsyncStorage.setItem('userToken', 'punyaslok') // This AsyncStorage store the token on the device, so that a user can be signed in when he/she revisits
    this.props.navigation.navigate('App')
  }
   
    render() {
      return (
        <View style={styles.container}>
        <TouchableOpacity style={styles.buttonStyle}
			onPress={this.signIn}
		  >
			 <Text style={styles.textStyle}>Complete Sign In</Text>
		  </TouchableOpacity>
          
        </View>
      );
    }
  }

export default SignInScreen;


const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    width: null,
    height: null,
    alignItems: 'center',
    paddingTop:HEIGHT/2.3,
  },
  logo:{
    width:120,
    height:120,

  }, 
  logoContainer:{
    alignItems:'center'

  }, 
  logoText:
  {
    color:'#D4AF37', 
    fontSize:20,
    fontWeight:'500',
    marginTop: 10,
    opacity:0.5
  }, 
  Input:{
    width: WIDTH -55, 
    height: 45, 
    borderRadius:20, 
    fontSize:16, 
    paddingLeft:45, 
    backgroundColor:'rgba(0, 0, 0, 0.7)',
    color:'rgba(255, 255, 255, 0.7)', 
    marginHorizontal:25, 
    fontFamily:'sans-serif-light'
  },
   positions:
  {
paddingBottom: 10
  }, 
  
});


*/

