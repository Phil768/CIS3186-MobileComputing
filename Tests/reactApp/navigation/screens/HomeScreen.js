import * as React from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { ListItem, Avatar } from "@react-native-material/core";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase.js";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

export default function HomeScreen({ navigation, route }) {
  //const [id, setId] = React.useState(props.id);
  const { id } = route.params;

  let addData = async (data) => {
    const docRef = await addDoc(collection(db, "Users"), {
      Name: data,
      id: 2,
    });
  };

  let showData = async () => {
    const q = query(collection(db, "input"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.data());
    });
  };

  console.log("ID: " + { id });

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <Text>ID: {id}</Text>
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
