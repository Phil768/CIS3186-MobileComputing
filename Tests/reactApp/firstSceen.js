import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "./navigation/firebase";

export default function FirstScreen({ navigation }) {
  //Creating an initial state(This data will e taken form firebase in the future.)
  const [people, setPeople] = React.useState([{ name: "John", id: 0 }]);
  //   async function showData() {
  //     const q = query(collection(db, "Users"));
  //     const querySnapshot = await getDocs(q);
  //     querySnapshot.forEach((doc) => {
  //       setPeople({ name: doc.data().Name, id: doc.data().id });
  //     });
  //   }
  //   let addData = async (data) => {
  //     const docRef = await addDoc(collection(db, "input"), {
  //       name: data.name,
  //       id: 1,
  //     });
  //   };

  console.log("PEOPLE: " + people);

  return (
    // <View style={styles.container}>
    //   <View>
    //     <TextInput value={people} style={styles.input} />
    //     <Button
    //       title="Add"
    //       onPress={() => {
    //         addData(people);
    //         setPeople("");
    //         showData();
    //       }}
    //     />
    //   </View>
    <FlatList
      //Data to output.
      data={people}
      //Since the flatlist requires 'key' field, in case our database has an id field for example.
      keyExtractor={(item) => item.id}
      //Rendering each item in our state array.
      renderItem={({ item }) => (
        <TouchableOpacity>
          {" "}
          onPress={() => navigation.navigate("MainContainer")}
          <Text style={styles.item}>
            {item.name}, {item.id}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    felx: 1,
    backgroundColor: "white",
    paddingTop: 40,
    paddingHorizontal: 10,
  },
  item: {
    marginTop: 20,
    padding: 30,
    fontSize: 20,
    marginHorizontal: 10,
    marginTop: 20,
    borderRadius: 30,
    borderWidth: 1,
    borderBottomColor: "black",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
