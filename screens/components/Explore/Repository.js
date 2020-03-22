import React from "react";
import { View, Text } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome'
import { connectHighlight } from "react-instantsearch/connectors";
import styles from './styles'

const Highlight = connectHighlight(
  ({ highlight, attributeName, hit, highlightProperty }) => {
    const parsedHit = highlight({
      attributeName,
      hit,
      highlightProperty: "_highlightResult"
    });

    const highlightedHit = parsedHit.map((part, idx) => {
      if (part.isHighlighted) {
        return (
          <Text key={idx} style={{ backgroundColor: "#ffff00" }}>
            {part.value}
          </Text>
        );
      }
      return part.value;
    });

    return <Text>{highlightedHit}</Text>;
  }
);

const Repository = ({ repo }) => {

  console.log(repo)
  return (
  <View style={styles.repoContainer}>
    <View>
    <Icon name="home"   size={24} />
    </View>
    <View>
     
      <Text
        ellipsizeMode="tail"
        numberOfLines={2}
        style={styles.repoDescription}
      >
        {repo.Book_Name}
      </Text>
    </View>
  </View>)
};

export default Repository;
