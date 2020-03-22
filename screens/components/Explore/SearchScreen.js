import React, {Component} from 'react';
import { StyleSheet, Text, View,TextInput, Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import FontAwesome, { Icons } from 'react-native-fontawesome';
import SearchBox from './SearchBox';
import styles from './styles';
import SearchResults from './SearchResults';
import { InstantSearch, Index ,  Configure} from "react-instantsearch/dom";
//import algoliasearch from 'algoliasearch/lite';
import algoliasearch from "algoliasearch";

const searchClient = algoliasearch(
  'BJ2O4N6NAY',
  '8dd4ee7d486981d0b1f375d6c81b9fda'
);


class SearchScreen extends React.Component {
    
    componentDidMount()
    {
      console.log("COMPONENNNNNNNNNNNNNNNNNT         DID MOUNT        JJKBJ")
    }
    render() {
        
      return (
        <View style={styles.container}>
        <Text>Search Podcasts, Books</Text>
        <InstantSearch
           indexName="Books"
           searchClient={searchClient}
        >
          <View style={styles.searchBoxContainer}>
          <SearchBox delay={1000} />
          </View>

          <Index indexName="Books">
      <Text>index: Books</Text>
      <Configure hitsPerPage={8} />
      <SearchResults/>
    </Index>

    <Index indexName="Books">
    <Text>index: instant_search_price_desc</Text>
    <Configure hitsPerPage={8} />
      <SearchResults/>
    </Index>
        </InstantSearch>
      </View>
                 
      );
    }
  }

export default SearchScreen;