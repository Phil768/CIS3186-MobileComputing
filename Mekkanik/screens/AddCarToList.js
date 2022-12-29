import * as React from "react";
import {
  StyleSheet,
  TextInput,
  Button,
  SafeAreaView,
} from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from '../configurations';

const AddCarToList = () => {
  // Details of current logged in user
  const currentUser = auth.currentUser;

  // Adding the data to the database.

  let addCarOne = async () => {
    var carOneAlreadyExists = false;

    // Only allow to add new car if car does not exist already
    await db.collection("Cars")
      .where("name", "==", "Car One")
      .where("email", "==", currentUser.email)
      .get()
      .then((snapshot) => {
        if (snapshot.size > 0){
          console.log('Document already exists!');
          carOneAlreadyExists = true;
        } else {
          console.log("Document does not exist!");
        }   
      })
      .catch((err) => {
        console.log('Error getting documents', err);
      }
    );
    
    if (carOneAlreadyExists){

    } else {
      // Add to new car to Cars collection
      const docRef = await addDoc(collection(db, "Cars"), {
        name: 'Car One',
        email: currentUser.email
      });

      // Implement functionality to navigate to main screen
    }
  };

  let addCarTwo = async () => {
    var carTwoAlreadyExists = false;

    // Only allow to add new car if car does not exist already
    await db.collection("Cars")
      .where("name", "==", "Car Two")
      .where("email", "==", currentUser.email)
      .get()
      .then((snapshot) => {
        if (snapshot.size > 0){
          console.log('Document already exists!');
          carTwoAlreadyExists = true;
        } else {
          console.log("Document does not exist!");
        }   
      })
      .catch((err) => {
        console.log('Error getting documents', err);
      }
    );
    
    if (carTwoAlreadyExists){

    } else {
      // Add to new car to Cars collection
      const docRef = await addDoc(collection(db, "Cars"), {
        name: 'Car Two',
        email: currentUser.email
      });

      // Implement functionality to navigate to main screen
    }
  };

  let addCarThree = async () => {
    var carThreeAlreadyExists = false;

    // Only allow to add new car if car does not exist already
    await db.collection("Cars")
      .where("name", "==", "Car Three")
      .where("email", "==", currentUser.email)
      .get()
      .then((snapshot) => {
        if (snapshot.size > 0){
          console.log('Document already exists!');
          carThreeAlreadyExists = true;
          console.log(carThreeAlreadyExists);
        } else {
          console.log("Document does not exist!");
        }   
      })
      .catch((err) => {
        console.log('Error getting documents', err);
      }
    );
    
    console.log(carThreeAlreadyExists);

    if (carThreeAlreadyExists){
      console.log('Cannot add Car three.')
    } else {
      // Add to new car to Cars collection
      const docRef = await addDoc(collection(db, "Cars"), {
        name: 'Car Three',
        email: currentUser.email
      });

      // Implement functionality to navigate to main screen
    }
  };
  return (
    <SafeAreaView style={{margin: 50}}>
      <Button
        title="Add Car 1"
        onPress={() => {
          addCarOne();
        }}
      />
      <Button
        title="Add Car 2"
        onPress={() => {
          addCarTwo();
        }}
      />
      <Button
        title="Add Car 3"
        onPress={() => {
          addCarThree();
        }}
      />
    </SafeAreaView>
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

export default AddCarToList;