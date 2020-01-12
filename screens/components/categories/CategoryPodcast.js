import React, {Component} from 'react';
import firestore from '@react-native-firebase/firestore';
import { StyleSheet, Text, View, Image, TouchableOpacity,FlatList,  Dimensions,SafeAreaView, ScrollView,ActivityIndicator} from 'react-native';
import {withFirebaseHOC} from '../../config/Firebase'
import CategoryPodcastItem from './components/CategoryPodcastItem'

var {width, height}=Dimensions.get('window')

class CategoryPodcast extends React.Component {
    
    static navigationOptions={
        header:null
    }
   constructor(props)
   {
     super(props)
     {

      this.state={
        podcasts:[], 
        limit:5,
        lastVisiblePodcast:null,
        refreshing:false,
        loading:false,
        onEndReachedCalledDuringMomentum : true
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
        });

        console.log('Retrieving Data');
        // Cloud Firestore: Query
        const genre = this.props.navigation.state.params;
        let query3 = await firestore().collectionGroup('Podcasts').where('Genres','array-contains',genre.category);    
        let documentPodcasts = await query3.orderBy('PodcastID').limit(this.state.limit).get();
        let documentDataPodcasts = documentPodcasts.docs.map(document => document.data());

        var lastVisible = this.state.lastVisiblePodcast;
        lastVisible = documentDataPodcasts[documentDataPodcasts.length - 1].PodcastID;        
        //lastVisibleChapter = documentData_chapterPodcasts[documentData_chapterPodcasts.length - 1].PodcastID;
         
        this.setState({
        podcasts: documentDataPodcasts,
        lastVisiblePodcast:lastVisible,
        loading:false
        });
      }
      catch (error) {
        console.log(error);
      }
    };

    retrieveMoreCategoryPodcasts = async () => {
     try
      {

        {console.log("retrieveMoreBookPodcasts starts()")}

      this.setState({
        refreshing: true
         }); 

         const genre = this.props.navigation.state.params;
         let additionalQuery = 9;
         try{
           additionalQuery = await firestore().collectionGroup('Podcasts').where('Genres','array-contains',genre.category)
                            .orderBy('PodcastID')
                            .startAfter(this.state.lastVisiblePodcast)
                            .limit(this.state.limit);
        
      // Cloud Firestore: Query Snapshot
      {console.log("retrieveMoreBookPodcasts afterQuery()")}
         
        }
        catch(error)
        {
          console.log(error);
        }
        let documentSnapshots=9;
        try{
         documentSnapshots = await additionalQuery.get();
        }
        catch(error)
        {
            console.log(error);
        }
        
      // Cloud Firestore: Document Data
      let documentData = documentSnapshots.docs.map(document => document.data());
      // Cloud Firestore: Last Visible Document (Document ID To Start From For Proceeding Queries)
      if(documentData.length != 0)
      {
      let lastVisible = documentData[documentData.length - 1].PodcastID;
       
      if(this.state.lastVisiblePodcast===lastVisible){
          this.setState({
                  refreshing:false
              });
      }
      else
      {
        this.setState({
            podcasts: [...this.state.podcasts, ...documentData],
            //chapterPodcasts: documentData_chapterPodcasts,
            lastVisiblePodcast : lastVisible,
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
        <CategoryPodcastItem podcast={item} index={index} navigation={this.props.navigation}/>
        </View>
       )
    }

   

    renderFooter = () => {
      try {
        if (this.state.refreshing===true) {
          return (
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
      //if(this.state.podcasts.length>5)
      if(!this.onEndReachedCalledDuringMomentum){
          this.retrieveMoreCategoryPodcasts()
          this.onEndReachedCalledDuringMomentum = true;
      }
      
  }
  separator = () => <View style={[styles.separator,{paddingTop:height/96}]} />;
   
    render() {
      const { navigation } = this.props;
      return (
       
         <View style = {{paddingBottom:20}}>
             <View>
                 
         <FlatList nestedScrollEnabled={true}
        data={this.state.podcasts}
        renderItem={this.renderData}
        //numColumns={2}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.PodcastID}
       // ListHeaderComponent={this.renderHeader}
       ItemSeparatorComponent={this.separator}
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
  

export default withFirebaseHOC(CategoryPodcast);


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
  separator: {
    borderBottomColor: '#d1d0d4',
    borderBottomWidth: 1
  }
});
