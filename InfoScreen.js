import React, { Component, useState } from "react";
import {
  Dimensions,
  Image,
  FlatList,
  StyleSheet,
  ScrollView,
  TouchableOpacity, View
} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome'

import { Button, Divider, Block, Text } from "./screens/components/categories/components";
import { theme, mocks } from "./screens/components/categories/constants";
import LikersScreen from './screens/components/PodcastPlayer/LikersScreen'
import {useSelector } from 'react-redux'

const { width, height } = Dimensions.get("window");

 InfoScreen=(props)=> {
  const podcast=useState(props.navigation.state.params.podcast)
  const numUsersLiked=useSelector(state=>state.rootReducer.numLikes)
  //console.log(podcast[0].podcastPictures)
    
   const navigationOptions = ({ navigation }) => {
    return {
      headerRight: (
        <Button onPress={() => {}}>
          <Icon name="ellipsis-h" color={theme.colors.black} />
        </Button>
      )
    };
  };


   function renderGallery() {
    const { product } = props;
    return (
      <FlatList
        horizontal
        pagingEnabled
        scrollEnabled
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        data={podcast[0].podcastPictures}
        keyExtractor={(item, index) => `${index}`}
        renderItem={( {item} ) => (
          <Image
            source={{uri:item}}
            resizeMode="contain"
            style={{ width, height: height / 2.8 }}
          />
        )}
      />
    );
  }

    const { product } =props;

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderGallery()}

        <Block style={styles.product}>
          <Text h2 bold>
            {podcast[0].podcastName}
          </Text>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <Block flex={false} row margin={[theme.sizes.base, 0]}>
            { podcast[0].tags && podcast[0].tags.map(tag => (
              <Text key={`tag-${tag}`} caption gray style={styles.tag}>
                {tag}
              </Text>
            ))}
          </Block>
          </ScrollView>
          <Text gray light height={22}>
            {podcast[0].description}
          </Text>

          <TouchableOpacity onPress={() => {props.navigation.navigate('LikersScreen',
              {podcastID:podcast[0].podcastID})}}>
          <View>
            <Text>{"\n"}{numUsersLiked} Likes</Text>
          </View>
        </TouchableOpacity>

          <Divider margin={[theme.sizes.padding * 0.9, 0]} />
         
        </Block>
      </ScrollView>
    );
  
}

InfoScreen.defaultProps = {
  product: mocks.products[0]
};

export default InfoScreen;

const styles = StyleSheet.create({
  product: {
    paddingHorizontal: theme.sizes.base * 2,
    paddingVertical: theme.sizes.padding
  },
  tag: {
    borderColor: theme.colors.gray2,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: theme.sizes.base,
    paddingHorizontal: theme.sizes.base*0.5,
    paddingVertical: theme.sizes.base / 2.5,
    marginRight: theme.sizes.base * 0.625
  },
  image: {
    width: width / 3.26,
    height: width / 3.26,
    marginRight: theme.sizes.base
  },
  more: {
    width: 55,
    height: 55
  }
});

