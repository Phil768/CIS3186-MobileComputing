import * as React from "react";
import { View, Text, Dimensions, Button } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { db } from "../../configurations/index";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
//Main function of this screen.
export default function SettingsScreen(props) {
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
  //Returning the main body of the function to be displayed on screen.
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Button title="Logout" onPress={logOut} />
      <Button title="Change car" onPress={changeCar} />
      <Button title="Reset Car" onPress={resetCar} />
    </View>
  );
}
