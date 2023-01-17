import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Dimensions, Button } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

//Main function of this screen.
export default function MapScreen({ navigation }) {
  //console. disableYellowBox = true;
  const [currentLocation, setCurrentLocation] = React.useState(null);
  const [lon, setLongitude] = useState(14.4845766);
  const [lat, setLatitude] = useState(35.8970063);
  const [nearbyGasStations, setNearbyGasStations] = useState([]);

  async function getCurrentLocation() {
    try {
      const status = await Location.requestBackgroundPermissionsAsync();
      if (status.status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }
      const location = await Location.getCurrentPositionAsync({
        enableHighAccuracy: true,
      });
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    async function refreshLocation() {
      const location = await getCurrentLocation();
      setCurrentLocation(location);
      try {
        setLongitude(location.longitude);
        setLatitude(location.latitude);
      } catch (error) {
        setLongitude(14.4845766);
        setLatitude(35.8970063);
      }
      console.log("Current location Map Screen:", location);
    }
    refreshLocation();
    const intervalId = setInterval(() => {
      refreshLocation();
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handleButtonPress = async () => {
    console.log("Inside function");
    if (lon && lat) {
      console.log("Searching for gas stations.");
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=50000&types=gas_station&key=AIzaSyDvuzOm5knBoIB2G1RFVBhAF-DGyYVaB1E`
        );
        const data = await response.json();
        console.log(data);
        setNearbyGasStations(data.results);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <View>
      <Button onPress={handleButtonPress} title="Search for Gas Stations" />
      <MapView
        style={styles.map}
        showsUserLocation
        initialRegion={{
          latitude: lat,
          longitude: lon,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {nearbyGasStations.map((gasStation) => (
          <Marker
            key={gasStation.place_id}
            coordinate={{
              latitude: gasStation.geometry.location.lat,
              longitude: gasStation.geometry.location.lng,
            }}
            title={gasStation.name}
            pinColor={"red"}
            description={gasStation.vicinity}
          ></Marker>
        ))}
      </MapView>
    </View>
  );
}
//Styling for this screen
const styles = StyleSheet.create({
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  button: {
    border: "1px solid black",
    bottom: 100,
  },
});
