// Imports required
import * as React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

// Classes 
import HomeScreen from "./screens/HomeScreen";
import SettingsScreen from "./screens/SettingsScreen";
import MapScreen from "./screens/MapScreen";

// Screen names
const homeName = "Home";
const detailsName = "Details";
const settingsName = "Settings";

const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({ children, onPress, focused }) => (
  <TouchableOpacity
    style={{
      top: -20,
      justifyContent: "center",
      alignItems: "center",
      ...style.shadow,
    }}
    onPress={onPress}
  >
    <View
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

const MainContainer = ({ route }) => {
  //Storing the selected id in a variable.
  console.log('route?.params:', route?.params);
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
                  source={require("../assets/home.png")}
                  resizeMode="contain"
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: focused ? "red" : "grey",
                  }}
                />
                <Text
                  style={{
                    color: focused ? "red" : "grey",
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
          children={() => <MapScreen car={car} />}
          options={{
            tabBarIcon: ({ focused }) => (
              <Image
                source={require("../assets/dashboard.png")}
                resizeMode="contain"
                style={{
                  width: 30,
                  height: 30,
                  tintColor: focused ? "red" : "grey",
                }}
              />
            ),
            tabBarButton: (props) => <CustomTabBarButton {...props} />,
          }}
        />
        <Tab.Screen
          name={settingsName}
          children={() => <SettingsScreen car={car} />}
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
                    tintColor: focused ? "red" : "grey",
                  }}
                />
                <Text
                  style={{
                    color: focused ? "red" : "grey",
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

export default MainContainer;
