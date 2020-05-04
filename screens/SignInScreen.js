

import React, {Component, useEffect,useState} from 'react';
import {SafeAreaView,
  ActivityIndicator,
  TouchableOpacity, StyleSheet, Text, View, AsyncStorage, Dimensions, ImageBackground, Button, Image} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome'
import { Formik } from 'formik';
import * as yup from 'yup';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import { firebase } from '@react-native-firebase/auth';
import {withFirebaseHOC} from '../screens/config/Firebase'
import Toast from 'react-native-simple-toast';
import { useDispatch,useSelector } from 'react-redux';

var {width:WIDTH, height:HEIGHT}=Dimensions.get('window')


const validationSchema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .label('Email')
    .email()
    .required("*Email is a required field"),
  password: yup
    .string()
    .trim()
    .label('Password')
    .required("*Password is a required field")
    .min(6, 'Password must be atleast 6 characters'), 
});


  
  const SignInScreen = (props) => {

     const dispatch = useDispatch();
     const [loading,setLoading] = useState(false);
     const userEmail = useSelector(state=>state.userReducer.signupEmail);


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
 async function handleLogin(formikProps){
   setLoading(true);
  formikProps.handleSubmit();
 }
  
  /*signIn=async()=>
  {
    await AsyncStorage.setItem('userToken', 'punyaslok') // This AsyncStorage store the token on the device, so that a user can be signed in when he/she revisits
    this.props.navigation.navigate('App')
  }
  Add persistent sign in with async storage like functionality 
  */
 async function _loginWithEmail(email, password, props){
  try {
     await firebase
       .auth()
       .signInWithEmailAndPassword(email, password)
       .then(res => {
           console.log(res.user.email);
          
    });
} catch (error) {
   
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("ERROR_CODE"+errorCode);
    console.log("ERROR_MESSAGE"+errorMessage);

    //props.navigation.navigate('SignUpScreen')
                if(errorCode==="auth/user-not-found")
                {
                    Toast.show('Sign up')
                    console.log("SignUp")
                    //actions.setSubmitting(false);
                    props.navigation.navigate('SignUpScreen');

                }
                else if(errorCode==="auth/wrong-password")
                {
                  //actions.setSubmitting(false);
                  Toast.show('wrong password (OR) Previously logged In with FB')
                }
                else if(errorCode==='auth/user-disabled')
                {
                  //actions.setSubmitting(false);
                  Toast.show("You have been temporarily disabled")
                  
                }
                else if(errorCode === "auth/unknown")
                {
                  Toast.show("Too many unsuccessful attempts.Please try again later");
                }
  }
  finally {
    setLoading(false);
  }
}
      return (
        
        <Formik
      initialValues={{ email: '', password: '' }}
      onSubmit={(values, actions) => {
        setLoading(true);
        //alert(JSON.stringify(values));
        setLoading(true);
        const trimmedEmail = values.email.trim();
        const trimmedPassword = values.password.trim();
        console.log("EMAIL : ",values.email)
        //setUserEmail(trimmedEmail);
        dispatch({type:"SET_SIGNUP_MAIL",payload:trimmedEmail});
        _loginWithEmail(trimmedEmail, trimmedPassword, props)
        actions.setSubmitting(false);
        
              }  
      }
      validationSchema={validationSchema}
    >   
    {
      formikProps => (
      

      <SafeAreaView  style={styles.backgroundContainer} >
      <View style={{ }}>

      {/* <TouchableOpacity> */}
          <Image
            resizeMode="contain"
            source={require('../assets/images/papyrusLogo.png')}
            style={{ width: WIDTH/3, height: HEIGHT/20,paddingBottom:HEIGHT/4 }}
          />
        {/* </TouchableOpacity>       */}
         </View>
        <View style={styles.positions}>
          <TextInput style={styles.Input}   placeholder={'Email'} placeholderTextColor={'black'} underlineColorAndroid='transparent'
            onChangeText={formikProps.handleChange('email')
                         }/> 
          <Text style={{ color: 'rgba(255, 255, 255, 0.5)', paddingLeft:45 ,fontFamily:'sans-serif-light' , fontSize:12 }}>
          {formikProps.touched.email && formikProps.errors.email}
          </Text>

        </View>
        <View style={styles.positions}>
        {/* <PasswordTextBox icon="lock" label="Old Password" onChange={(v) => this._updateState('old', v)} /> */}
        <TextInput style={styles.Input} placeholder={'Password'} placeholderTextColor={'black'} underlineColorAndroid='transparent'
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
              
                
                <TouchableOpacity style={{ alignItems: 'center', justifyContent:'center', height:45, width:WIDTH -55, borderRadius:15, backgroundColor:'rgba(0, 0, 0, 0.7)', borderColor:'rgb(218,165,32)', borderWidth: 0.4 }}
                 onPress={() => {
                   //setLoading(true); 
                 handleLogin(formikProps)}} >
                   {
                     loading === true
                     ?
                     <ActivityIndicator/>
                     :
                     <Text style={{ alignItems: 'center', fontFamily:'century-gothic', color:'rgb(218,165,32)', justifyContent:'center'}} >Login</Text>
                   }
                </TouchableOpacity>

                          
              </View>
          )}
        

            <View>
            <TouchableOpacity onPress={() => {
              try{
                const trimmedEmail = userEmail.trim();
                console.log("userEmail: ",userEmail);
                console.log("trimmedEmail: ",trimmedEmail);
             
                props.firebase._passwordReset(trimmedEmail)
             Toast.show('A password reset mail has been sent to your emailID.')
            //   :
            //  Toast.show('Please enter your email ID') }
              }
              catch(error)
              {
                var errorCode = error.code;
                if(errorCode==="auth/user-not-found")
                {
                    Toast.show('Sign up')
                    console.log("SignUp")
                    
                    //actions.setSubmitting(false);
                    props.navigation.navigate('SignUpScreen',{userEmail : userEmail})

                }
                
                  console.log("ERROR IN FORGOT PASSWORD",error);
              }
              }} style={{paddingTop:10 }}>
           <Text style={{ fontFamily:'sans-serif-light', color:'rgb(218,165,32)', fontSize:12 }}>Forgot your Password?</Text>
         </TouchableOpacity>
            </View>
            <View style={{ paddingTop:10 }}>
            
           <Text style={{ fontFamily:'sans-serif-light', color:'white',  fontSize:12 }}>OR Login with </Text>
         
            </View>

            <View style={{paddingBottom:HEIGHT/40,flexDirection:'row' ,justifyContent:'center'}}>
            <TouchableOpacity style={{paddingTop:20 }} onPress={()=>{onFBLoginOrRegister()}}>
         <Icon name="facebook-square" size={30} style={{color:'rgba(255, 255, 255, 0.6)'}}/>
         </TouchableOpacity>
         
            </View>
        <View style={{ flexDirection:'row'}}>
          <View style={{ paddingRight:5}}>
          <Text style={{ fontFamily:'sans-serif-light', color:'white', fontSize:13 }}>Not a Papyrus member yet?</Text>
          </View>
        <TouchableOpacity	onPress={()=>{props.navigation.navigate('SignUpScreen', {userEmail:null})}}>
        <Text style={{ fontFamily:'sans-serif-light', color:'rgb(218,165,32)', fontSize:13 }}>Signup</Text>
       </TouchableOpacity>
        </View>
         </SafeAreaView>)}
         </Formik>
      );
    
  }

export default withFirebaseHOC(SignInScreen);


const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop:HEIGHT/12 ,
    backgroundColor:'#120d02',
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
    borderColor:'rgba(255, 255, 255, 0.8)',
    borderWidth:1,
    fontSize:16, 
    paddingLeft:45, 
    backgroundColor:'rgba(255, 255, 255, 0.9)',
    //color:'black', 
    marginHorizontal:25, 
    fontFamily:'sans-serif-light'
  },
   positions:
  {
paddingBottom: 10
  }, 
  image: {
    //flex: 1,
    width: 150,
    height: 150,
    resizeMode: 'contain',
    //paddingLeft: 20
    
}
  
});


