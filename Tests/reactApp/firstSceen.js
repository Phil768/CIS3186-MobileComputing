import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Button,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  queryEqual,
} from "firebase/firestore";
import { Firestore } from "firebase/firestore";
import { auth, db } from "./navigation/firebase";
import HomeScreen from "./navigation/screens/HomeScreen";

//Creating an explicit timeout to reload the app.
const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const FirstScreen = ({ navigation }) => {
  const [loading, setLoading] = React.useState(true); // Set loading to true on component mount
  const [users, setUsers] = React.useState([]); // Initial empty array of users
  const [input, setInput] = React.useState(""); // State to store the input of the user.
  const [refreshing, setRefreshing] = React.useState(false);
  //Adding data to the databse.
  let addData = async (data) => {
    const docRef = await addDoc(collection(db, "Users"), {
      Name: data,
      id: 6,
    });
  };
  //Seeing if the users are updating.
  console.log(users);
  //Function to get all the data from the databse.
  const getData = async () => {
    const q = query(collection(db, "Users"));
    const querySnapshot = await getDocs(q);
    const users = [];
    //Iterating through each document.
    querySnapshot.forEach((documentSnapshot) => {
      users.push({
        ...documentSnapshot.data(),
        key: documentSnapshot.id,
      });
    });
    setUsers(users);
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
    getData();
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }
  return (
    // <View>
    //   <View>
    //
    //   </View>
    <SafeAreaView style={styles.container}>
      <FlatList
        data={users}
        extraData={users}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              console.log(">>" + item.id);
              navigation.navigate("MainContainer", {
                screen: "HomeScreen",
                params: { id: item.id },
              });
            }}
          >
            <Text style={styles.item}>
              Name: {item.Name} Id: {item.id}
            </Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
    //</View>
  );
};

const styles = StyleSheet.create({
  container: {
    felx: 1,
    backgroundColor: "white",
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
    borderWidth: 1,
    borderBottomColor: "black",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default FirstScreen;
