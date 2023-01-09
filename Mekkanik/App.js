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
    .signOut()
    .then(function () {
      console.log("User signed out.");
    })
    .catch(function (error) {
      console.error("Error signing out: ", error);
    });
};

const checkLoginStatus = () => {
  auth.onAuthStateChanged((user) => {
    if (user) {
      setIsLoggedIn(true);
      storeData(isLoggedIn);
    } else {
      setIsLoggedIn(false);
      storeData(isLoggedIn);
    }
  });
};

const Stack = createStackNavigator();
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem("@storage_Key", JSON.stringify(value));
    } catch (e) {
      // saving error
    }
  };

  const getData = async () => {
    try {
      const value = JSON.parse(await AsyncStorage.getItem("@storage_Key"));
      if (value !== null) {
        setIsLoggedIn(value);
      }
    } catch (e) {
      // error reading value
    }
  };

  useEffect(() => {
    checkLoginStatus;
    getData();
  }, []);

  const initialRoute = () => {
    if (isLoggedIn) {
      // const user = auth.currentUser;
      console.log("Logged in: " + isLoggedIn);
      //console.log("User details: " + user.email);
      return "List";
    } else {
      console.log("Logged in: " + isLoggedIn);
      return "Login";
    }
  };

  return (
    
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName={initialRoute()}>
        <Stack.Screen name="Login" component={LoginSignupPage} />
        <Stack.Screen
          name="List"
          component={CarLists}
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

export default App;
