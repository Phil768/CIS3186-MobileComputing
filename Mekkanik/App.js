import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import LoginSignupPage from './screens/LoginSignup';
import { auth } from './configurations/index';
import CarLists from './screens/CarLists';
import AddCarToList from './screens/AddCarToList';

// Logout functionality
const logout = () => {
  auth.signOut()
    .then(function() {
      console.log("User signed out.");
    })
    .catch(function(error) {
      console.error("Error signing out: ", error);
    });
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    // Unsubscribe from the listener when the component unmounts
    return unsubscribe;
  }, []);

  if (isLoggedIn){
    const user = auth.currentUser;

    console.log('Logged in: ' + isLoggedIn);
    console.log('User details: ' + user.email);
    return (
      /*
      <View>
        <Text>Already logged in!</Text>
        <Button title="Logout" onPress={logout} />
      </View>
      */
     <AddCarToList />
    );
  } else {
    console.log('Logged in: ' + isLoggedIn);
    return (
      <LoginSignupPage />
    );
  }
    
};
export default App;
