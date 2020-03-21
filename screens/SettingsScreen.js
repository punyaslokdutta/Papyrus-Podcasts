import React, { Component, useState } from 'react'
import { Image, StyleSheet, ScrollView, TextInput, TouchableOpacity , View} from 'react-native'
import Slider from 'react-native-slider';
import firestore from '@react-native-firebase/firestore'
//import { Divider, Button, Block, Text, Switch } from '../components';
import {  Block, Text } from '../screens/components/categories/components/';
import { Divider, Button, Switch } from '../screens/components/categories/components/';
import {withFirebaseHOC} from './config/Firebase'
import { theme, mocks } from '../screens/components/categories/constants/';
import Icon from 'react-native-vector-icons/FontAwesome'
import { firebase } from '@react-native-firebase/functions';
import {useSelector,useDispatch} from 'react-redux'

const SettingsScreen = (props) => {

  const dispatch = useDispatch();  
  const userid = props.firebase._getUid();
  const privateDataID = "private" + userID;
  
  const accountName = useSelector(state=>state.userReducer.name)
  const userName = useSelector(state=>state.userReducer.userName)
  const accountEmail = useSelector(state=>state.userReducer.email)
  const accountPicURI = useSelector(state=>state.userReducer.displayPictureURL)
  
  const [editing,setEditing] = useState(null);
  const [notifications,setNotifications] =useState(true);

  async function handleEdit(name, text) {
    console.log("IN Handle Edit function");
    switch(name)
    {
      case 'account':
        dispatch({type:'CHANGE_NAME',payload:text});
        break;
      case 'username':
        dispatch({type:'CHANGE_USER_NAME',payload:text});
        break;
      default:
        break;
    }
  }

   async function toggleEdit(name) {
    const f = !editing ? name : null;
    if(f == null) // On press of 'Save' Button
    {
      switch(name)
      {
        case 'account':
          await firestore().collection('users').doc(userid).collection('privateUserData').doc(privateDataID).set({  // change in actual doc
            name : accountName
           },{ merge:true })

          const instance = firebase.app().functions("asia-northeast1").httpsCallable('changeUserNameInPodcastsAsiaEast');
          try 
          {          
            await instance({ // change in podcast docs created by  user
              changedName : accountName
            });
          }
          catch (e) 
          {
            console.log(e);
          }
          break;
        case 'username':
          await firestore().collection('users').doc(userid).collection('privateUserData').doc(privateDataID).set({ // change in actual doc
            username : userName
        },{ merge:true })
          break;
        default:
          break;
      }
    }
    setEditing(f);
  }

  function renderEdit(name) {
   // const { profile, editing } = this.state;
    var val = 9;
    switch(name)
    {
      case 'account':
        val = accountName;
        break;
      case 'username':
        val = userName;
        break;
      default:
        break;
    }

    if (editing === name) {
      
      return (
        <TextInput
          defaultValue={val}
          onChangeText={async(text) => handleEdit(name, text)}
        />
      )
    }
  return <Text bold>{val}</Text>
  }
 
    return (
      <Block>
        <Block flex={false} row center space="between" style={styles.header}>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Image
            resizeMode="contain"
            source={"../assets/icons/Back.png"}
            style={{ width: 20, height: 24, marginRight: theme.sizes.base  }}
          />
        </TouchableOpacity>
          <Text h1 bold>Settings</Text>
          <Button>
            <Image
              source={{uri:accountPicURI}}
              style={styles.avatar}
            />
          </Button>
        </Block>

        <ScrollView showsVerticalScrollIndicator={false}>

          <Block style={styles.inputs}>
          <Block>
                <Text h3  bold style={{ marginBottom: 10 }}>GENERAL</Text>
              </Block>
            <Block row space="between" margin={[10, 0]} style={styles.inputRow}>
              <Block>
                <Text gray2 style={{ marginBottom: 10 }}>Account</Text>
                {renderEdit('account')}
              </Block>
              <Text medium primary onPress={() => toggleEdit('account')}>
                {editing === 'account' ? 'Save' : 'Edit'}
              </Text>
            </Block>
            <Block row space="between" margin={[10, 0]} style={styles.inputRow}>
              <Block>
                <Text gray2 style={{ marginBottom: 10 }}>Username</Text>
                {renderEdit('username')}
              </Block>
              <Text medium primary onPress={() => toggleEdit('username')}>
                {editing === 'username' ? 'Save' : 'Edit'}
              </Text>
            </Block>
            <Block row space="between" margin={[10, 0]} style={styles.inputRow}>
              <Block>
                <Text gray2 style={{ marginBottom: 10 }}>E-mail</Text>
                <Text bold>{accountEmail}</Text>
              </Block>
            </Block>
          </Block>

          <Divider margin={[ theme.sizes.base * 2]} />
          
          <Block style={styles.toggles}>
            <Block row center space="between">
              <Text gray>Push Notifications</Text>
              <Switch
                value={notifications}
                //onValueChange={value => this.setState({ notifications: value })}
              />
            </Block>
            
          </Block>
          

          <Divider />
          <Block style={{ 
    paddingHorizontal: theme.sizes.base * 2
  }}>
                <Text h3 bold >SUPPORT</Text>
                
              </Block>
              <Block >
              <Divider margin={[ theme.sizes.base * 2]} />
          
          <Block style={styles.toggles}>
            <Block row center space="between" >
              <Text black>Report a Problem</Text>
              <TouchableOpacity >
        <View style={{paddingLeft: 15,paddingRight:10 } }>
          <Icon name="chevron-right" size={20} style={{color:'#101010'}}/>
        </View>
        </TouchableOpacity>

              
            </Block> 
          </Block>
          
          

          <Divider />
          <Block style={styles.toggles}>
            <Block row center space="between" >
              <Text black>Follow us on Instagram</Text>
              <TouchableOpacity >
        <View style={{paddingLeft: 15,paddingRight:10 } }>
          <Icon name="chevron-right" size={20} style={{color:'#101010'}}/>
        </View>
        </TouchableOpacity>

              
            </Block> 
          </Block>
          <Divider margin={[ theme.sizes.base * 2]} />
          <Block style={styles.toggles}>
            <Block row center space="between" >
              <Text black>Follow us on Twitter</Text>
              <TouchableOpacity >
        <View style={{paddingLeft: 15,paddingRight:10 } }>
          <Icon name="chevron-right" size={20} style={{color:'#101010'}}/>
        </View>
        </TouchableOpacity>

              
            </Block> 
          </Block>
          <Divider />
          <Block style={{ 
    paddingHorizontal: theme.sizes.base * 2
  }}>
                <Text h3 bold >ABOUT</Text>
                
              </Block>
              <Divider margin={[ theme.sizes.base * 2]} />
          
          <Block style={styles.toggles}>
            <Block row center space="between" >
              <Text black>Rate us on Play Store</Text>
              <TouchableOpacity >
        <View style={{paddingLeft: 15,paddingRight:10 } }>
          <Icon name="chevron-right" size={20} style={{color:'#101010'}}/>
        </View>
        </TouchableOpacity>
            </Block> 
          </Block>
          <Divider />

          <Block style={styles.toggles}>
            <Block row center space="between" >
              <Text black>Terms of Service</Text>
              <TouchableOpacity >
        <View style={{paddingLeft: 15,paddingRight:10 } }>
          <Icon name="chevron-right" size={20} style={{color:'#101010'}}/>
        </View>
        </TouchableOpacity>              
            </Block> 
          </Block>
          <Divider margin={[ theme.sizes.base * 2]} />
          
          <Block style={styles.toggles}>
            <Block row center space="between" >
              <Text black>Privacy Policies</Text>
              <TouchableOpacity >
        <View style={{paddingLeft: 15,paddingRight:10 } }>
          <Icon name="chevron-right" size={20} style={{color:'#101010'}}/>
        </View>
        </TouchableOpacity>  
            </Block> 
          </Block>
          <Divider />
              </Block>
        </ScrollView>
      </Block>
    )
  }

export default withFirebaseHOC(SettingsScreen);

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: theme.sizes.base * 2,
  },
  avatar: {
    height: theme.sizes.base * 2.2,
    width: theme.sizes.base * 2.2,
    borderRadius: theme.sizes.base * 2.2, 
    
    
  },
  inputs: {
    marginTop: theme.sizes.base * 0.7,
    paddingHorizontal: theme.sizes.base * 2,
  },
  inputRow: {
    alignItems: 'flex-end'
  },
  sliders: {
    marginTop: theme.sizes.base * 0.7,
    paddingHorizontal: theme.sizes.base * 2,
  },
  thumb: {
    width: theme.sizes.base,
    height: theme.sizes.base,
    borderRadius: theme.sizes.base,
    borderColor: 'white',
    borderWidth: 3,
    backgroundColor: theme.colors.secondary,
  },
  toggles: {
    paddingHorizontal: theme.sizes.base * 2,
  }
})