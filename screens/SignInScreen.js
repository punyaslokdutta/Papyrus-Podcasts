

import React, {Component} from 'react';
import {SafeAreaView,
  ActivityIndicator,
  TouchableOpacity, StyleSheet, Text, View, AsyncStorage, Dimensions, ImageBackground, Button} from 'react-native';
import bgImage from '../assets/bgImage.jpg'
import { TextInput } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome'
import FontAwesome, { Icons } from 'react-native-fontawesome';
import { Formik } from 'formik';
import * as yup from 'yup';


const validationSchema = yup.object().shape({
  email: yup
    .string()
    .label('Email')
    .email()
    .required("*Email is a required field"),
  password: yup
    .string()
    .label('Password')
    .required("*Password is a required field")
    .min(6, 'Password must be atleast 6 characters'),
    
});


var {width:WIDTH, height:HEIGHT}=Dimensions.get('window')

class SignInScreen extends Component {
   
  signIn=async()=>
  {
    await AsyncStorage.setItem('userToken', 'punyaslok') // This AsyncStorage store the token on the device, so that a user can be signed in when he/she revisits
    this.props.navigation.navigate('App')
  }
    render() {
      return (
        
        <Formik
      initialValues={{ email: '', password: '' }}
      onSubmit={(values, actions) => {
        //alert(JSON.stringify(values));
        setTimeout(() => {
          actions.setSubmitting(false);
          this.props.navigation.navigate('App')
        }, 1000);
        
      }}
      validationSchema={validationSchema}
    >   
    {formikProps => (
      

      <SafeAreaView  style={styles.backgroundContainer} >
      <View style={{alignItems:'center', paddingBottom:HEIGHT/6}}>

          <TouchableOpacity style={{paddingTop:0 ,activeOpacity:0.2}}>
         <Icon name="envira" size={60} style={{color:'rgb(218,165,32)', paddingBottom:10, paddingLeft:20}}/>
         <Text style={{ alignItems: 'center', fontFamily:'sans-serif-light', color:'black', justifyContent:'center'}} >PAPYRUS PODCASTS</Text>
         </TouchableOpacity>
         </View>

        
        
        <View style={styles.positions}>
          <TextInput style={styles.Input}   placeholder={'Email'} placeholderTextColor={'black'} underlineColorAndroid='transparent'
          onChangeText={formikProps.handleChange('email')}
          /> 
          <Text style={{ color: 'rgba(255, 255, 255, 0.5)', paddingLeft:45 ,fontFamily:'sans-serif-light' , fontSize:12 }}>
          {formikProps.touched.email && formikProps.errors.email}
          </Text>

        </View>
        <View style={styles.positions}>
        <TextInput style={styles.Input} placeholder={'Password'} placeholderTextColor={'rgba(255, 255, 255, 0.5)'} underlineColorAndroid='transparent'
          onChangeText={formikProps.handleChange('password')}
          secureTextEntry/> 
          <Text style={{ color: 'rgba(255, 255, 255, 0.5)', paddingLeft:45 ,fontFamily:'sans-serif-light' , fontSize:12 }}>
          {formikProps.touched.password && formikProps.errors.password}
          </Text>
          </View>
          {formikProps.isSubmitting ? (
            <ActivityIndicator />
          ) : (
            <View>
            <TouchableOpacity style={{ alignItems: 'center', justifyContent:'center', height:45, width:WIDTH -55, borderRadius:15, backgroundColor:'rgb(218,165,32)', borderColor:'black', borderWidth: 1 }}
        onPress={formikProps.handleSubmit} >
            <Text style={{ alignItems: 'center', fontFamily:'sans-serif-light', color:'black', justifyContent:'center'}} >Login</Text>
                </TouchableOpacity>
             
              </View>
          )}
          

            <View>
            <TouchableOpacity style={{paddingTop:10, }}>
           <Text style={{ fontFamily:'sans-serif-light', color:'black', fontSize:12 }}>Forgot your Password?</Text>
         </TouchableOpacity>
            </View>
            <View style={{ paddingTop:10 }}>
          
           <Text style={{ fontFamily:'sans-serif-light', color:'black',  fontSize:12 }}>OR Login with </Text>
         
            </View>

            <View style={{flexDirection:'row'}}>
            <TouchableOpacity style={{paddingTop:20,paddingRight:WIDTH/8 }}>
         <Icon name="facebook-square" size={30} style={{color:'black'}}/>
         </TouchableOpacity>
         <TouchableOpacity style={{paddingTop:20}}>
         <Icon name="google-plus" size={30} style={{color:'black'}}/>
         </TouchableOpacity>
            </View>
        <View style={{ paddingTop:HEIGHT/12}}>
        <TouchableOpacity	onPress={() => this.props.navigation.navigate('SignUp')}>
        <Text style={{ fontFamily:'sans-serif-light', color:'black', fontSize:13 }}>Not a Papyrus member yet? Signup here</Text>
       </TouchableOpacity>
        </View>
        

       
      
         </SafeAreaView>)}
         </Formik>
         
         
       
      );
    }
  }

export default SignInScreen;


const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop:HEIGHT/5,
    backgroundColor:'#FFFFFF',
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
    borderColor:'black',
    borderWidth:1,
    fontSize:16, 
    paddingLeft:45, 
    backgroundColor:'white',
    //color:'black', 
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

