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

const FirstScreen = ({ navigation }) => {
  const [loading, setLoading] = React.useState(true); // Set loading to true on component mount
  const [users, setUsers] = React.useState([]); // Initial empty array of users

  //Function to get all the data from the databse.
  const getData = async () => {
    const q = query(collection(db, "Users"));
    const querySnapshot = await getDocs(q);
    const users = [];

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

    return () => {
      console.log("Success");
    };
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }
  return (
    <View>
      <FlatList
        data={users}
        extraData={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("MainContainer")}
          >
            <Text style={styles.item}>
              Name: {item.Name} Id: {item.id}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
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
