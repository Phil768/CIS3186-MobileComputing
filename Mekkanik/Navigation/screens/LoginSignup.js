import React, { useState } from "react";
import { View, Text, TextInput, Button, SafeAreaView } from "react-native";
import firebase from "firebase/compat/app";
import { auth, db } from "../../configurations/index";
import CarLists from "./CarLists";
//Main function of the screen.
const LoginSignupPage = ({ navigation }) => {
  //Creating the required states for the below function.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  //When the user enters the correct credentials. Firebase handles everything.
  handleLogin = () => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        //Login successful
        //Navigate to First Screen
        console.log(user);
        navigation.navigate("List");
      })
      .catch((error) => {
        //Login failed
        setError(error.message);
      });
  };
  //When the user has no prior account and wants to create one. Firebase handles everything.
  handleSignup = () => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        //Signup successful
        console.log(user);
      })
      .catch((error) => {
        //Signup failed
        setError(error.message);
      });
  };
  //Returning the main body of the application which will be viewed on screen.
  return (
    <SafeAreaView>
      {error && <Text>{error}</Text>}
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button onPress={handleLogin} title="Login" />
      <Button onPress={handleSignup} title="Sign up" />
    </SafeAreaView>
  );
};
//exporting the main function to be viewed on screen.
export default LoginSignupPage;
