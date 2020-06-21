import React from "react";
import { View, Text, StyleSheet, ScrollView,TouchableOpacity,Image,TouchableNativeFeedback,Dimensions } from "react-native";
import { useSelector } from "react-redux";

var {width, height}=Dimensions.get('window')

const S = StyleSheet.create({
  container: { flexDirection: "row", height: height/12, elevation: 0.5,borderColor:'gray',borderWidth:0 },
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