import * as React from "react";
import { View, Text, TextInput, Button, StyleSheet, RefreshControl } from "react-native";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../../configurations/index";
import * as Location from 'expo-location';


export default function HomeScreen(props) {
  // Creating a state which will hold the current 'car' object.
  const [car, setCar] = React.useState({});
  const [kmYearDriven, setKmYearDriven] = React.useState(0);
  const [kmMonthDriven, setKmMonthDriven] = React.useState(0);
  const [kmDayDriven, setKmDayDriven] = React.useState(0);
  const [remainingPetrol, setRemainingPetrol] = React.useState(props.car.fuelTankCapacity);
  const [carRuns, setCarRuns] = React.useState([]);
  const currentUser = auth.currentUser;
  const today = new Date();
  const todaysDay = today.getDate();
  const todaysMonth = today.getMonth() + 1;
  const todaysYear = today.getFullYear();

  const [currentLocation, setCurrentLocation] = React.useState(null);
  const [previousLocation, setPreviousLocation] = React.useState(null);


  React.useEffect(() => {
    (async () => {
      const location = await getCurrentLocation();
      console.log(location);
      setCurrentLocation(location);
    })();
  }, []);

  React.useEffect(() => {
    if (previousLocation && currentLocation) {
      // Calculate the distance between the previous location and the current location
      const distance = calculateDistance(previousLocation, currentLocation);

      // If the distance is less than a certain threshold (e.g. 10 meters), we can assume the car has stopped
      if (distance < 10) {
        console.log('The car has stopped');
      }
    }
  }, [currentLocation]);

  React.useEffect(() => {
    setPreviousLocation(currentLocation);
  }, [currentLocation]);

  async function getCurrentLocation() {
    const { status } = await Location.requestBackgroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }
  
    const location = await Location.getCurrentPositionAsync({
      enableHighAccuracy: true,
    });
  
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  }

  function calculateDistance(loc1, loc2) {
    // Calculate the distance between two locations using the Haversine formula
    // More info: https://en.wikipedia.org/wiki/Haversine_formula
    const R = 6371e3; // Earth's radius in meters
    const lat1 = (loc1.latitude * Math.PI) / 180;
    const lat2 = (loc2.latitude * Math.PI) / 180;
    const deltaLat = ((loc2.latitude - loc1.latitude) * Math.PI) / 180;
    const deltaLon = ((loc2.longitude - loc1.longitude) * Math.PI) / 180;
  
    const a =
      Math.sin(deltaLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    var totalDistanceTravelled = parseFloat(((R * c) / 1000).toFixed(2)); //KM

    if (totalDistanceTravelled > 0){
      console.log('Total distance travelled:', totalDistanceTravelled);
      const docRef = addDoc(collection(db, "CarRuns"), {
        carId: props.car.id,
        kmDriven: totalDistanceTravelled,
        day: todaysDay,      
        month: todaysMonth,
        year: todaysYear,
        isActive: true
      });
    }
    
    
  }

  // console.log('Todays day:', todaysDay);
  // console.log('Todays month:', todaysMonth);
  // console.log('Todays year:', todaysYear);

  // Get the document from the database
  const documentPath = 'Cars/' + props.car.id;

  // Getting the desired document
  const getCarData = async () => {
    const docRef = db.doc(documentPath);
    // console.log(docRef);

    docRef.get().then((doc) => {
      if (doc.exists) {
        // console.log("Document data:", doc.data());
        setCar(doc.data());
      } else {
        console.log("No such document!");
      }
    }).catch((error) => {
      console.log("Error getting document:", error);
    });
  };

  const getThisYearsCarRunsData = async() => {
    let kmYearDriven = 0;
    const query = db
      .collection('CarRuns')
      .where("carId", "==", props.car.id)
      .where("year", "==", todaysYear);

    const querySnapshot = await getDocs(query);

    querySnapshot.forEach((documentSnapshot) => {
      var data = documentSnapshot.data();
      kmYearDriven = kmYearDriven + data.kmDriven;
    });

    setKmYearDriven(kmYearDriven);
  };

  const getThisMonthsCarRunsData = async() => {
    let kmMonthDriven = 0;
    const query = db
      .collection('CarRuns')
      .where("carId", "==", props.car.id)
      .where("month", "==", todaysMonth)
      .where("year", "==", todaysYear);

    const querySnapshot = await getDocs(query);

    querySnapshot.forEach((documentSnapshot) => {
      var data = documentSnapshot.data();
      kmMonthDriven = kmMonthDriven + data.kmDriven;
    });

    setKmMonthDriven(kmMonthDriven);
  };

  const getTodaysCarRunsData = async() => {
    let kmDayDriven = 0;
    const query = db
      .collection('CarRuns')
      .where("carId", "==", props.car.id)
      .where("month", "==", todaysMonth)
      .where("year", "==", todaysYear)
      .where("day", "==", todaysDay);

    const querySnapshot = await getDocs(query);

    querySnapshot.forEach((documentSnapshot) => {
      var data = documentSnapshot.data();
      kmDayDriven = kmDayDriven + data.kmDriven;
    });

    setKmDayDriven(kmDayDriven);
  };

  const getCurrentFuelData = async() => {
    let currentPetrolUsed = 0;
    const query = db
      .collection('CarRuns')
      .where("carId", "==", props.car.id)
      .where("isActive", "==", true);

    const querySnapshot = await getDocs(query);

    querySnapshot.forEach((documentSnapshot) => {
      var data = documentSnapshot.data();
      // console.log(data.kmDriven);
      // console.log(props.car.consumptionPerKm);
      currentPetrolUsed = currentPetrolUsed + (data.kmDriven * props.car.consumptionPerKm);
    });
    
    // console.log(currentPetrolUsed);
    
    setRemainingPetrol(props.car.fuelTankCapacity - currentPetrolUsed);
  }

  // Using react's useEffect in order to get the data automatically once the page has loaded.
  React.useEffect(() => {
    getCarData();
    getThisYearsCarRunsData();
    getThisMonthsCarRunsData();
    getTodaysCarRunsData();
    getCurrentFuelData();
  });

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <Text>Car name: {car.name}</Text>
      <Text>Year: {car.year}</Text>
      <Text>Consumption (L) per KM: {car.consumptionPerKm}</Text>
      <Text>Fuel Tank Capacity (L): {car.fuelTankCapacity}</Text>
      <Text>Engine: {car.engine}</Text>
      <Text>Current Fuel: {remainingPetrol}/{props.car.fuelTankCapacity}</Text>
      <Text>KM Driven (this year): {kmYearDriven}</Text>
      <Text>KM Driven (this month): {kmMonthDriven}</Text>
      <Text>KM Driven (today): {kmDayDriven}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
