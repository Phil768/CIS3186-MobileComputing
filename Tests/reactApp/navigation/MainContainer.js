//prerequisites
import * as React from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
//classes
import HomeScreen from "./screens/HomeScreen";
import DetailsScreen from "./screens/DetailsScreen";
import SettingsScreen from "./screens/SettingsScreen";
//Screen names
const homeName = "Home";
const detailsName = "Details";
const settingsName = "Settings";

const Tab = createBottomTabNavigator();

export default function MainContainer() {
  return (
    //Navigation method.
    <NavigationContainer>
      {/*Creating the bottom navigation*/}
      <Tab.Navigator
        //The default route.
        initialRouteName={homeName}
        //Changind the layout of the bottom navigation according to which page is selected.
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            //New variables.
            let iconName;
            let routeName = route.name;
            //Determining which icons to highlight. (icons are imported via line 6)
            if (routeName === homeName) {
              iconName = focused ? "home" : "home-outline";
            } else if (routeName === detailsName) {
              iconName = focused ? "list" : "list-outline";
            } else if (routeName === settingsName) {
              iconName = focused ? "settings" : "settings-outline";
            }

            //Icons are created.
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        //Styling options for the bottom navigation.
        tabBarOptions={{
          activeTintColor: "black",
          inactivateTintColor: "grey",
          labelStyle: { paddingBottom: 10, fontSize: 10 },
          style: { padding: 10, height: 70 },
        }}
      >
        {/*The below are the options which will be present in the bottom navigation*/}
        <Tab.Screen name={homeName} component={HomeScreen} />
        <Tab.Screen name={detailsName} component={DetailsScreen} />
        <Tab.Screen name={settingsName} component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
