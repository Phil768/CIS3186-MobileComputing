import React, { useState } from "react";
import { View, Text, TextInput, Button, SafeAreaView, ImageBackground, StyleSheet, TouchableOpacity } from "react-native";
import firebase from "firebase/compat/app";
import { auth, db } from "../../configurations/index";
import CarLists from "./CarLists";

const LoginSignupPage = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const imageBg = require("../../assets/imageBg.png");

  handleLogin = () => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        // Login successful
        // Navigate to First Screen
        console.log(user);
        navigation.navigate("List");
      })
      .catch((error) => {
        // Login failed
        setError(error.message);
      });
  };

  handleSignup = () => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        // Signup successful
        console.log(user);
      })
      .catch((error) => {
        // Signup failed
        setError(error.message);
      });
  };

  return (
    <ImageBackground
  source={imageBg}
  style={{resizeMode: "cover",
          overflow: "hidden",
          flex: 1}}>

      <SafeAreaView>
        {error && <Text>{error}</Text>}
        <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.textInp1}/>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.textInp2}
        />

        <View style={styles.button}>
         <Button onPress={handleLogin} title="Login" color={'#404756'} />
         </View>
         <View style={styles.button}>
        <Button onPress={handleSignup} title="Sign up" color={'#404756'}/>
        </View>
        
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  textInp1: {
    borderRadius: 10, 
    padding: 7,
    marginLeft: 10,
    marginTop: 100,
    marginRight: 10,
    backgroundColor: "#DDDDDD",
    
  },
  textInp2: {
    borderRadius: 10, 
    padding: 7,
    margin: 10,
    backgroundColor: "#DDDDDD",
  },
  button:{
    marginLeft: 50,
    marginRight: 50,
    marginTop: 15
 

  }


});

export default LoginSignupPage;
