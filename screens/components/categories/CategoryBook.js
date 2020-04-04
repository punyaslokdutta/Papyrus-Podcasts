import React, {Component} from 'react';
import firestore from '@react-native-firebase/firestore';
import { StyleSheet, Text, View, Image, TouchableOpacity,FlatList,  Dimensions,SafeAreaView, ScrollView,ActivityIndicator} from 'react-native';
import CatgeoryBookItem from './components/CategoryBookItem'
import {withFirebaseHOC} from '../../config/Firebase'


var {width, height}=Dimensions.get('window')

class CategoryBook extends React.Component {
    
    static navigationOptions={
        header:null
    }
   constructor(props)
   {
     super(props)
     {

      this.state={
        books:[], 
        limit:5,
        lastVisibleBook:null,
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
        let query3 = await firestore().collection('books').where("genres","array-contains",genre.category);    
        let documentBooks = await query3.orderBy('bookID').limit(this.state.limit).get();
        let documentDataBooks = documentBooks.docs.map(document => document.data());

        var lastVisible = this.state.lastVisibleBook;
        lastVisible = documentDataBooks[documentDataBooks.length - 1].bookID;        
         
        this.setState({
        books: documentDataBooks,
        lastVisibleBook:lastVisible,
        loading:false
        });
      }
      catch (error) {
        console.log(error);
      }
    };

    retrieveMoreCategoryBooks = async () => {
     try
      {

        {console.log("retrieveMoreCategoryBooks starts()")}

      this.setState({
        refreshing: true
         }); 

         //const  userid = this.props.firebase._getUid();
         const genre = this.props.navigation.state.params;
         let additionalQuery = 9;
         try{
           additionalQuery = await firestore().collection('books').where('genres','array-contains',genre.category)
                            .orderBy('bookID')
                            .startAfter(this.state.lastVisibleBook)
                            .limit(this.state.limit);
        
      // Cloud Firestore: Query Snapshot
      {console.log("retrieveMoreCategoryBooks afterQuery()")}
         
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
      let lastVisibleBook = documentData[documentData.length - 1].bookID;
       
      if(this.state.lastVisibleBook===lastVisibleBook){
          this.setState({
                  refreshing:false
              });
      }
      else
      {
        this.setState({
            books: [...this.state.books, ...documentData],
            //chapterPodcasts: documentData_chapterPodcasts,
            lastVisibleBook : lastVisibleBook,
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
        <CatgeoryBookItem book={item} index={index} navigation={this.props.navigation}/>
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
      //if(this.state.books.length > 5)
      if(!this.onEndReachedCalledDuringMomentum){
          this.retrieveMoreCategoryBooks()
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
        data={this.state.books}
        renderItem={this.renderData}
        //numColumns={2}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.bookID}
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
  

export default withFirebaseHOC(CategoryBook);


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
