import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import { auth } from "./configurations/index";
import MainContainer from "./Navigation/MainContainer";
import CarLists from "./Navigation/screens/CarLists";
import AddCarToList from "./Navigation/screens/AddCarToList";
import LoginSignupPage from "./Navigation/screens/LoginSignup";
import SettingsScreen from "./Navigation/screens/SettingsScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Logout functionality
const logout = () => {
  auth
    //Sign out completely using Firebase functionality.
    .signOut()
    .then(function () {
      console.log("User signed out.");
    })
    .catch(function (error) {
      console.error("Error signing out: ", error);
    });
};

//Checking the login status.
const checkLoginStatus = () => {
  //Checking if the state of the auth changes. (.i.e the user has logged in).
  auth.onAuthStateChanged((user) => {
    if (user) {
      //Setting the state.
      setIsLoggedIn(true);
      //Saving data to storage.
      storeData(isLoggedIn);
    } else {
      //Setting the state.
      setIsLoggedIn(false);
      //Saving data to storage.
      storeData(isLoggedIn);
    }
  });
};
//Creating a new stack navigator to handle when a screen transitions to another.
const Stack = createStackNavigator();
const App = () => {
  //Creating a new state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  //Storing the data to storage.
  const storeData = async (value) => {
    try {
      //Awaiting the async storoage and storing the data with an allocated key.
      await AsyncStorage.setItem("@storage_Key", JSON.stringify(value));
    } catch (e) {
      // saving error
    }
  };
  //Getting the data from the storage.
  const getData = async () => {
    try {
      //Get data with the saved key.
      const value = JSON.parse(await AsyncStorage.getItem("@storage_Key"));
      if (value !== null) {
        //Setting the new state.
        setIsLoggedIn(value);
      }
    } catch (e) {
      // error reading value
    }
  };
  //Checks login usng useEffect which runs automatically once before anything else.
  useEffect(() => {
    //Checking the login status before evrything else.
    checkLoginStatus;
    //Getting the data from storage.
    getData();
  }, []);
  //Setting the initial route of the user once the application is opened.
  const initialRoute = () => {
    if (isLoggedIn) {
      console.log("Logged in: " + isLoggedIn);
      //If the user is logged in return list.
      return "List";
    } else {
      console.log("Logged in: " + isLoggedIn);
      //If the user is not logged it return login.
      return "Login";
    }
  };
  //The body that is returned by this file, what is viewed on the screen.
  return (
    //Creating a new navigation container.
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName={initialRoute()}>
        <Stack.Screen name="Login" component={LoginSignupPage} />
        <Stack.Screen
          name="List"
          component={CarLists}
          //Passing a navigation prop and adding a button to add a car in the heading of the screen.
          options={({ navigation }) => ({
            headerRight: () => (
              <Button title="Add" onPress={() => navigation.navigate("Add")} />
            ),
          })}
        />
        <Stack.Screen name="Add" component={AddCarToList} />
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
//Exporting the app to be displayed on screen.
export default App;
