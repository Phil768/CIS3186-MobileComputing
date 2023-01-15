import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Dimensions, Button } from "react-native";
import MapView, {PROVIDER_GOOGLE, Marker } from "react-native-maps";
import * as Location from "expo-location";
//Main function of this screen.
export default function MapScreen({ navigation }) {
  markerState = ({myState:1});

  const [mapRegion, setMapRegion] = useState({
    latitude: 36.026666990852625,
    longitude: 14.240446219546584,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const displayFuelPumps = async () => {
    {
      markerState.myState == 1?
      <>
      {markerState.setState({myState: 2})}
      </>
      :
      <>
      {markerState.setState({myState: 1})}
      </>
     
    }
  };

  //Getting the permission from the user to access their location.
  const userLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission denied");
      return;
    }
    //Getting the actual location.
    let location = await Location.getCurrentPositionAsync({
      enableHighAccuracy: true,
    });
    //Setting the location on the map.
    setMapRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };
  //Using the useEffect to get the location before the function loads.
  useEffect(() => {
    userLocation();
  }, []);
  //Returning the main body of the function to be displayed on screen.
  return (
    <View>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map} 
        region={mapRegion}
      >
        {
          markerState.myState == 1?
          <>
          <Marker
        coordinate={{
        latitude: 35.9055,
        longitude: 14.43335,
        
        }}
      image={require('../../assets/mapmarker.png')}
      title="Petrol Pump Mosta"
      />

      <Marker
        coordinate={{
        latitude: 35.9415,
        longitude: 14.4113,
        
        }}
      image={require('../../assets/mapmarker.png')}
      title="Petrol Pump Burmarrad"
      />
      </>
      : null
      }
      </MapView>

      <View style={{ position: "absolute", bottom: 200, left: 20 }}>
      <Button
          title="Display Near Fuel Stations"
          onPress={displayFuelPumps}
          style={styles.button}
        />
        <Button
          title="Get current location"
          onPress={userLocation}
          style={styles.button}
        />
      </View>
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
  },
});
