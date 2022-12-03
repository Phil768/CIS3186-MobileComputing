import * as React from "react";
import { Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MainContainer from "./navigation/MainContainer";
import FirstScreen from "./firstSceen";
import HomeScreen from "./navigation/screens/HomeScreen";
import Add from "./Add";

const Stack = createStackNavigator();
function App() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator>
        <Stack.Screen
          name="FirstScreen"
          component={FirstScreen}
          options={({ navigation }) => ({
            headerRight: () => (
              <Button title="Add" onPress={() => navigation.navigate("Add")} />
            ),
          })}
        />
        <Stack.Screen name="Add" component={Add} />
        <Stack.Screen
          options={{ headerShown: false }}
          name="MainContainer"
          component={MainContainer}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
