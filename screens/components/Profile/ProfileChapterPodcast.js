import React, {Component} from 'react';
import firestore from '@react-native-firebase/firestore';
import { StyleSheet, Text, View, Image, TouchableOpacity,FlatList,  Dimensions,SafeAreaView, ScrollView,ActivityIndicator} from 'react-native';
import Podcast from '../Home/Podcast'
import {withFirebaseHOC} from '../../config/Firebase'

var {width, height}=Dimensions.get('window')



class ProfileChapterPodcast extends React.Component {
    
    static navigationOptions={
        header:null
    }
   constructor(props)
   {
     super(props)
     {

      this.state={
        chapterPodcasts:[],
        limit:6,
        lastVisibleChapterPodcast:null,
        refreshing:false,
        loading:false, 
        onEndReachedCalledDuringMomentum : true,
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
        this.setState({
          loading: true,
          //refreshing:true
        });
        console.log('Retrieving Data');
        // Cloud Firestore: Query
        const  userid = this.props.firebase._getUid();
        let query3 = await firestore().collectionGroup('Podcasts').where('podcasterID','==',userid);    
        //let documentPodcasts = await query3.where('ChapterName','==',"").orderBy('PodcastID').limit(this.state.limit).get();
        let documentChapterPodcasts = 90;
        try{
         documentChapterPodcasts = await query3.where('isChapterPodcast','==',true).limit(this.state.limit).get();
        //let documentData_podcasts = documentPodcasts.docs.map(document => document.data());
        }
        catch(error)
        {
          console.log(error);
        }
        let documentData_chapterPodcasts = documentChapterPodcasts.docs.map(document => document.data());
        //var lastVisibleBook = this.state.lastVisibleBookPodcast;
  
        var lastVisibleChapter = this.state.lastVisibleChapterPodcast;

        //lastVisibleBook = documentData_podcasts[documentData_podcasts.length - 1].PodcastID;        
        lastVisibleChapter = documentData_chapterPodcasts[documentData_chapterPodcasts.length - 1].PodcastID;
        
          this.setState({
            //bookPodcasts: documentData_podcasts,
            chapterPodcasts: documentData_chapterPodcasts,
            //lastVisibleBookPodcast:lastVisibleBook,
            lastVisibleChapterPodcast: lastVisibleChapter,
            loading:false,
            //refreshing:false
            });
      }
      catch (error) {
        console.log(error);
      }
    };

    retrieveMoreChapterPodcasts = async () => {
      try
       {
 
       this.setState({
         refreshing: true
          }); 
 
          const  userid = this.props.firebase._getUid();
          let additionalQuery = 9;
          try{
           // let documentChapterPodcasts = await query3.where('isChapterPodcast','==',true).limit(this.state.limit).get();
            additionalQuery = await firestore().collectionGroup('Podcasts')
                             .where('podcasterID','==',userid).where('isChapterPodcast','==',true)
                             .orderBy('PodcastID')
                             .startAfter(this.state.lastVisibleChapterPodcast)
                             .limit(this.state.limit);
         
       // Cloud Firestore: Query Snapshot
          
         }
         catch(error)
         {
           console.log(error);
         }
         let documentSnapshots = 98;
         try{
          documentSnapshots = await additionalQuery.get();
         }
         catch(error)
         {
           console.log(error);
         }
         
       // Cloud Firestore: Document Data
       let documentData = documentSnapshots.docs.map(document => document.data());
       this.setState({
        refreshing:false
    });
       // Cloud Firestore: Last Visible Document (Document ID To Start From For Proceeding Queries)
       if(documentData.length != 0)
       {
            let lastVisibleChapter = documentData[documentData.length - 1].PodcastID;
          if(this.state.lastVisibleChapter === lastVisibleChapter)
          {
              this.setState({
                  refreshing:false
              });
          }
          else
          {
            this.setState({
              chapterPodcasts: [...this.state.chapterPodcasts, ...documentData],
              lastVisibleChapterPodcast : lastVisibleChapter,
              refreshing:false
            });
          }
       
       }
       else
       {
          this.setState({
            refreshing:false
            });
       }
       }
       catch(error){
       console.log(error);
       }
     }

    renderData=({item,index})=>
    {
       return(
         <View>
        <Podcast podcast={item} index={index} navigation={this.props.navigation}/>
        </View>
       )
    }

    renderHeader=()=>
    {
      return(
        <View>
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
      </View>
      </View>
      )
    }

    renderFooter = () => {
      try {
        if (this.state.refreshing === true && this.state.chapterPodcasts.length > 6) {
          return (
            //null
            <ActivityIndicator />
          )
        }
        else {
          return null;
        }
      }
      catch (error) {
        console.log(error);
      }
    }


    

    onEndReached = ({ distanceFromEnd }) => {
      if(this.state.chapterPodcasts.length>5)
      {
      if(!this.onEndReachedCalledDuringMomentum){
          this.retrieveMoreChapterPodcasts()
          this.onEndReachedCalledDuringMomentum = true;
      }
  }
}

 
    render() {
      const { navigation } = this.props;
      return (
       
         <View style = {{paddingBottom:20}}>
             <View>
         {/* {this.state.activeIndex ? this.renderSectionTwo() : this.renderSectionOne()} */}
         <FlatList  nestedScrollEnabled={true}
        data={this.state.chapterPodcasts}
        renderItem={this.renderData}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.PodcastID}
        //ListHeaderComponent={this.renderHeader}
         ListFooterComponent={this.renderFooter}
        onEndReached={this.onEndReached}
        onEndReachedThreshold={0.5}
        refreshing={this.state.refreshing}
        onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
      />
         </View>
         </View>
      
      );
    }
  }
  

export default withFirebaseHOC(ProfileChapterPodcast);


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
