import React from "react";
import { View, Text, StyleSheet, ScrollView,TouchableOpacity,Image,TouchableNativeFeedback,Dimensions } from "react-native";
import { useSelector } from "react-redux";

var {width, height}=Dimensions.get('window')



const ProfileTabBar = props => {

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
  const S = StyleSheet.create({
    container: { flexDirection: "row", height: height/12, elevation: 2,borderColor:'black' },
  
  });
  return (
    <View style={S.container}>
      {routes.map((route, routeIndex) => {
        const isRouteActive = routeIndex === activeRouteIndex;
        const tintColor = isRouteActive ? activeTintColor : inactiveTintColor;
        const screenName = getLabelText({ route });
        const borderBottomColor = isRouteActive ? activeTintColor : 'white';
        const fontFamily = isRouteActive ? 'Montserrat-Bold' : 'Montserrat-Regular';
        const tabButton = { flex: 1, justifyContent: "center", alignItems: "center",borderBottomWidth:3,borderBottomColor:borderBottomColor}

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
            <View style={tabButton}>
            {renderIcon({ route, focused: isRouteActive, tintColor })}
            <Text style={{fontFamily:fontFamily,fontSize:12,color:tintColor}}>{getLabelText({ route })}</Text>
            </View>
          </TouchableNativeFeedback>
        );
      })}
    </View>
  );
};

export default ProfileTabBar;