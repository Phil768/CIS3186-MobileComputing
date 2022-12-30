import * as React from "react";
import { View, Text, Dimensions } from "react-native";

/*

Logout button - just logs the user out and navigates to login screen
Change car button - navigates user to car selection screen
Reset car button - reset values of currently selected car - car fuel and oil levels back to 100%

*/

export default function SettingsScreen({ navigation }) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text>Logout button to come here</Text>
      <Text>Change car button to come here</Text>
      <Text>Reset car button to come here</Text>
      <Text>To see the functionality of these buttons look at comments inside the code!</Text>
      
    </View>
  );
}