import * as React from "react";
import { View, Text, Dimensions, Button } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { db } from "../../configurations/index";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

/*

Logout button - just logs the user out and navigates to login screen
Change car button - navigates user to car selection screen
Reset car button - reset values of currently selected car - car fuel and oil levels back to 100%

*/

export default function SettingsScreen(props) {

  const changeCar = () => {
    props.navigation.navigate("List");
  };

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

  const resetCar = async() => {
    const batch = db.batch();

    const query = db
      .collection('CarRuns')
      .where("carId", "==", props.car.id)
      .where("isActive", "==", true);

    const querySnapshot = await getDocs(query);

    querySnapshot.forEach((documentSnapshot) => {
      let carRun = db.collection('CarRuns').doc(documentSnapshot.id);
      batch.update(carRun, {isActive: false });
    });

    batch.commit()
      .then(() => {
        console.log('Batch successfully committed!');
      })
      .catch((error) => {
        console.error('Error committing batch: ', error);
      });
  };

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
