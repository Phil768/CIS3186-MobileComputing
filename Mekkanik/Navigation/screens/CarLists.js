import {
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ImageBackground,
} from "react-native";
import * as React from "react";
import { db, auth } from "../../configurations/index";
import { collection, query, getDocs } from "firebase/firestore";
//Main function of the screen.
const CarLists = ({ navigation }) => {
  const currentUser = auth.currentUser;
  //console.log("Current user email: " + currentUser.email);
  const [loading, setLoading] = React.useState(true); // Set loading to true on component mount
  const [cars, setCars] = React.useState([]); // Initial empty array of cars
  const [refreshing, setRefreshing] = React.useState(false);
  const imageBg = require("../../assets/imageBg.png");

  // Seeing if the cars are updating.

  console.log(cars);
  //Function to get all the data from the databse.
  const getData = async () => {
    const q = query(collection(db, "Cars"));
    const querySnapshot = await getDocs(q);
    const cars = [];
    // Iterating through each document.
    console.log("Iterating through querySnapshot " + querySnapshot);
    querySnapshot.forEach((documentSnapshot) => {
      var data = documentSnapshot.data();
      console.log(documentSnapshot.id);
      console.log("Data: " + data);
      if (data.email === currentUser.email) {
        cars.push({
          ...documentSnapshot.data(),
          id: documentSnapshot.id,
        });
      }
    });
    //Updating the state.
    setCars(cars);
    console.log("Cars: " + cars);
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
  //Refreshing the page
  const onRefresh = React.useCallback(() => {
    //Getting new data from db.
    getData();
  }, []);
  //Checks if the app is loading to return the appropriate icon.
  if (loading) {
    return <ActivityIndicator />;
  }
  //Returning the main body of the function.
  return (
    <ImageBackground
      source={imageBg}
      style={{ resizeMode: "cover", overflow: "hidden", flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <FlatList
          data={cars}
          contentContainerStyle={styles.container}
          style={styles.list}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              //Navigating to the navigation container.
              onPress={() => {
                navigation.navigate("MainContainer", {
                  car: item,
                });
              }}
            >
              <Text style={styles.item}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};
//Creating the main styles for the list.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  item: {
    marginTop: 20,
    padding: 20,
    fontSize: 17,
    marginHorizontal: 10,
    marginTop: 20,
    borderRadius: 0,
    borderWidth: 2,
    borderBottomColor: "black",
    backgroundColor: "#f5f5f5",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  list: {
    paddingBottom: 20,
  },
});
//Exporting the function to be viewed in the main screen.
export default CarLists;
