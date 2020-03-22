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
  //console.log(podcast[0].Podcast_Pictures)
    
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
        data={podcast[0].Podcast_Pictures}
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
            {podcast[0].Podcast_Name}
          </Text>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <Block flex={false} row margin={[theme.sizes.base, 0]}>
            { podcast[0].Tags_Array && podcast[0].Tags_Array.map(tag => (
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
              {podcastID:podcast[0].PodcastID})}}>
          <View>
            <Text>{"\n"}{numUsersLiked} Likes</Text>
          </View>
        </TouchableOpacity>

          <Divider margin={[theme.sizes.padding * 0.9, 0]} />
         
          <Block>
            <Text semibold>Related</Text>
            <Block row margin={[theme.sizes.padding * 0.9, 0]}>
              {product.images.slice(1, 3).map((image, index) => (
                <Image
                  key={`gallery-${index}`}
                  source={image}
                  style={styles.image}
                />
              ))}
              <Block
                flex={false}
                card
                center
                middle
                color="rgba(197,204,214,0.20)"
                style={styles.more}
              >
                <Text gray>+{product.images.slice(3).length}</Text>
              </Block>
            </Block>
          </Block>
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

