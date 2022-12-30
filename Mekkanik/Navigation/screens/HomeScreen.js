import * as React from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../../configurations/index";

export default function HomeScreen(props) {
  // Creating a state which will hold the current 'car' object.
  const [car, setCar] = React.useState({});
  // console.log('Passed props:', props);

  // Get the document from the database
  const documentPath = 'Cars/' + props.car.id;

  // Getting the desired document
  const getData = async () => {
    const docRef = db.doc(documentPath);
    // console.log(docRef);

    docRef.get().then((doc) => {
      if (doc.exists) {
        // console.log("Document data:", doc.data());
        setCar(doc.data());
      } else {
        console.log("No such document!");
      }
    }).catch((error) => {
      console.log("Error getting document:", error);
    });
  };

  // Using a useEffect in order to get the data automatically once the page has loaded.
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
      <Text>{car.name},</Text>
      <Text>{car.email}</Text>
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
