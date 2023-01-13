import * as React from "react";
import {
  StyleSheet,
  TextInput,
  Input,
  Button,
  SafeAreaView,
  Alert,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import { collection, addDoc, getDocs, query } from "firebase/firestore";
import { auth, db } from "../../configurations/index";
import filter from "lodash.filter";

const AddCarToList = ({ navigation }) => {
  const data = [{ key: "0BdTc", value: "test" }];
  //Getting the image for the background.
  const imageBg = require("../../assets/imageBg.png");
  //Creating a state which will determine the current selection of the dropdown.
  const [selected, setSelected] = React.useState({});
  //State to hold the search term.
  const [searchTerm, setSearchTerm] = React.useState("");
  //Creating a state which will hold all the data items.
  const [cars, setCars] = React.useState([]);
  //Details of current logged in user
  const currentUser = auth.currentUser;
  //Function to get all the data from the databse.
  const getData = async () => {
    const q = query(collection(db, "CarsInfo"));
    const querySnapshot = await getDocs(q);
    const c = [];
    // Iterating through each document.
    console.log("Iterating through querySnapshot " + querySnapshot);
    querySnapshot.forEach((documentSnapshot) => {
      var data = documentSnapshot.data();
      console.log(documentSnapshot.id);
      console.log("Data: " + data);
      c.push({
        value: documentSnapshot.data(),
        name: data.name,
        key: documentSnapshot.id,
      });
    });
    //Updating the state.
    setCars(c);
    setLoading(false);
  };
  //Loading the data before the app loads.
  React.useEffect(() => {
    getData();
    //Logging the status.
    return () => {
      console.log("Success");
    };
  }, []);
  console.log("Name: " + cars.key);
  //Adding the data to the database.
  let addCarOne = async () => {
    var carOneAlreadyExists = false;
    //Only allow to add new car if car does not exist already
    await db
      //Accessing the databse and getting the corresponding infomation if all the conditions are met.
      .collection("Cars")
      .where("name", "==", "Volkswagen Golf")
      .where("year", "==")
      .where("engine", "==")
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
        engine: 1.4,
      });
    } else {
      Alert.alert(
        "Car Already Added",
        "You cannot add a car that you already have.",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ]
      );
    }
    //Navigating back to the list page.
    navigation.navigate("List");
  };

  //Filterirng the data according to the search term.
  const filteredData = cars.filter((item) => item.name.includes(searchTerm));

  // let addCarTwo = async () => {
  //   var carTwoAlreadyExists = false;

  //   // Only allow to add new car if car does not exist already
  //   await db
  //     .collection("Cars")
  //     .where("name", "==", "Toyota Starlet")
  //     .where("email", "==", currentUser.email)
  //     .get()
  //     .then((snapshot) => {
  //       if (snapshot.size > 0) {
  //         console.log("Document already exists!");
  //         carTwoAlreadyExists = true;
  //       } else {
  //         console.log("Document does not exist!");
  //       }
  //     })
  //     .catch((err) => {
  //       console.log("Error getting documents", err);
  //     });

  //   if (!carTwoAlreadyExists) {
  //     // Add to new car to Cars collection
  //     const docRef = await addDoc(collection(db, "Cars"), {
  //       name: "Toyota Starlet",
  //       email: currentUser.email,
  //       year: 1998,
  //       consumptionPerKm: 0.057,
  //       fuelTankCapacity: 45,
  //       engine: 1.3,
  //     });
  //   } else {
  //     Alert.alert(
  //       "Car Already Added",
  //       "You cannot add a car that you already have.",
  //       [
  //         {
  //           text: "Cancel",
  //           onPress: () => console.log("Cancel Pressed"),
  //           style: "cancel",
  //         },
  //         { text: "OK", onPress: () => console.log("OK Pressed") },
  //       ]
  //     );
  //   }
  //   //Navigating back to the list page.
  //   navigation.navigate("List");
  // };
  //Returning the body of the screen.
  return (
    <ImageBackground
      source={imageBg}
      style={{ resizeMode: "cover", overflow: "hidden", flex: 1 }}
    >
      <SafeAreaView style={{ margin: 50 }}>
        <TextInput
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="Search..."
        />
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <TouchableOpacity>
              <Text>Name: {item.name}</Text>
            </TouchableOpacity>
          )}
        />
        <Button
          title="Add"
          onPress={() => {
            addCarOne();
          }}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};
//Exporting the function to be displayed on screen.
export default AddCarToList;
