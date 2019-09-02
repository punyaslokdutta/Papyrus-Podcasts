

import React, {Component} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import FontAwesome, { Icons } from 'react-native-fontawesome';
import { Container, Header, Left, Right, Content , Button,Card, CardItem, Thumbnail, Body} from 'native-base';
import PodcastPlayer from './PodcastPlayer'
import Podcast from './components/Home/Podcast'


const mocks = [
  {
    id: 1,
    user: {
      name: 'Lelia Chavez',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    saved: true,
    date: "12/7/2019",
    location: 'Santorini, Greece',
    temperature: 34,
    title: 'Santorini',
    description: 'Santorini is one of the Cyclades islands in the Aegean Sea. It was devastated by a volcanic eruption in the 16th century BC, forever shaping its rugged landscape. The whitewashed, cubiform houses of its 2 principal towns, Fira and Oia, cling to cliffs above an underwater caldera (crater). They overlook the sea, small islands to the west and beaches made up of black, red and white lava pebbles.',
    rating: 4.3,
    reviews: 3212,
    preview: 'https://www.facebook.com/photo.php?fbid=2032547933441692&set=a.437106322985869&type=3&theater',
    images: [
      'https://images.unsplash.com/photo-1507501336603-6e31db2be093?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507501336603-6e31db2be093?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507501336603-6e31db2be093?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507501336603-6e31db2be093?auto=format&fit=crop&w=800&q=80',
    ]
  },
  {
    id: 2,
    user: {
      name: 'Lelia Chavez',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    saved: false,
    date: "12/7/2019",
    location: 'Loutraki, Greece',
    temperature: 34,
    title: 'Loutraki',
    description: 'This attractive small town, 80 kilometers from Athens',
    rating: 4.6,
    reviews: 3212,
    preview: 'https://images.unsplash.com/photo-1458906931852-47d88574a008?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1458906931852-47d88574a008?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1446903572544-8888a0e60687?auto=format&fit=crop&w=800&q=80',
    ]
  },
  {
    id: 3,
    user: {
      name: 'Lelia Chavez',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    saved: true,
    date: "12/7/2019",
    location: 'Santorini, Greece',
    temperature: 34,
    title: 'Santorini',
    description: 'Santorini - Description',
    rating: 3.2,
    reviews: 3212,
    preview: 'https://images.unsplash.com/photo-1507501336603-6e31db2be093?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1507501336603-6e31db2be093?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507501336603-6e31db2be093?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507501336603-6e31db2be093?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507501336603-6e31db2be093?auto=format&fit=crop&w=800&q=80',
    ]
  },
  {
    id: 4,
    user: {
      name: 'Lelia Chavez',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    location: 'Loutraki, Greece',
    saved: true,
    date: "12/7/2019",
    temperature: 34,
    title: 'Loutraki',
    description: 'This attractive small town, 80 kilometers from Athens',
    rating: 5,
    reviews: 3212,
    preview: 'https://images.unsplash.com/photo-1458906931852-47d88574a008?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1458906931852-47d88574a008?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1446903572544-8888a0e60687?auto=format&fit=crop&w=800&q=80',
    ]
  },
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
        activeIndex:0,
        mocks:mocks
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
      return mocks.map((item, index)=>
      {
        return (
          <Podcast item={item} index={index} key ={index} navigation={this.props.navigation}/>
        )
      })
    }
    renderSectionTwo=()=>
    {
      return mocks.map((item, index)=>
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
