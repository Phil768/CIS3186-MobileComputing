import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Button,
  TouchableOpacity,
  Image,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import polyline from "polyline";
import { decode } from "google-polyline";

//Main function of this screen.
export default function MapScreen({ navigation }) {
  //console. disableYellowBox = true;
  const [currentLocation, setCurrentLocation] = React.useState(null);
  const [markerPress, setMarkerPress] = React.useState(false);
  const [gasPress, setGasPress] = React.useState(false);
  const [lon, setLongitude] = useState(14.4845766);
  const [lat, setLatitude] = useState(35.8970063);
  const [nearbyGasStations, setNearbyGasStations] = useState([]);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [markerCoordinates, setMarkerCoordinates] = useState({});

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
        setLongitude(14.485275910750046);
        setLatitude(35.901847041279204);
      }
      console.log("Current location Map Screen:", location);
    }
    refreshLocation();
    const intervalId = setInterval(() => {
      refreshLocation();
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  //Function which displays the route on screen.
  const getRoute = async () => {
    try {
      //Storing the API key int a variable.
      const API_KEY = "AIzaSyDvuzOm5knBoIB2G1RFVBhAF-DGyYVaB1E";
      //Storing the latitude and lotitude as variables in as string.
      const origin = `${lat}, ${lon}`;
      //Storing the destination in a variable.
      const destination = `${markerCoordinates.latitude}, ${markerCoordinates.longitude}`;
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${API_KEY}`;
      const { data } = await axios.get(url);
      console.log("STATUS", data);
      console.log("STATUS", data.geocoded_waypoints[0].geocoder_status);
      if (data.geocoded_waypoints[0].geocoder_status === "OK") {
        console.log("HIT");
        const points = decode(data.routes[0].overview_polyline.points);
        const coordinates = points.map((point) => ({
          latitude: point[0],
          longitude: point[1],
        }));
        setRouteCoordinates(coordinates);
      }
      console.log("ROUTE COORDINATES: ", routeCoordinates);
    } catch (e) {
      console.log(e);
    }
  };

  const handleMarkerPress = (event) => {
    console.log("PRESSED");
    const { coordinate } = event.nativeEvent;
    console.log("COORDINATES", coordinate.latitude, coordinate.longitude);
    setMarkerCoordinates({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
    });
    getRoute();
  };

  const handleDirectionButtonPress = () => {
    setMarkerPress(!markerPress);
  };

  const handleButtonPress = async () => {
    setGasPress(!gasPress);
    console.log("Inside function");
    if (lon && lat) {
      console.log("Searching for gas stations.");
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=5000&types=gas_station&key=AIzaSyDvuzOm5knBoIB2G1RFVBhAF-DGyYVaB1E`
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
    <View style={styles.container}>
      <View style={{ padding: 10 }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleButtonPress}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            {gasPress
              ? "Hide nearest gas stations"
              : "Show nearest gas stations"}
          </Text>
        </TouchableOpacity>
      </View>
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
        {gasPress &&
          nearbyGasStations.map((gasStation) => (
            <Marker
              key={gasStation.place_id}
              coordinate={{
                latitude: gasStation.geometry.location.lat,
                longitude: gasStation.geometry.location.lng,
              }}
              title={gasStation.name}
              pinColor={"red"}
              description={gasStation.vicinity}
              onPress={handleMarkerPress}
            ></Marker>
          ))}
        {markerPress && (
          <Polyline
            coordinates={routeCoordinates}
            strokeWidth={2}
            strokeColor="red"
          />
        )}
      </MapView>
      <View style={styles.directionsButton}>
        <TouchableOpacity
          onPress={handleDirectionButtonPress}
          style={
            markerPress
              ? styles.directionsButtonTextClicked
              : styles.directionsButtonText
          }
        >
          <Image
            source={require("../../assets/signpost.png")}
            style={styles.image}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
//Styling for this screen
const styles = StyleSheet.create({
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    flex: 1,
  },
  button: {
    backgroundColor: "#545150",
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Roboto",
    fontWeight: "bold",
  },
  directionsButtonClicked: {
    position: "absolute",
    bottom: 140,
    right: 20,
  },
  imageClicked: {
    height: 40,
    width: 30,
  },
  directionsButtonTextClicked: {
    backgroundColor: "#545150",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    height: 50,
    width: 50,
    opacity: 1,
  },
  directionsButton: {
    position: "absolute",
    bottom: 140,
    right: 20,
    opacity: 5,
  },
  image: {
    height: 40,
    width: 30,
    opacity: 4,
  },
  directionsButtonText: {
    backgroundColor: "#545150",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    height: 50,
    width: 50,
    opacity: 0.5,
  },
  container: {
    flex: 1,
  },
});
