import * as React from "react";
import {
  View,
  Text,
  Dimensions,
  Button,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { getAuth, signOut } from "firebase/auth";
import firebase from "firebase/app";
import { db } from "../../configurations/index";
import {
  collection,
  addDoc,
  query,
  where,
  doc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
//Main function of this screen.
export default function SettingsScreen(props) {
  console.log(props.car.id);
  const today = new Date();
  const todaysDay = today.getDate();
  const todaysMonth = today.getMonth() + 1;
  const todaysYear = today.getFullYear();
  //Getting the image for the background.
  const imageBg = require("../../assets/imageBg.png");
  const changeCar = () => {
    props.navigation.navigate("List");
  };
  //Function to logout and return to the login screen.
  const logOut = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        props.navigation.navigate("Login");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //Deleting the element.
  const deleteItem = async () => {
    try {
      await deleteDoc(doc(db, "Cars", props.car.id));
      console.log("Document deleted successfully");
      logOut();
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };
  //Reset the car stats such as fuel and distance.
  const resetCar = async () => {
    const batch = db.batch();

    const query = db
      .collection("CarRuns")
      .where("carId", "==", props.car.id)
      .where("isActive", "==", true);

    const querySnapshot = await getDocs(query);

    querySnapshot.forEach((documentSnapshot) => {
      let carRun = db.collection("CarRuns").doc(documentSnapshot.id);
      batch.update(carRun, { isActive: false });
    });

    batch
      .commit()
      .then(() => {
        console.log("Batch successfully committed!");
      })
      .catch((error) => {
        console.error("Error committing batch: ", error);
      });
  };

  //Mock a moving car - update database with mock values as if car is moving
  const mockMovingCar = async () => {
    const docRef = addDoc(collection(db, "CarRuns"), {
      carId: props.car.id,
      kmDriven: 50,
      day: todaysDay,
      month: todaysMonth,
      year: todaysYear,
      isActive: true,
    });
  };
  //Returning the main body of the function to be displayed on screen.
  return (
    <ImageBackground
      source={imageBg}
      style={{ resizeMode: "cover", overflow: "hidden", flex: 1 }}
    >
      <View style={styles.container}>
        <TouchableOpacity onPress={logOut} style={styles.button}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={changeCar} style={styles.button}>
          <Text style={styles.buttonText}>Change car</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={resetCar} style={styles.button}>
          <Text style={styles.buttonText}>Reset Car</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={deleteItem} style={styles.button}>
          <Text style={styles.buttonText}>Delete Car</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={mockMovingCar} style={styles.button}>
          <Text style={styles.buttonText}>Mock Moving Car</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.lineBreak}>
        <Text style={styles.buttonText}>
          Copyright{"\u00A9"} of team 4, CIS3186.
        </Text>
      </View>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  button: {
    backgroundColor: "#545150",
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 40,
    marginTop: 18,
    borderRadius: 8,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Helvetica",
    fontWeight: "bold",
  },
  container: {
    marginHorizontal: 40,
    marginTop: 170,
    alignItems: "center",
  },
  lineBreak: {
    marginHorizontal: 20,
    marginTop: 110,
    borderTopColor: "#FFF",
    borderTopWidth: 1,
  },
});
