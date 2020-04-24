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
        limit:6,
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
      
      this.setState({
        loading: true,
      });
      console.log('Retrieving Data');
      
      try {
        
        const genre = this.props.navigation.state.params;
        let documentBooks = await firestore().collection('books').where("genres","array-contains",genre.category)
                                  .orderBy('createdOn','desc').limit(this.state.limit).get();
        let documentDataBooks = documentBooks.docs.map(document => document.data());

        var lastVisible = this.state.lastVisibleBook;
        if(documentDataBooks.length != 0)
          lastVisible = documentDataBooks[documentDataBooks.length - 1].createdOn;        
         
        this.setState({
          books: documentDataBooks,
          lastVisibleBook:lastVisible
        });
      }
      catch (error) {
        console.log(error);
      }
      finally {
        this.setState({
          loading: false
        });
      }
    };

    retrieveMoreCategoryBooks = async () => {
     
      console.log("retrieveMoreCategoryBooks starts()");
      this.setState({
        refreshing: true
      });

      try{

        const genre = this.props.navigation.state.params;
        let categoryBookQuery = await firestore().collection('books').where('genres','array-contains',genre.category)
                          .orderBy('createdOn','desc').startAfter(this.state.lastVisibleBook).limit(this.state.limit).get();
        
        let documentData = categoryBookQuery.docs.map(document => document.data());
        if(documentData.length != 0)
        {
          let lastVisibleBook = documentData[documentData.length - 1].createdOn;
          if(this.state.lastVisibleBook != lastVisibleBook)
          {
            this.setState({
                books: [...this.state.books, ...documentData],
                lastVisibleBook : lastVisibleBook
              });

          }
        }
      }
      catch(error){
        console.log(error);
      }
      finally {
        this.setState({
          refreshing: false
        });
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
      
      if (this.state.refreshing===true) {
        return (
          <ActivityIndicator />
        )
      }
      else {
        return null;
      }
    }

    onEndReached = ({ distanceFromEnd }) => {
      if(this.state.books.length > (this.state.limit - 1))
      {
        if(!this.onEndReachedCalledDuringMomentum ){
            this.retrieveMoreCategoryBooks()
            this.onEndReachedCalledDuringMomentum = true;
        }
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
