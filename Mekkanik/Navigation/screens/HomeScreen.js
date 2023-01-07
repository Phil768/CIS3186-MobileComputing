import * as React from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../../configurations/index";
import * as Location from "expo-location";

export default function HomeScreen(props) {
  /*Creating the required state to be used by the below function*/
  const [car, setCar] = React.useState({});
  const [kmYearDriven, setKmYearDriven] = React.useState(0);
  const [kmMonthDriven, setKmMonthDriven] = React.useState(0);
  const [kmDayDriven, setKmDayDriven] = React.useState(0);
  const [remainingPetrol, setRemainingPetrol] = React.useState(
    props.car.fuelTankCapacity
  );
  const [carRuns, setCarRuns] = React.useState([]);
  const [currentLocation, setCurrentLocation] = React.useState(null);
  const [previousLocation, setPreviousLocation] = React.useState(null);
  //Creating the appropriate constants to store the needed data.
  const currentUser = auth.currentUser;
  const today = new Date();
  const todaysDay = today.getDate();
  const todaysMonth = today.getMonth() + 1;
  const todaysYear = today.getFullYear();
  //Get the current location of the user before the function loads and store it into a variable.
  React.useEffect(() => {
    (async () => {
      const location = await getCurrentLocation();
      console.log(location);
      setCurrentLocation(location);
    })();
  }, []);
  //Calculating the corresponfing distance before the main function loads.
  React.useEffect(() => {
    if (previousLocation && currentLocation) {
      //Calculate the distance between the previous location and the current location
      const distance = calculateDistance(previousLocation, currentLocation);
      //If the distance is less than a certain threshold (e.g. 10 meters), we can assume the car has stopped
      if (distance < 10) {
        console.log("The car has stopped");
      }
    }
  }, [currentLocation]);
  //Setting the previos location to the current location every time the current location is updated.
  React.useEffect(() => {
    setPreviousLocation(currentLocation);
  }, [currentLocation]);
  /*Getting the current location*/
  async function getCurrentLocation() {
    const { status } = await Location.requestBackgroundPermissionsAsync();
    if (status !== "granted") {
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
  }
  //Calculate the distance traveled.
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
    //Getting the total distance travelled.
    var totalDistanceTravelled = parseFloat(((R * c) / 1000).toFixed(2)); //KM
    //Checking if distance is 0.
    if (totalDistanceTravelled > 0) {
      console.log("Total distance travelled:", totalDistanceTravelled);
      const docRef = addDoc(collection(db, "CarRuns"), {
        carId: props.car.id,
        kmDriven: totalDistanceTravelled,
        day: todaysDay,
        month: todaysMonth,
        year: todaysYear,
        isActive: true,
      });
    }
  }

  // console.log('Todays day:', todaysDay);
  // console.log('Todays month:', todaysMonth);
  // console.log('Todays year:', todaysYear);

  //Get the document from the database
  const documentPath = "Cars/" + props.car.id;
  //Getting the desired document
  const getCarData = async () => {
    const docRef = db.doc(documentPath);
    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          setCar(doc.data());
        } else {
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  };
  //Getting the distance traveled in the past year.
  const getThisYearsCarRunsData = async () => {
    let kmYearDriven = 0;
    const query = db
      .collection("CarRuns")
      .where("carId", "==", props.car.id)
      .where("year", "==", todaysYear);

    const querySnapshot = await getDocs(query);

    querySnapshot.forEach((documentSnapshot) => {
      var data = documentSnapshot.data();
      kmYearDriven = kmYearDriven + data.kmDriven;
    });

    setKmYearDriven(kmYearDriven);
  };
  //Getting the distance traveled in the past month.
  const getThisMonthsCarRunsData = async () => {
    let kmMonthDriven = 0;
    const query = db
      .collection("CarRuns")
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
  //Getting the distance traveled in the past day.
  const getTodaysCarRunsData = async () => {
    let kmDayDriven = 0;
    const query = db
      .collection("CarRuns")
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
  //Calculating the current fuel.
  const getCurrentFuelData = async () => {
    let currentPetrolUsed = 0;
    const query = db
      .collection("CarRuns")
      .where("carId", "==", props.car.id)
      .where("isActive", "==", true);

    const querySnapshot = await getDocs(query);

    querySnapshot.forEach((documentSnapshot) => {
      var data = documentSnapshot.data();
      //Calculatinf the current petrol used using basic arithmetic.
      currentPetrolUsed =
        currentPetrolUsed + data.kmDriven * props.car.consumptionPerKm;
    });
    //Setting the remaining petrol based on the current fuel tank capacity and the petrol used in session.
    setRemainingPetrol(props.car.fuelTankCapacity - currentPetrolUsed);
  };
  //Using react's useEffect in order to get the data automatically once the page has loaded.
  React.useEffect(() => {
    getCarData();
    getThisYearsCarRunsData();
    getThisMonthsCarRunsData();
    getTodaysCarRunsData();
    getCurrentFuelData();
  });
  //Returning the main body to be displayed on screen.
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      //Displaying the computed data.
      <Text>Car name: {car.name}</Text>
      <Text>Year: {car.year}</Text>
      <Text>Consumption (L) per KM: {car.consumptionPerKm}</Text>
      <Text>Fuel Tank Capacity (L): {car.fuelTankCapacity}</Text>
      <Text>Engine: {car.engine}</Text>
      <Text>
        Current Fuel: {remainingPetrol}/{props.car.fuelTankCapacity}
      </Text>
      <Text>KM Driven (this year): {kmYearDriven}</Text>
      <Text>KM Driven (this month): {kmMonthDriven}</Text>
      <Text>KM Driven (today): {kmDayDriven}</Text>
    </View>
  );
}
//Creating the styles for this screen.
const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
