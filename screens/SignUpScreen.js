

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
  Fullname: yup
    .string()
    .label('Fullname')
    .required("*Name is a required field"),

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
    confirmPassword: yup
    .string()
    .required("*Confirm Password is a required field")
    .label('Confirm password')
    .min(6, 'Password must be atleast 6 characters')
    .test('passwords-match', 'Donot match', function(value) {
      console.log(value)
      return this.parent.password === value;
    }),
});

var {width:WIDTH, height:HEIGHT}=Dimensions.get('window')

class SignUpScreen extends React.Component {
  
   
    render() {
      return (
        <Formik
      initialValues={{ Fullname: '', email: '', password: '', confirmPassword:'', }}
      onSubmit={(values, actions) => {
        alert(JSON.stringify(values));
        setTimeout(() => {
          actions.setSubmitting(false);
          this.props.navigation.navigate('App')
        }, 1000);
        
      }}
      validationSchema={validationSchema}
    >   
    {formikProps => (
        <ImageBackground  source ={bgImage} style={styles.backgroundContainer}> 
        <View style={styles.positions}>
        <TextInput style={styles.Input}   placeholder={'Fullname'} placeholderTextColor={'rgba(255, 255, 255, 0.5)'} underlineColorAndroid='transparent'
          onChangeText={formikProps.handleChange('Fullname')}
          /> 
          <Text style={{ color: 'rgba(255, 255, 255, 0.5)', paddingLeft:45 ,fontFamily:'sans-serif-light' , fontSize:12 }}>
          {formikProps.touched.Fullname && formikProps.errors.Fullname}
          </Text>
          
        </View>
        <View style={styles.positions}>
        <TextInput style={styles.Input}   placeholder={'Email'} placeholderTextColor={'rgba(255, 255, 255, 0.5)'} underlineColorAndroid='transparent'
          onChangeText={formikProps.handleChange('email')}
          /> 
          <Text style={{ color: 'rgba(255, 255, 255, 0.5)', paddingLeft:45 ,fontFamily:'sans-serif-light' , fontSize:12 }}>
          {formikProps.touched.email && formikProps.errors.email}
          </Text>
          </View>
          <View style={styles.positions}>
          <TextInput style={styles.Input}   placeholder={'Password'} placeholderTextColor={'rgba(255, 255, 255, 0.5)'} underlineColorAndroid='transparent'
          onChangeText={formikProps.handleChange('password')}
          secureTextEntry
          /> 
          <Text style={{ color: 'rgba(255, 255, 255, 0.5)', paddingLeft:45 ,fontFamily:'sans-serif-light' , fontSize:12 }}>
          {formikProps.touched.password && formikProps.errors.password}
          </Text>
          </View>
          <View style={styles.positions}>
          <TextInput style={styles.Input}   placeholder={'Confirm Password'} placeholderTextColor={'rgba(255, 255, 255, 0.5)'} underlineColorAndroid='transparent'
          onChangeText={formikProps.handleChange('confirmPassword')}
          secureTextEntry
          /> 
          <Text style={{ color: 'rgba(255, 255, 255, 0.5)', paddingLeft:45 ,fontFamily:'sans-serif-light' , fontSize:12 }}>
          {formikProps.touched.confirmpassword && formikProps.errors.confirmpassword}
          </Text>
          </View>
          {formikProps.isSubmitting ? (
            <ActivityIndicator />
          ) : (
            <View>
            <TouchableOpacity style={{ alignItems: 'center', justifyContent:'center', height:45, width:WIDTH -55, borderRadius:15, backgroundColor:'rgba(0, 0, 0, 0.7)', borderColor:'rgba(255, 255, 255, 0.5)', borderWidth: 1 }}
        onPress={formikProps.handleSubmit} >
            <Text style={{ alignItems: 'center', fontFamily:'sans-serif-light', color:'rgba(255, 255, 255, 0.5)', justifyContent:'center'}} >Login</Text>
                </TouchableOpacity>
             
              </View>
          )}
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
      )}
      </Formik>);
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
