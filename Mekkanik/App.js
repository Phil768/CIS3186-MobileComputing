import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "./configurations/index";
import MainContainer from "./Navigation/MainContainer";
import CarLists from "./Navigation/screens/CarLists";
import AddCarToList from "./Navigation/screens/AddCarToList";
import LoginSignupPage from "./Navigation/screens/LoginSignup";
import SettingsScreen from "./Navigation/screens/SettingsScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

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
  //Checking the login status.
  const checkLoginStatus = () => {
    //Checking if the state of the auth changes. (i.e. the user has logged in).
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
  //Checks login usng useEffect which runs automatically once before anything else.
  useEffect(() => {
    //Checking the login status before evrything else.
    checkLoginStatus();
    console.log("LOGGED IN", isLoggedIn);
    //Getting the data from storage.
    setTimeout(async () => {
      const value = JSON.parse(await AsyncStorage.getItem("@storage_Key"));
      console.log("VALUE", value);
      if (value !== null) {
        //Setting the new state.
        setIsLoggedIn(value);
      }
    }, 500);
  }, []);
  //The body that is returned by this file, what is viewed on the screen.
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName={isLoggedIn ? "List" : "Login"}>
        <Stack.Screen name="Login" component={LoginSignupPage} />
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
                  checkLoginStatus();
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
    height: 35,
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
    fontFamily: "Helvetica",
    fontWeight: "bold",
  },
});

//Exporting the app to be displayed on screen.
export default App;
