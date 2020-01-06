

import React, {Component} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import FontAwesome, { Icons } from 'react-native-fontawesome';
import { Container, Header, Left, Right, Content , Button,Card, CardItem, Thumbnail, Body} from 'native-base';
import CardComponent from './components/Home/CardComponent'
import PodcastPlayer from './PodcastPlayer'



var images=[require('../assets/Westeros.jpg'),
require('../assets/harrypotter.jpeg'),
require('../assets/Hotelcalifornia.jpg'),
require('../assets/hungergames.jpeg'),
require('../assets/Romance.jpeg'),
require('../assets/davincicode.jpg'),
require('../assets/Mystery.jpeg'),


]

var images2=[require('../assets/Westeros.jpg'),
require('../assets/Hotelcalifornia.jpg'),
require('../assets/boggart.jpg'),
require('../assets/hungergames.jpeg'),
require('../assets/davincicode.jpg'),
require('../assets/Romance.jpeg'),
,
require('../assets/Mystery.jpeg'),


]
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
        activeIndex:0
      }
    
     }
   }
        
    
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
      return images.map((image, index)=>
      {
        return (
          <View key={index} >
          <TouchableOpacity   onPress={()=>this.props.navigation.navigate('PodcastPlayer', {image})}style={[{width:(width) / 3 }, {height:(width) / 3 },{paddingLeft:2},{paddingRight:2} ,{marginBottom:2}]}>
          <Image style={{flex:1, width: undefined, height:  undefined, borderRadius:15, padding:10}} source={image}/>
          </TouchableOpacity>
          
          </View>
        )
      })
    }
    renderSectionTwo=()=>
    {
      return images2.map((image, index)=>
      {
        return (
          
          <View key={index} style={[{width:(width) / 3 }, {height:(height) / 3 },index%3!==0?{paddingLeft:2}:{paddingLeft:0}, {marginBottom:2}]}>
        
          <Image style={{flex:1, width: undefined, height:  undefined, borderRadius:15, padding:10}} source={image}/>
          
          </View>
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
         
          {this.renderSectionTwo()}
          </View>
        )
      }
      else if(this.state.activeIndex==1)
      {
        return (
          
          <View style={{flexDirection:'row' , flexWrap:'wrap'}}>
         
          {this.renderSectionOne()}
          </View>
        )
      }
      else if(this.state.activeIndex==2)
      {
        return (
          <ScrollView  scrollEventThrottle={16} style={{backgroundColor: '#F5FCFF'}}>
        
          <Content>
            <CardComponent/>
            <CardComponent/>
            <CardComponent/>
            
            
          </Content>
        

        

        
        
        
            
                
            </ScrollView>
        )
      }
    }
  
   
    render() {
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
                <Image source={require('../assets/khaled.jpeg')} style={{width:100, height:100, borderRadius:50 }}/>
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
          <Button bordered dark style={{flex:1, marginTop:10, justifyContent:'center', height:30, width:100, borderRadius:5}} onPress={()=>this.props.navigation.navigate('PodcastPlayer')}>
          <Text>Edit Profile</Text>
          </Button>

          </View>
          <View style={{paddingTop:30}}>
            <View style={{flexDirection :'row', justifyContent:'space-around', borderTopWidth:1, borderTopColor:'#eae5e5'}}>
            <Button  transparent onPress={()=>this.segmentClicked(0)} active={this.state.activeIndex==0}>
            <Icon name='newspaper-o' size={20} style={[this.state.activeIndex == 0 ? {color:'black'} : {color:'grey'}]}/>

            </Button>
            <Button transparent onPress={()=>this.segmentClicked(1)} active={this.state.activeIndex==1}>
            <Icon name='book' size={20} style={[this.state.activeIndex == 1 ? {color:'black'} : {color:'grey'}]} />
            </Button>



            <Button transparent onPress={()=>this.segmentClicked(2)} active={this.state.activeIndex==2}>
            <Icon name='bookmark-o' size={20} style={[this.state.activeIndex == 2 ? {color:'black'} : {color:'grey'}]}/>

            </Button>

            </View>
           
            {this.renderSection()}
            
          </View>
        </Content>
        
        </Container>
      );
    }
  }

export default Profile;


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
