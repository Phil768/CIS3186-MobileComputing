import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Button,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "./navigation/firebase";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

const Add = () => {
  const [input, setInput] = React.useState("");

  //Adding the data to the databse.
  let addData = async (data) => {
    const docRef = await addDoc(collection(db, "Users"), {
      Name: data,
      id: 11,
    });
  };
  return (
    <View>
      <TextInput onChangeText={setInput} value={input} style={styles.input} />
      <Button
        title="Add"
        onPress={() => {
          addData(input);
          setInput("");
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default Add;
