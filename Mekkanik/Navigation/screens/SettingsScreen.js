import * as React from "react";
import { View, Text, Dimensions, Button } from "react-native";
import { getAuth, signOut } from "firebase/auth";

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
      <Text>Reset car button to come here</Text>
      <Text>
        To see the functionality of these buttons look at comments inside the
        code!
      </Text>
    </View>
  );
}
