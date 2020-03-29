

import React from 'react';
import {
  ActivityIndicator,
  TouchableOpacity, StyleSheet, Text, View, AsyncStorage, Dimensions, ImageBackground, Button, Image} from 'react-native';
import bgImage from '../assets/bgImage.jpg'
import { TextInput } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome'
import { Formik } from 'formik';
import {withFirebaseHOC} from '../screens/config/Firebase'
import * as yup from 'yup';
import {firebase} from '@react-native-firebase/auth';
import {useDispatch} from 'react-redux'
import { AccessToken, LoginManager } from 'react-native-fbsdk';

const validationSchema = yup.object().shape({ 
  fullName: yup
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
    .oneOf([yup.ref('password'), null], 'Password must match')
    .required("*Confirm Password is a required field")
    .label('Confirm password')
    .min(6, 'Password must be atleast 6 characters')
    
});



async function _signupWithEmail (email, password, fullName){

  try {
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
    console.log("USER CREDENTIAL = ",userCredential);

  } catch (e) {
    console.error(e.message);
  }
}

var {width:WIDTH, height:HEIGHT}=Dimensions.get('window')

const SignUpScreen=(props)=>{


  onFBLoginOrRegister = async () => {
    LoginManager.logInWithPermissions(['public_profile', 'email',])
      .then((result) => {
        if (result.isCancelled) {
          return Promise.reject(new Error('The user cancelled the request'));
        }
        // Retrieve the access token
        return AccessToken.getCurrentAccessToken();
      })
      .then((data) => {
        // Create a new Firebase credential with the token
        const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
        // Login with the credential

        return firebase.auth().signInWithCredential(credential);
      })
      .then(async(user) => {
        // If you need to do anything with the user, do it here
        // The user will be logged in automatically by the
        // `onAuthStateChanged` listener we set up in App.js earlier
        console.log("username: ")
        console.log(user);
        console.log(user.user.uid);
        console.log(user.user.photoURL); 
        console.log(user.user.phoneNumber);
        console.log(user.user.displayName);
        console.log(user.user.email);
      })
      .catch((error) => {
        const { code, message } = error;
        console.log(code);
        console.log(message);
      });
  }

  const dispatch=useDispatch();
      return (
        <Formik
      initialValues={{ fullName: '', email: '', password: '',confirmPassword:'' }}
      onSubmit={(values, actions) => {
         // alert(JSON.stringify(values));
         dispatch({type:"CHANGE_NAME", payload: values.fullName})
         _signupWithEmail( values.email, values.password, values.fullName)
          actions.setSubmitting(false);
      }}
      validationSchema={validationSchema}
    >   
    {formikProps => (
        <View style={styles.backgroundContainer}>
           <View style={{ }}>

<TouchableOpacity>
    <Image
      resizeMode="contain"
      source={require('../assets/images/papyrusLogo.png')}
      style={{ width: 150, height: 150 }}
    />
  </TouchableOpacity>      
   </View>
        <View style={styles.positions}>
        <TextInput style={styles.Input}   placeholder={'Fullname'} placeholderTextColor={'rgba(255, 255, 255, 0.5)'} borderColor={'rgb(218,165,32)'} underlineColorAndroid='transparent'
          onChangeText={formikProps.handleChange('fullName')}
          /> 
          <Text style={{ color: 'rgba(255, 255, 255, 0.5)', paddingLeft:45 ,fontFamily:'sans-serif-light' , fontSize:12 }}>
          {formikProps.touched.fullName && formikProps.errors.fullName}
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
          {formikProps.touched.confirmPassword && formikProps.errors.confirmPassword}
          </Text>
          </View>
          {formikProps.isSubmitting ? (
            <ActivityIndicator />
          ) : (
            <View>
            <TouchableOpacity style={{ alignItems: 'center', justifyContent:'center', height:45, width:WIDTH -55, borderRadius:15, backgroundColor:'rgba(0, 0, 0, 0.7)', borderColor:'rgb(218,165,32)', borderWidth: 1 }}
        onPress={formikProps.handleSubmit} >
            <Text style={{ alignItems: 'center', fontFamily:'sans-serif-light', color:'rgb(218,165,32)', justifyContent:'center'}} >Submit</Text>
                </TouchableOpacity>
             
              </View>
          )}
            <View>
            <TouchableOpacity style={{paddingTop:10, }}>
           <Text style={{ fontFamily:'sans-serif-light', color:'rgba(255, 255, 255, 0.8)', fontSize:12 }}>OR SignUp with </Text>
         </TouchableOpacity>
            </View>

            <View style={{flexDirection:'row'}}>
         <TouchableOpacity style={{paddingTop:20,paddingRight:WIDTH/8 }} onPress={()=>{onFBLoginOrRegister()}}>
         <Icon name="facebook-square" size={30} style={{color:'rgba(255, 255, 255, 0.6)'}}/>
         </TouchableOpacity>
         <TouchableOpacity style={{paddingTop:20}}>
         <Icon name="google-plus" size={30} style={{color:'rgba(255, 255, 255, 0.6)'}}/>
         </TouchableOpacity>
            </View>
        <View style={{ paddingTop:HEIGHT/8}}>
        <TouchableOpacity>
        <Text style={{ fontFamily:'sans-serif-light', color:'rgba(255, 255, 255, 0.5)', fontSize:10}}>By clicking "Submit" you agree to Papyrus's Terms and Privacy Policy</Text>
       </TouchableOpacity>
        </View>
        </View>
      

         

         
      )}
      </Formik>);
  }

export default withFirebaseHOC(SignUpScreen);


const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    width: null,
    height: null,
    alignItems: 'center',
    paddingTop:HEIGHT/24,
    backgroundColor:'#101010'
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
    fontFamily:'sans-serif-light', 
   // borderColor:'rgb(218,165,32)'
  },
   positions:
  {
paddingBottom: 10
  }, 
  
});
