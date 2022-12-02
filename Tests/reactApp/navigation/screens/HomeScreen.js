import * as React from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { ListItem, Avatar } from "@react-native-material/core";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase.js";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

export default function HomeScreen({ navigation }) {
  const [input, setInput] = React.useState("");

  let addData = async (data) => {
    const docRef = await addDoc(collection(db, "Users"), {
      Name: data,
      id: 1,
    });
  };

  let showData = async () => {
    const q = query(collection(db, "input"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.data());
    });
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <View>
        <>
          <ListItem
            leadingMode="avatar"
            leading={
              <Avatar
                image={{ uri: "https://mui.com/static/images/avatar/1.jpg" }}
              />
            }
            title="Brunch this weekend?"
            secondaryText="I'll be in your neighborhood doing errands this…"
          />
          <ListItem
            leadingMode="avatar"
            leading={
              <Avatar
                image={{ uri: "https://mui.com/static/images/avatar/2.jpg" }}
              />
            }
            title="Summer BBQ"
            secondaryText="Wish I could come, but I'm out of town this…"
          />
          <ListItem
            leadingMode="avatar"
            leading={
              <Avatar
                image={{ uri: "https://mui.com/static/images/avatar/3.jpg" }}
              />
            }
            title="Oui Oui"
            secondaryText="Do you have Paris recommendations? Have you ever…"
          />
        </>
      </View>
      <View>
        <TextInput onChangeText={setInput} value={input} style={styles.input} />
        <Button
          title="Add"
          onPress={() => {
            addData(input);
            setInput("");
            showData();
          }}
        />
      </View>
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
