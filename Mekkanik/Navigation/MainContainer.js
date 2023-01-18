//Imports required
import * as React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
// lasses
import HomeScreen from "./screens/HomeScreen";
import SettingsScreen from "./screens/SettingsScreen";
import MapScreen from "./screens/MapScreen";
//Screen names
const homeName = "Home";
const detailsName = "Map";
const settingsName = "Settings";
//Creating a new bottom tab navigator.
const Tab = createBottomTabNavigator();
//Creating a custom tab bar button which would add more style and aesthetic.
const CustomTabBarButton = ({ children, onPress, focused }) => (
  //Touchable opacity is used instead of button since it allows more styling options.
  <TouchableOpacity
    //Styling
    style={{
      top: -20,
      justifyContent: "center",
      alignItems: "center",
      ...style.shadow,
    }}
    onPress={onPress}
  >
    <View
      //Style
      style={{
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: "white",
      }}
    >
      {children}
    </View>
  </TouchableOpacity>
);
//Main function for this screen.
const MainContainer = ({ route, navigation }) => {
  //Storing the selected id in a variable.
  const { car } = route?.params || {};
  return (
    // Navigation method.
    <NavigationContainer independent={true}>
      {/*Creating the bottom navigation*/}
      <Tab.Navigator
        // The default route.
        initialRouteName={homeName}
        // Styling options for the bottom navigation.
        screenOptions={{
          tabBarShowLabel: false,
          activeTintColor: "black",
          inactivateTintColor: "grey",
          tabBarStyle: {
            position: "absolute",
            bottom: 25,
            left: 20,
            right: 20,
            elevation: 0,
            backgroundColor: "white",
            borderRadius: 15,
            height: 90,
            ...style.shadow,
          },
        }}
      >
        {/*The below are the options which will be present in the bottom navigation*/}
        <Tab.Screen
          name={homeName}
          //Passing props.
          children={() => <HomeScreen car={car} />}
          options={{
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  top: 10,
                }}
              >
                <Image
                  source={require("../assets/dashboard.png")}
                  resizeMode="contain"
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: focused ? "orange" : "grey",
                  }}
                />
                <Text
                  style={{
                    color: focused ? "orange" : "grey",
                    fontSize: 12,
                    top: 5,
                  }}
                >
                  HOME
                </Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name={detailsName}
          //Passing the props.
          children={() => <MapScreen car={car} />}
          options={{
            tabBarIcon: ({ focused }) => (
              //Adding custom image.
              <Image
                source={require("../assets/map.png")}
                resizeMode="contain"
                style={{
                  width: 30,
                  height: 30,
                  tintColor: focused ? "orange" : "grey",
                }}
              />
            ),
            tabBarButton: (props) => <CustomTabBarButton {...props} />,
          }}
        />
        <Tab.Screen
          name={settingsName}
          //Passing the props.
          children={() => <SettingsScreen car={car} navigation={navigation} />}
          options={{
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  top: 10,
                }}
              >
                <Image
                  source={require("../assets/settings.png")}
                  resizeMode="contain"
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: focused ? "orange" : "grey",
                  }}
                />
                <Text
                  style={{
                    color: focused ? "orange" : "grey",
                    fontSize: 12,
                    top: 5,
                  }}
                >
                  SETTINGS
                </Text>
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
//Creating styles.
const style = StyleSheet.create({
  shadow: {
    shadowColor: "#7F5DF0",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});
//Export function to be displayed on screen.
export default MainContainer;
