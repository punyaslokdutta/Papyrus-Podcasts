import React, { Component } from 'react';
import firestore from '@react-native-firebase/firestore';
import {withFirebaseHOC} from './config/Firebase'

import { Dimensions, Image, StyleSheet, ScrollView, TouchableOpacity,View } from 'react-native';
import CategoryPodcast from './components/categories/CategoryPodcast';
import { Card, Badge, Block, Text } from './components/categories/components';
import { theme, mocks } from './components/categories/constants';
import CategoryTabNavigator from './navigation/CategoryTabNavigator'

const { width } = Dimensions.get('window');

class CategoryScreen extends Component {
  constructor(props)
  {
    super(props)
    {
      this.state = {
        active: 'Books',
        categories: [],
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

  // componentDidMount() {
  //   this.setState({ categories: this.props.categories });
  // }
  //retrieve data
  retrieveData = async () => {
    try {
      // Set State: Loading
      this.setState({
        loading: true,
      });

      console.log('Retrieving Data');
      // Cloud Firestore: Query
      let query3 = await firestore().collection('Categories').get();
      let documentData = query3.docs.map(document => document.data());

      this.setState({
        categories: documentData,
        loading:false
      });
    }
    catch (error) {
      console.log(error);
    }
  };


  handleTab = tab => {
    const { categories } = this.props;
    //const filtered = categories.filter(
      //category => category.tags.includes(tab.toLowerCase())
    //);

    this.setState({ active: tab, categories: categories });
  }
  renderTab(tab) {
    const { active } = this.state;
    const isActive = active === tab;

    return (
      <TouchableOpacity
        key={`tab-${tab}`}
        onPress={() => this.handleTab(tab)}
        style={[
          styles.tab,
          isActive ? styles.active : null
        ]}
      >
        <Text size={16} medium gray={!isActive} secondary={!isActive}>
          {tab}
        </Text>
      </TouchableOpacity>
    )
  }
  

  render() {
    const { categories } = this.state;
    const tabs = ['Books', 'Podcasts'];
    
    
    return (
      <Block>
        <Block flex={false} row center space="between" style={styles.header}>
          <Text h1 bold>Categories</Text>
        </Block>

        {/* <Block flex={false} row style={styles.tabs}>
          {tabs.map(tab => this.renderTab(tab))}
        </Block> */}

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ paddingVertical: theme.sizes.base * 2}}>
          <Block flex={false} row space="between" style={styles.categories}>
            {categories.map(category => (
              <TouchableOpacity key={category.categoryName} onPress={() => 
                                this.props.navigation.navigate('CategoryTabNavigator', {category : category.categoryName })}>
                <Card center middle shadow style={styles.category}> 
                  <Badge margin={[0, 0, 15]} size={100} color="rgba(41,216,143,0.20)">
                   
                    <Image source={{uri:category.categoryImage}} />
                    
                   </Badge>
                  <Text medium height={20}>{category.categoryName}</Text>
                  <Text gray caption>{category.numBooks} Books </Text>
                </Card>
              </TouchableOpacity>
            ))}
          </Block>
        </ScrollView>
      </Block>
      
    )
  
}
}

CategoryScreen.defaultProps = {
  profile: mocks.profile,
  categories: mocks.categories,
}

export default withFirebaseHOC(CategoryScreen);

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: theme.sizes.base * 2,
    paddingTop: theme.sizes.base * 2,
    paddingBottom :theme.sizes.base * 0.5,
  },
  avatar: {
    height: theme.sizes.base * 2.2,
    width: theme.sizes.base * 2.2,
  },
  tabs: {
    borderBottomColor: theme.colors.gray2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: theme.sizes.base,
    marginHorizontal: theme.sizes.base * 2,
  },
  tab: {
    marginRight: theme.sizes.base * 2,
    paddingBottom: theme.sizes.base
  },
  active: {
    borderBottomColor: theme.colors.black,
    borderBottomWidth: 3,
  },
  categories: {
    flexWrap: 'wrap',
    paddingHorizontal: theme.sizes.base * 2,
    marginBottom: theme.sizes.base * 3.5,
  },
  category: {
    // this should be dynamic based on screen width
    minWidth: (width - (theme.sizes.padding * 2.4) - theme.sizes.base) / 2,
    maxWidth: (width - (theme.sizes.padding * 2.4) - theme.sizes.base) / 2,
    maxHeight: (width - (theme.sizes.padding * 2.4) - theme.sizes.base) / 2,
  }
})
