import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "./configurations/index";
import MainContainer from "./Navigation/MainContainer";
import CarLists from "./Navigation/screens/CarLists";
import AddCarToList from "./Navigation/screens/AddCarToList";
import LoginSignupPage from "./Navigation/screens/LoginSignup";
import RegisterPage from "./Navigation/screens/RegisterPage";
import SettingsScreen from "./Navigation/screens/SettingsScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

//Creating a new stack navigator to handle when a screen transitions to another.
const Stack = createStackNavigator();
const App = () => {
  //The body that is returned by this file, what is viewed on the screen.
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginSignupPage} />
        <Stack.Screen name="Register" component={RegisterPage} />
        <Stack.Screen
          name="List"
          component={CarLists}
          //Passing a navigation prop and adding a button to add a car in the heading of the screen.
          options={({ navigation }) => ({
            headerRight: () => (
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  navigation.navigate("Add");
                }}
              >
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
            ),
            headerLeft: null,
          })}
        />
        <Stack.Screen
          name="Add"
          component={AddCarToList}
          options={() => ({
            headerLeft: null,
          })}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="MainContainer"
          component={MainContainer}
        />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#545150",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
    marginTop: 1,
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontFamily: "Arial",
    fontWeight: "bold",
  },
});

//Exporting the app to be displayed on screen.
export default App;
