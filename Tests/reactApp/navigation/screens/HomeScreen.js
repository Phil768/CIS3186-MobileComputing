import * as React from "react";
import { View, Text } from "react-native";
import { ListItem, Avatar } from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

export default function HomeScreen({ navigation }) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <>
        <ListItem
          leadingMode="avatar"
          leading={
            <Avatar
              image={{ uri: "https://mui.com/static/images/avatar/1.jpg" }}
            />
          }
          title="Brunch this weekend?"
          secondaryText="I'll be in your neighborhood doing errands this…"
        />
        <ListItem
          leadingMode="avatar"
          leading={
            <Avatar
              image={{ uri: "https://mui.com/static/images/avatar/2.jpg" }}
            />
          }
          title="Summer BBQ"
          secondaryText="Wish I could come, but I'm out of town this…"
        />
        <ListItem
          leadingMode="avatar"
          leading={
            <Avatar
              image={{ uri: "https://mui.com/static/images/avatar/3.jpg" }}
            />
          }
          title="Oui Oui"
          secondaryText="Do you have Paris recommendations? Have you ever…"
        />
      </>
    </View>
  );
}
