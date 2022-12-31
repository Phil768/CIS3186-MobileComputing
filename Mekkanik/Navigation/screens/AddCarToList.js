import * as React from "react";
import { StyleSheet, TextInput, Button, SafeAreaView } from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../../configurations/index";

const AddCarToList = ({ navigation }) => {
  // Details of current logged in user
  const currentUser = auth.currentUser;

  // Adding the data to the database.

  let addCarOne = async () => {
    var carOneAlreadyExists = false;

    // Only allow to add new car if car does not exist already
    await db
      .collection("Cars")
      .where("name", "==", "Volkswagen Golf")
      .where("email", "==", currentUser.email)
      .get()
      .then((snapshot) => {
        if (snapshot.size > 0) {
          console.log("Document already exists!");
          carOneAlreadyExists = true;
        } else {
          console.log("Document does not exist!");
        }
      })
      .catch((err) => {
        console.log("Error getting documents", err);
      });

    if (!carOneAlreadyExists) {
      // Add to new car to Cars collection
      const docRef = await addDoc(collection(db, "Cars"), {
        name: "Volkswagen Golf",
        email: currentUser.email,
        year: 2020,
        consumptionPerKm: 0.054,
        fuelTankCapacity: 50,
        engine: 1.4
      });     
    }
    //Navigating back to the list page.
    navigation.navigate("List");
  };

  let addCarTwo = async () => {
    var carTwoAlreadyExists = false;

    // Only allow to add new car if car does not exist already
    await db
      .collection("Cars")
      .where("name", "==", "Toyota Starlet")
      .where("email", "==", currentUser.email)
      .get()
      .then((snapshot) => {
        if (snapshot.size > 0) {
          console.log("Document already exists!");
          carTwoAlreadyExists = true;
        } else {
          console.log("Document does not exist!");
        }
      })
      .catch((err) => {
        console.log("Error getting documents", err);
      });

    if (!carTwoAlreadyExists) {
      // Add to new car to Cars collection
      const docRef = await addDoc(collection(db, "Cars"), {
        name: "Toyota Starlet",
        email: currentUser.email,
        year: 1998,
        consumptionPerKm: 0.057,
        fuelTankCapacity: 45,
        engine: 1.3
      });
    }
    //Navigating back to the list page.
    navigation.navigate("List");
  };

  return (
    <SafeAreaView style={{ margin: 50 }}>
      <Button
        title="2020 Volkswagen Golf"
        onPress={() => {
          addCarOne();
        }}
      />
      <Button
        title="1998 Toyota Starlet"
        onPress={() => {
          addCarTwo();
        }}
      />
    </SafeAreaView>
  );
};

export default AddCarToList;
