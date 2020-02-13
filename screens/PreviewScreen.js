import React, {Component} from 'react';
import { TouchableOpacity,StyleSheet, Text, View, Button, SafeAreaView, Dimensions, Image, TextInput, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import FontAwesome, { Icons } from 'react-native-fontawesome';



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
      PodcastImage: null, 
      chapterName: '', 
      BookName:'', 
      AuthorName: '', 
      LanguageSelected:''
    }
  }

 

  
   
    render() {
      
      const { navigation } = this.props;
      const BookName=navigation.getParam('BookName', null);
      const chapterName=navigation.getParam('ChapterName', null);
      const AuthorName=navigation.getParam('AuthorName', null)
      const LanguageSelected=navigation.getParam('LanguageSelected','English ')
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

      <View style={{ alignItems:'center'}}> 
      <View style={{  paddingVertical:height/50, flexDirection:'column'} }>
      <View>
      <Image source={this.state.PodcastImage} style={{width:height/6, height:height/6, borderRadius:30, borderColor: 'white', borderWidth :1}}/>
      </View>


        <View style={{ paddingTop:width/15}}>

                <TouchableOpacity style={{ alignItems: 'center', justifyContent:'center', height:height/16, width:height/6, borderRadius:15, borderColor:'rgba(255, 255, 255, 0.5)', borderWidth: 1 }} >
            <Text style={{ alignItems: 'center', fontFamily:'sans-serif-light', color:'white', justifyContent:'center'}} >Choose Image</Text>
                </TouchableOpacity>
        </View>  
      </View> 
      <View>
      
      </View>
      </View> 
      <View style={{paddingLeft:width/8, paddingBottom: 10}}>
      <TextInput
            style={styles.TextInputStyleClass2}
            underlineColorAndroid="transparent"
            placeholder={"Podcast Title" + this.state.chapterName}
            placeholderTextColor={"black"}
            numberOfLines={1}
            multiline={false}
          />
      </View> 

      <View style={{paddingLeft:width/8}}>
      <TextInput
            style={styles.TextInputStyleClass}
            underlineColorAndroid="transparent"
            placeholder={"A short description of the Book/Chapter" + this.state.chapterName}
            placeholderTextColor={"black"}
            numberOfLines={6}
            multiline={true}
          />
      </View> 



      <View style={{ paddingTop:height/8, alignItems:'center'}}>

                <TouchableOpacity style={{ alignItems: 'center', justifyContent:'center', height:height/16, width:height/6, borderRadius:15, borderColor:'rgba(255, 255, 255, 0.5)', borderWidth: 1 }}
                >
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
         
        }
});