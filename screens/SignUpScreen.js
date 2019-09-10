

import React, {Component} from 'react';
import { TouchableOpacity,StyleSheet, Text, View, ImageBackground, Image, Dimensions } from 'react-native';
import {Button} from 'native-base'
import bgImage from '../assets/bgImage.jpg'
import { TextInput } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome'
import FontAwesome, { Icons } from 'react-native-fontawesome';

var {width:WIDTH, height:HEIGHT}=Dimensions.get('window')

class SignUpScreen extends React.Component {
   
    render() {
      return (
        <ImageBackground  source ={bgImage} style={styles.backgroundContainer}> 
        <View style={styles.positions}>
          <TextInput style={styles.Input}   placeholder={'Full Name '} placeholderTextColor={'rgba(255, 255, 255, 0.6 )'} underlineColorAndroid='transparent'/>
          
        </View>
        <View style={styles.positions}>
        <TextInput style={styles.Input} placeholder={'Username'} placeholderTextColor={'rgba(255, 255, 255, 0.6)'} underlineColorAndroid='transparent'/>
          </View>
        <View style={styles.positions}>
        <TextInput style={styles.Input} placeholder={'Email'} placeholderTextColor={'rgba(255, 255, 255, 0.6)'} underlineColorAndroid='transparent'/>
          </View>
          <View style={styles.positions}>
        <TextInput style={styles.Input} placeholder={'Password'} placeholderTextColor={'rgba(255, 255, 255, 0.6)'} underlineColorAndroid='transparent'/>
          </View>
          <View style={styles.positions}>
        <TextInput style={styles.Input} placeholder={'Confirm Password'} placeholderTextColor={'rgba(255, 255, 255, 0.6)'} underlineColorAndroid='transparent'/>
          </View>
          <View>
          <Button  style={{ justifyContent:'center', height:45, width:WIDTH -55, borderRadius:15, backgroundColor:'rgba(0, 0, 0, 0.7)', borderColor:'rgba(255, 255, 255, 0.5)', borderWidth: 1 }}>
          <Text style={{ fontFamily:'sans-serif-light', color:'rgba(255, 255, 255, 0.5)'}}>SignUp</Text>
                    </Button>
           
            </View>
            <View>
            <TouchableOpacity style={{paddingTop:10, }}>
           <Text style={{ fontFamily:'sans-serif-light', color:'rgba(255, 255, 255, 0.8)', fontSize:12 }}>OR SignUp with </Text>
         </TouchableOpacity>
            </View>

            <View style={{flexDirection:'row'}}>
            <TouchableOpacity style={{paddingTop:20,paddingRight:WIDTH/8 }}>
         <Icon name="facebook-square" size={30} style={{color:'rgba(255, 255, 255, 0.6)'}}/>
         </TouchableOpacity>
         <TouchableOpacity style={{paddingTop:20}}>
         <Icon name="google-plus" size={30} style={{color:'rgba(255, 255, 255, 0.6)'}}/>
         </TouchableOpacity>
            </View>
        <View style={{ paddingTop:HEIGHT/8}}>
        <TouchableOpacity>
        <Text style={{ fontFamily:'sans-serif-light', color:'rgba(255, 255, 255, 0.5)', fontSize:10}}>By clicking "SignUp" you agree to Papyrus's Terms and Privacy Policy</Text>
       </TouchableOpacity>
        </View>
        

         

         </ImageBackground>
      );
    }
  }

export default SignUpScreen;


const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    width: null,
    height: null,
    alignItems: 'center',
    paddingTop:HEIGHT/3.5,
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
