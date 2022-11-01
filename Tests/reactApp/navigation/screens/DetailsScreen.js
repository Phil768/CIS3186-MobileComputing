import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Dimensions, Button } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

export default function DetailsScreen({ navigation }) {
  const [mapRegion, setMapRegion] = useState({
    latitude: 36.026666990852625,
    longitude: 14.240446219546584,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const userLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission denied");
      return;
    }
    let location = await Location.getCurrentPositionAsync({
      enableHighAccuracy: true,
    });
    setMapRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  useEffect(() => {
    userLocation;
  }, []);
  return (
    <View>
      <MapView style={styles.map} region={mapRegion}>
        <Button
          title="Get current location"
          onPress={userLocation}
          style={styles.button}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  button: {
    border: "1px solid black",
  },
});
