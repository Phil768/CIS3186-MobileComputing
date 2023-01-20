import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  SafeAreaView,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import firebase from "firebase/compat/app";
import { auth, db } from "../../configurations/index";
import CarLists from "./CarLists";
//Main function of the screen.
const LoginSignupPage = ({ navigation }) => {
  //Creating the required states for the below function.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  //Getting the image for the background.
  const imageBg = require("../../assets/imageBg.png");
  //When the user successfully logs in.
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
        console.log(error);
        Alert.alert(
          "Login failed",
          "Make sure that credentials are entered correctly.",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }]
        );
      });
  };
  const redirectToSignupPage = () => {
    navigation.navigate("Register");
  };
  //Returning the main body of the application which will be viewed on screen.
  return (
    <ImageBackground
      source={imageBg}
      style={{ resizeMode: "cover", overflow: "hidden", flex: 1 }}
    >
      <SafeAreaView>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.textInp1}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.textInp2}
        />
        <View>
          <TouchableOpacity onPress={handleLogin} style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={redirectToSignupPage}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <Image
            source={require("../../assets/sedan.png")}
            style={styles.image}
          />
          <Text style={styles.imageText}>Mekkanik</Text>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  textInp1: {
    fontSize: 20,
    height: 45,
    borderRadius: 10,
    padding: 7,
    marginLeft: 10,
    marginTop: 100,
    marginRight: 10,
    backgroundColor: "#C6C6C6",
  },
  textInp2: {
    height: 45,
    fontSize: 20,
    borderRadius: 10,
    padding: 7,
    margin: 10,
    backgroundColor: "#C6C6C6",
  },
  button: {
    backgroundColor: "#545150",
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 40,
    marginTop: 18,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Arial",
    fontWeight: "bold",
  },
  container: {
    marginTop: 81,
    alignItems: "center",
  },
  image: {
    height: 80,
    width: 211,
    marginBottom: 20,
  },
  imageText: {
    color: "#545150",
    fontSize: 35,
    fontFamily: "Arial",
    fontWeight: "bold",
    fontStyle: "italic",
  },
});

export default LoginSignupPage;
