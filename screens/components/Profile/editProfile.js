

import React, {Component} from 'react';
import { TouchableOpacity,StyleSheet, View, Button, SafeAreaView, Dimensions, Image, TextInput, Platform , KeyboardAvoidingView, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import FontAwesome, { Icons } from 'react-native-fontawesome';
import {Block , Text }  from '../categories/components/'


const { width, height } = Dimensions.get('window');
import{theme, mocks} from '../categories/constants/'





const options = {
  title: 'Change Profile Picture',
  chooseFromLibraryButtonTitle: 'Select from Library'
};
class editProfile extends Component {
  constructor(props)
  {
    super(props)
    this.state={
      ProfileImage: null, 
      Name: '', 
      username:'',
      website: '',  
      Bio: '', 
      editing: null,
      profile: {},
    }
  }
  componentDidMount() {
    this.setState({ profile: this.props.profile });
  }

  handleEdit(name, text) {
    const { profile } = this.state;
    profile[name] = text;

    this.setState({ profile });
  }

  toggleEdit(name) {
    const { editing } = this.state;
    this.setState({ editing: !editing ? name : null });
  }

  renderEdit(name) {
    const { profile, editing } = this.state;

    if (editing === name) {
      return (
        <TextInput
          defaultValue={profile[name]}
          onChangeText={text => this.handleEdit([name], text)}
        />
      )
    }

    return <Text bold>{profile[name]}</Text>
  }

  // uploadImage=()=>
  // {
  //   ImagePicker.showImagePicker(options, (response) => {
  //     console.log('Response = ', response);
    
  //     if (response.didCancel) {
  //       console.log('User cancelled image picker');
  //     } else if (response.error) {
  //       console.log('ImagePicker Error: ', response.error);
  //     } else if (response.customButton) {
  //       console.log('User tapped custom button: ', response.customButton);
  //     } else {
  //       const source = { uri: response.uri };
    
  //       // You can also display the image using data:
  //       // const source = { uri: 'data:image/jpeg;base64,' + response.data };
    
  //       this.setState({
  //         ProfileImage: source,
  //       });
  //     }
  //   });
  // }
   
    render() {
      const { navigation } = this.props;
      const { profile, editing } = this.state;
      return (
        <KeyboardAvoidingView style={styles.container}  enabled>
        <SafeAreaView style={{flex:1, backgroundColor:'#ffffff'}}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ paddingVertical: theme.sizes.base * 1, paddingBottom:theme.sizes.base * 3 }}
        >
        
         <View style={styles.AppHeader}>
       
        <View style={{paddingLeft: width/12 ,paddingVertical:height/20, flexDirection:'row'} }>
        <TouchableOpacity onPress={()=>this.props.navigation.goBack(null)}>
          <Icon name="times" size={20} style={{color:'black'}}/>
          </TouchableOpacity>
          <Text style={{fontFamily:'san-serif-light', color:'black', paddingLeft:(width*7)/35, paddingRight:(width*7)/30, fontSize:20}}>Edit Profile</Text>
          <TouchableOpacity >
          <Icon name="check" size={20} style={{color:'black'}}/>
          </TouchableOpacity>
        </View>
       
        </View>  

      <View style={{ alignItems:'center'}}> 
      <View style={{  paddingVertical:height/50, flexDirection:'column'} }>
      <View>
      <Image source={this.state.ProfileImage} style={{width:height/6, height:height/6, borderRadius:height/6, borderColor: 'black', borderWidth :1}}/>
      </View>


        <View style={{ paddingTop:width/15}}>

                <TouchableOpacity style={{ alignItems: 'center', justifyContent:'center', height:height/16, width:height/6, borderRadius:15, borderColor:'black', borderWidth: 1 }}>
            <Text style={{ alignItems: 'center', fontFamily:'sans-serif-light', color:'black', justifyContent:'center'}} >Edit</Text>
                </TouchableOpacity>
        </View>  
      </View> 

      </View> 
      <Block style={styles.inputs}>
            <Block row space="between" margin={[10, 0]} style={styles.inputRow}>
              <Block>
                <Text gray2 style={{ marginBottom: 10 }}>Name</Text>
                {this.renderEdit('Name')}
              </Block>
              <Text medium primary onPress={() => this.toggleEdit('Name')}>
                {editing === 'Name' ? 'Save' : 'Edit'}
              </Text>
            </Block>
            <Block row space="between" margin={[10, 0]} style={styles.inputRow}>
              <Block>
                <Text gray2 style={{ marginBottom: 10 }}>Username</Text>
                {this.renderEdit('username')}
              </Block>
              <Text medium primary onPress={() => this.toggleEdit('username')}>
                {editing === 'username' ? 'Save' : 'Edit'}
              </Text>
            </Block>
            <Block row space="between" margin={[10, 0]} style={styles.inputRow}>
              <Block>
                <Text gray2 style={{ marginBottom: 10 }}>Website</Text>
                {this.renderEdit('website')}
              </Block>
              <Text medium primary onPress={() => this.toggleEdit('website')}>
                {editing === 'website' ? 'Save' : 'Edit'}
              </Text>
            </Block>
            <Block row space="between" margin={[10, 0]} style={styles.inputRow}>
              <Block>
                <Text gray2 style={{ marginBottom: 10 }}>Bio</Text>
                {this.renderEdit('Bio')}
              </Block>
              <Text medium primary onPress={() => this.toggleEdit('Bio')}>
                {editing === 'Bio' ? 'Save' : 'Edit'}
              </Text>
            </Block>
          </Block>
     

      



          </ScrollView>


      
          
          </SafeAreaView>
        </KeyboardAvoidingView>
      );
    }
  }

export default editProfile;
editProfile.defaultProps = {
  profile: mocks.profile,
}


const styles = StyleSheet.create({
  AppHeader:
  {
 flexDirection:'row',
 backgroundColor: 'white'
  },
  container: {
    flex: 1,
    //justifyContent: 'center',
   // alignItems: 'center',
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
      color:'black',
      height: height/6,
      borderWidth: 2,
      borderColor: '#9E9E9E',
      borderRadius: 10 ,
      backgroundColor : "white",
      height: height/6, 
      width:(width*3)/4, 
      paddingLeft:10,
      paddingRight:10
       
      }, 
      TextInputStyleClass2:{
 
        //textAlign: 'center',
        fontFamily:'san-serif-light',
        fontStyle:'italic', 
        color:'black',
        borderWidth: 2,
        borderColor: '#9E9E9E',
        borderRadius: 10 ,
        backgroundColor : "white",
        width:(width*3)/4, 
        paddingLeft:10,
        height: height/18, 
        paddingRight:10, 
         
        }, 
        inputs: {
          marginTop: theme.sizes.base * 0.7,
          paddingHorizontal: theme.sizes.base * 2,
        }
});
