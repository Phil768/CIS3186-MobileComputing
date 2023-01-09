import {
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ImageBackground
} from "react-native";
import * as React from "react";
import { db, auth } from "../../configurations/index";
import { collection, query, getDocs } from "firebase/firestore";

const CarLists = ({ navigation }) => {
  const currentUser = auth.currentUser;
  //console.log("Current user email: " + currentUser.email);
  const [loading, setLoading] = React.useState(true); // Set loading to true on component mount
  const [cars, setCars] = React.useState([]); // Initial empty array of cars
  const [refreshing, setRefreshing] = React.useState(false);
  const imageBg = require("../../assets/imageBg.png");

  // Seeing if the cars are updating.

  console.log(cars);

  // Function to get all the data from the databse.

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
    setCars(cars);
    console.log("Cars: " + cars);
    setLoading(false);
  };

  // Loading the data before the app loads.

  React.useEffect(() => {
    getData();
    //Logging the status.
    return () => {
      console.log("Success");
    };
  }, []);

  // Refreshing the page

  const onRefresh = React.useCallback(() => {
    getData();
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }
  return (
    <ImageBackground
  source={imageBg}
  style={{resizeMode: "cover",
          overflow: "hidden",
          flex: 1}}>
    <SafeAreaView style={styles.container} >
      <FlatList
        data={cars}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("MainContainer", {
                car: item
              });
            }}
          >
            <Text style={styles.item}>
              Name: {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    felx: 1,
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
    borderWidth: 2,
    borderBottomColor: "black",
    backgroundColor: '#f5f5f5'
    
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    
  },
});

export default CarLists;
