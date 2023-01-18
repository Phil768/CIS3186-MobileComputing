import * as React from "react";
import {
  StyleSheet,
  TextInput,
  ScrollView,
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
        key: documentSnapshot.id,
      });
    });
    //Updating the state.
    setCars(c);
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
  let addCar = async (car) => {
    var carOneAlreadyExists = false;
    //Only allow to add new car if car does not exist already
    await db
      //Accessing the databse and getting the corresponding infomation if all the conditions are met.
      .collection("Cars")
      .where("name", "==", car.name)
      .where("year", "==", car.year)
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
        name: car.name,
        email: currentUser.email,
        year: car.year,
        consumptionPerKm: car.consumption,
        fuelTankCapacity: car.fueltankCapacity,
        engine: car.engine,
        toggle: false,
      });
      Alert.alert(
        "Car added successfully",
        "Chosen car has been added, make sure to pull down and refresh the list to get latest update.",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }]
      );
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
  const filteredData = cars.filter(
    (item) =>
      item.value !== undefined &&
      item.value.name !== undefined &&
      item.value.name.includes(searchTerm)
  );
  //Returning the body of the screen.
  return (
    <ImageBackground
      source={imageBg}
      style={{ resizeMode: "cover", overflow: "hidden", flex: 1 }}
    >
      <SafeAreaView>
        <TextInput
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="Search..."
          style={styles.textInput}
        />
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.key}
          ListFooterComponent={<View style={{ height: 70 }} />}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                margin: 5,
              }}
              onPress={() => {
                addCar(item.value);
              }}
            >
              <View style={styles.item}>
                <Text style={styles.mainInput}>{item.value.name}</Text>
                <Text style={styles.subItem}>{item.value.year}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textInput: {
    fontSize: 20,
    height: 45,
    borderRadius: 10,
    padding: 7,
    marginTop: 20,
    marginVertical: 10,
    marginHorizontal: 10,
    backgroundColor: "#DDDDDD",
  },
  item: {
    marginTop: 20,
    padding: 20,
    marginHorizontal: 10,
    marginTop: 20,
    borderRadius: 0,
    borderWidth: 2,
    borderBottomColor: "black",
    backgroundColor: "#f5f5f5",
  },
  mainInput: {
    fontSize: 17,
  },
  subItem: {
    color: "#767b7e",
    fontStyle: "italic",
    fontsize: 14,
  },
});

//Exporting the function to be displayed on screen.
export default AddCarToList;
