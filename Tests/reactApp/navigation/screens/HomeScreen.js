import * as React from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { ListItem, Avatar } from "@react-native-material/core";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase.js";

export default function HomeScreen(props) {
  //Creating a state which will hold the current 'car' object.
  const [car, setCar] = React.useState({});
  //Getting the value of the selected id through the props passed in the main container of the navigation.
  const id = props.id;
  //Getting the desired document
  const getData = async () => {
    //Query which gets all the elements which have the above id (normally this is only one document sincce id is unique).
    const q = query(collection(db, "Users"), where("id", "==", id));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setCar(doc.data());
    });
  };
  //Using a useEffect in order to get the data automatically once the page has loaded.
  React.useEffect(() => {
    getData();
  });

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <Text>{car.id},</Text>
      <Text>{car.Name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
