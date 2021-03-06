import React from "react";
import { View, Text, StyleSheet, ScrollView,TouchableOpacity,Image,TouchableNativeFeedback,Dimensions } from "react-native";
import { useSelector } from "react-redux";
import ExtraDimensions from 'react-native-extra-dimensions-android';
//const height =ExtraDimensions.getRealWindowHeight();
//const width=ExtraDimensions.getRealWindowWidth();
var {width, height}=Dimensions.get('window')

const S = StyleSheet.create({
  container: { flexDirection: "row", position:'absolute',bottom: 0, elevation: 0,borderColor:'gray',borderWidth:0,backgroundColor:'white' },
  tabButton: { flex: 1, justifyContent: "center", alignItems: "center" }
});

const TabBar = props => {

  const displayPictureURL = useSelector(state=>state.userReducer.displayPictureURL);
  const {
    renderIcon,
    getLabelText,
    activeTintColor,
    inactiveTintColor,
    onTabPress,
    onTabLongPress,
    getAccessibilityLabel,
    navigation
  } = props;

  const { routes, index: activeRouteIndex } = navigation.state;
  
  return (
    <View style={S.container}>
      {routes.map((route, routeIndex) => {
        const isRouteActive = routeIndex === activeRouteIndex;
        const tintColor = isRouteActive ? activeTintColor : inactiveTintColor;
        const screenName = getLabelText({ route });
        return (
          <TouchableNativeFeedback
            key={routeIndex}
            onPress={() => {
              onTabPress({ route });
            }}
            onLongPress={() => {
              onTabLongPress({ route });
            }}
            accessibilityLabel={getAccessibilityLabel({ route })}
          >
            <View style={S.tabButton}>
            {
                screenName == 'Profile'
                ?
                <Image source={{uri:displayPictureURL}} style={{borderRadius:30,height:height/24,width:height/24}}/>
                :
                renderIcon({ route, focused: isRouteActive, tintColor })
            }
            {/* <Text>{getLabelText({ route })}</Text> */}
            </View>
          </TouchableNativeFeedback>
        );
      })}
    </View>
  );
};

export default TabBar;