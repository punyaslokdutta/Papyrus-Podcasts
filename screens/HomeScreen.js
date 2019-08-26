

import React, {Component} from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, Platform, StatusBar,TouchableOpacity, ScrollView, Image,Dimensions, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import FontAwesome, { Icons } from 'react-native-fontawesome';
import CardComponent from './components/Home/CardComponent'
import {Container, Content, Card, Button} from 'native-base'
import CardComp from './components/Home/CardComp';
import PodcastPlayer from './PodcastPlayer'
import BookCard from './components/Home/BookCard'
import { FlatList } from 'react-native-gesture-handler';
import AuthorCard from './components/Home/AuthorCard'


var images=[require('../assets/Westeros.jpg'),
require('../assets/harrypotter.jpeg'),
require('../assets/Hotelcalifornia.jpg'),
require('../assets/hungergames.jpeg'),
require('../assets/Romance.jpeg'),
require('../assets/davincicode.jpg'),
require('../assets/Mystery.jpeg'),
require('../assets/harrypotter.jpeg'),
require('../assets/Hotelcalifornia.jpg'),
require('../assets/hungergames.jpeg'),
require('../assets/Romance.jpeg'),
require('../assets/davincicode.jpg'),
require('../assets/Mystery.jpeg'),


]

const Bookcards = [
    {
        Book: "The DavinCi Code",
        Storyteller:"punyaslok_dutta",
        ImageUri: require('../assets/davincicode.jpg'),
        AudioUri: " ",
    
    
      },
      {
        Book: "The boggart in the wardrobe",
        Storyteller:"emily_dickson",
        ImageUri: require('../assets/harrypotter.jpeg'),
        AudioUri: " ",
        
    
      },
      {
        Book: "Hotel California (Eagles)",
        Storyteller:"john01paulson",
        ImageUri: require('../assets/Hotelcalifornia.jpg'),
        AudioUri: " ",
      },
   
  ]

var Userobjects=[
  {
    Book: "The song of ice and fire",
    Storyteller:"jackson.may",
    ImageUri: require('../assets/Westeros.jpg'),
    AudioUri: " ",


  },
  {
    Book: "The boggart in the wardrobe",
    Storyteller:"emily_dickson",
    ImageUri: require('../assets/harrypotter.jpeg'),
    AudioUri: " ",
    

  },
  {
    Book: "Hotel California (Eagles)",
    Storyteller:"john01paulson",
    ImageUri: require('../assets/Hotelcalifornia.jpg'),
    AudioUri: " ",
  },

  {
    Book: "The Hunger Games",
    Storyteller:"mitchelle_oli",
    ImageUri: require('../assets/hungergames.jpeg'),
    AudioUri: " ",
  },

  {
    Book: "The DavinCi Code",
    Storyteller:"punyaslok_dutta",
    ImageUri: require('../assets/davincicode.jpg'),
    AudioUri: " ",
  }
]



var {width, height}=Dimensions.get('window')

class HomeScreen extends React.Component {
  constructor(props)
  {
    super(props)
    {

      //this.renderHeader = this.renderHeader.bind(this);
      this.state={
        Bookcards : Bookcards
      }
    }
  }



    componentWillMount()
    {
        this.startHeaderHeight = 60
        if(Platform.OS=='Android')
        {
            this.startHeaderHeight= StatusBar.currentHeight
        }
    }

    onPressed()
    {
        console.log(Info)
        
        /*this.props.navigation.navigate(
            'PodcastPlayer',
            {ImageUri: ImageUri}
          );*/
    }
    renderDots=()=>
    {
      return( <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {/*your ScrollView code here*/}
      <View
        style={{ flexDirection: 'row' }} // this will layout our dots horizontally (row) instead of vertically (column)
        >
        {Bookcards.map((_, i) => { // the _ just means we won't use that parameter
          return (
            <Animated.View // we will animate the opacity of the dots later, so use Animated.View instead of View here
              key={i} // we will use i for the key because no two (or more) elements in an array will have the same index
              style={{ height: 10, width: 10, backgroundColor: '#595959', margin: 8, borderRadius: 5 }}
            />
          );
        })}
      </View>
    </View>)
    }
    renderHeader=()=>
    {
      return(
      <View style={styles.AppHeader}>
         <TouchableOpacity onPress={()=>this.props.navigation.toggleDrawer()}>
        <View style={{paddingLeft: 15,paddingRight:10 ,paddingVertical:18} }>
          <Icon name="bars" size={22} style={{color:'white'}}/>
        </View>
        </TouchableOpacity>
        <View>
        <Text style={{fontFamily:'sans-serif-light', color:'white', paddingLeft:30, fontSize:24, paddingTop:12}}>PAPYRUS PODCASTS</Text>
        </View>

        </View>
      )
    }
   
    renderSectionBooks=()=>
    { 
      return Bookcards.map((Info, index)=> 
      {
          return (<BookCard Info={Info} key={index} index={index} navigation={this.props.navigation} onPress={()=> this.onPressed() }/>)

      })

    }

    renderSectionPodcasts=()=>
    {
      return Userobjects.map((Info, index)=>
      {
        return (
          <CardComp Info={Info} key={index} index={index} navigation={this.props.navigation} onPress={()=> this.onPressed() }/>           
        )


      })
    }
    renderSectionAuthors=()=>
    {
      return Bookcards.map((Info, index)=>
      {
          return (<AuthorCard Info={Info} key={index} index={index} navigation={this.props.navigation} onPress={()=> this.onPressed() }/>)

      })

    }

    
   
    render() {
      return (
        

        <SafeAreaView style={{flex:1, backgroundColor:'#F5FCFF'}}>
                  {this.renderHeader()} 
        <ScrollView  scrollEventThrottle={16} style={{backgroundColor: '#F5FCFF'}} >
        <View style={{flex:1 , backgroundColor:'white', paddingTop:10}}>
      <Text style={{fontSize:28, fontWeight:'200', paddingHorizontal: 20,paddingTop:10,paddingBottom:10,   textShadowColor:'black',fontFamily:'sans-serif-light'}}>
          Record Book Podcasts
      </Text>
      </View>
        <ScrollView horizontal={true}  showsHorizontalScrollIndicator={false} style={{paddingTop:20}}>
       
        <View style={{flexDirection:'row' , flexWrap:'wrap', paddingTop:5}}>
                  {this.renderSectionBooks()}
       </View>
        </ScrollView>
        <View>
        {this.renderDots()}
        </View>
        <View style={{flex:1 , backgroundColor:'white', paddingTop:10, paddingBottom: 10}}>
      <Text style={{fontSize:28, fontWeight:'200', paddingHorizontal: 20,paddingTop:10,  textShadowColor:'black',fontFamily:'sans-serif-light'}}>
          Discover Podcasts
      </Text>
      </View>
        <View style={{flexDirection:'row' , flexWrap:'wrap', paddingTop:5}}  >
          {this.renderSectionPodcasts()}
        </View>
        <ScrollView horizontal={true}  showsHorizontalScrollIndicator={false} style={{paddingTop:20}}>
        <View style={{flexDirection:'row' , flexWrap:'wrap', paddingTop:5}}>
                  {this.renderSectionAuthors()}
       </View>
        </ScrollView>
        </ScrollView>

        
        </SafeAreaView>
      );
    }
  }

export default HomeScreen;


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
 backgroundColor: '#101010', 
  },
  storie: {
    height: 50,
    width: 50,
    borderRadius: 60,
    marginLeft: 7,
    borderWidth: 1,
    borderColor: '#dddddd',
}
});


