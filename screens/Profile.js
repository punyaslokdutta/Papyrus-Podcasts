

import React, {Component} from 'react';
import firestore from '@react-native-firebase/firestore';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import FontAwesome, { Icons } from 'react-native-fontawesome';
import { Container, Header, Left, Right, Content , Button,Card, CardItem, Thumbnail, Body} from 'native-base';
import PodcastPlayer from './PodcastPlayer'
import Podcast from './components/Home/Podcast'
import editProfile from './components/Profile/editProfile'
import firebaseApi from './config/Firebase/firebaseApi'
import {withFirebaseHOC} from '../screens/config/Firebase'






var {width, height}=Dimensions.get('window')



class Profile extends React.Component {
    
    static navigationOptions={
        header:null
    }
   constructor(props)
   {
     super(props)
     {

      this.state={
        activeIndex:0,
        bookPodcasts:[], 
        chapterPodcasts:[]
        // navigation: this.props.navigation,
      }
      }
    
     }
   
     componentDidMount = () => {
      try {
        // Cloud Firestore: Initial Query
        this.retrieveData();
      }
      catch (error) {
        console.log(error);
      }
    };
    

     //retrieve data
     retrieveData = async () => {
      try {
        // Set State: Loading
        console.log('Retrieving Data');
        // Cloud Firestore: Query
        const  userid = this.props.firebase._getUid();
        let query3 = await firestore().collectionGroup('Podcasts').where('podcasterID','==',userid);    
        let query33 = await query3.where('ChapterName','==',"").get();

        let query44 = await query3.where('isChapterPodcast','==',true).get();
        //console.log(query3._docs[0]._data);
        // podcasts_data[ind2] = query3._docs[0]._data;
        // ind2 = ind2 + 1;
        let documentData_podcasts = query33.docs.map(document => document.data());
        let documentData_chapterPodcasts = query44.docs.map(document => document.data());
        // let initialQuery_podcasts = await firestore().collection('Books').doc('7gGB4CjIiGRgB8yYD8N3')
        //                               .collection('Podcasts')
        // // Cloud Firestore: Query Snapshot
        // let documentSnapshots_podcasts = await initialQuery_podcasts.get();
        // // Cloud Firestore: Document Data
         //let documentData_podcasts = documentSnapshots_podcasts.docs.map(document => document.data());
        // Cloud Firestore: Last Visible Document (Document ID To Start From For Proceeding Queries)
       // let lastVisible = documentData_podcasts[documentData_podcasts.length - 1].id;
        // Set State
        this.setState({
          bookPodcasts: documentData_podcasts,
          chapterPodcasts: documentData_chapterPodcasts
        });
      }
      catch (error) {
        console.log(error);
      }
    };


    segmentClicked=(index)=>{
      this.setState({
      activeIndex : index
      })
      
    }

    /*itemPress=()=>
    {
      this.props.navigator.push(
        {
          id:'PodcastPlayer'
        }
      )
    }*/
    renderSectionOne=()=>
    {
      return this.state.bookPodcasts.map((item, index)=>
      {
        return (
          <Podcast item={item} index={index} key ={index} navigation={this.props.navigation}/>
        )
      })
    }
    renderSectionTwo=()=>
    {
      return this.state.chapterPodcasts.map((item, index)=>
      {
        return (
          <Podcast item={item} index={index} key ={index} navigation={this.props.navigation}/>
        )
      })
    }


    renderSection=()=>
    {
      //console.log('hh');
      
      if(this.state.activeIndex==0)
      {
        return (
          <View style={{flexDirection:'row' , flexWrap:'wrap'}}>
         
          {this.renderSectionOne()}
          </View>
        )
      }
      else if(this.state.activeIndex==1)
      {
        return (
          
          <View style={{flexDirection:'row' , flexWrap:'wrap'}}>
         
          {this.renderSectionTwo()}
          </View>
        )
      }
    
    }
  
   
    render() {
      const { navigation } = this.props;
      return (
        <Container style={{flex:1 , backgroundColor:'white'}}>
        
       
          
          
        
        <Content>
        <View style={{flexDirection:'row' ,justifyContent:'flex-end'}}>
          <Icon name="user-plus"  size={24} style={{ paddingTop:10, paddingRight: 10}}/>
          </View>
          <View>
            <View style={{flexDirection:'row'}}>
            <View>
            <Text style={{paddingTop:90, paddingLeft:60, fontSize:24, fontWeight:"bold",  textShadowColor:'black', fontFamily:'sans-serif-light'}}>
              220
            </Text>
            <Text style={{fontFamily:'sans-serif-light', paddingLeft:50}}>Following</Text>
            </View>
            
              <View style={{alignItems:'center', justifyContent:'center', flex:3, paddingTop:60}}>
                <Image source={{ uri: "https://scontent.fdel12-1.fna.fbcdn.net/v/t31.0-8/p960x960/14054441_518163365046457_6005096195143854779_o.jpg?_nc_cat=101&_nc_oc=AQmBj8SY60BCKzMFfvCPGLc1J44zxgFhJqefzYEifezUhkr7pFo29592HYyw6grMQF8&_nc_ht=scontent.fdel12-1.fna&oh=8ff3d0097e442acc84a804041fd0e7ee&oe=5E45429C"}} style={{width:100, height:100, borderRadius:50 }}/>
              </View>
              <View>
              <Text style={{paddingTop:90 , paddingRight:60,  fontSize:24, fontWeight:"bold",  textShadowColor:'black', fontFamily:'sans-serif-light'}}>
              100
            </Text>
            <Text style={{fontFamily:'sans-serif-light', paddingRight:70}}>Followers</Text>
            </View>

          </View>
          </View>
          <View style={{ paddingHorizontal:105,flex:1,marginTop:20}}>
          
          <Text style={{ fontSize:24, fontWeight:"200",  textShadowColor:'black', fontFamily:'sans-serif-light', alignItems:'center', justifyContent:'center'}}>Khaled Housseini</Text>
          

          </View>
          
          <View>
          <Text style={{ fontSize:14, fontWeight:"100",  textShadowColor:'black', fontFamily:'sans-serif-light', alignItems:'center', justifyContent:'center', padding:20}}>I read books on philosophy, economics, computer science, social sciences, geopolitics.</Text>
          </View>

          <View style={{ paddingLeft:145,flex:1}}>
          <Button  style={{flex:1, marginTop:10, justifyContent:'center', height:30, width:100, borderRadius:5, backgroundColor:'white'}} onPress={()=>this.props.navigation.navigate('editProfile')}>
          <Text>Edit Profile</Text>
          </Button>

          </View>
          <View style={{paddingTop:30}}>
            <View style={{flexDirection :'row', justifyContent:'space-around', borderTopWidth:1, borderTopColor:'#eae5e5'}}>
            <Button  transparent onPress={()=>this.segmentClicked(0)} active={this.state.activeIndex==0}>
            <Icon name='book' size={20} style={[this.state.activeIndex == 0 ? {color:'black'} : {color:'grey'}]}/>

            </Button>
            <Button transparent onPress={()=>this.segmentClicked(1)} active={this.state.activeIndex==1}>
            <Icon name='newspaper-o' size={20} style={[this.state.activeIndex == 1 ? {color:'black'} : {color:'grey'}]} />
            </Button>

            </View>
           
            {this.renderSection()}
            
          </View>
        </Content>
        
        </Container>
      );
    }
  }
  

export default withFirebaseHOC(Profile);


const styles = StyleSheet.create({
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
  AppHeader:
  {
 flexDirection:'row',
 backgroundColor: 'white'
  },
});
