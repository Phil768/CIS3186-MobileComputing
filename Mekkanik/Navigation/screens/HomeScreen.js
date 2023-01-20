import * as React from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  RefreshControl,
  ImageBackground,
  ScrollView,
  Image,
  Dimensions,
  Alert
} from "react-native";

import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  getDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

import { auth, db } from "../../configurations/index";
import * as Location from "expo-location";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from "react-native-chart-kit";

export default function HomeScreen(props) {
  /*Creating the required state to be used by the below function*/
  const [car, setCar] = React.useState({});
  const [totalKmDriven, setTotalKmDriven] = React.useState(0);
  const [kmYearDriven, setKmYearDriven] = React.useState(0);
  const [kmMonthDriven, setKmMonthDriven] = React.useState(0);
  const [kmDayDriven, setKmDayDriven] = React.useState(0);
  const [remainingOil, setRemainingOil] = React.useState(0);
  const [toggle, setToggle] = React.useState(false);
  const [remainingPetrol, setRemainingPetrol] = React.useState(
    props.car.fuelTankCapacity
  );
  const oilAverage = 4.5;
  const oilConsumptionAverage = 0.05;
  const [carRuns, setCarRuns] = React.useState([]);
  const [currentLocation, setCurrentLocation] = React.useState(null);
  const [previousLocation, setPreviousLocation] = React.useState(null);
  //Creating the appropriate constants to store the needed data.
  let remainingFuelPercentage;
  if (remainingPetrol / props.car.fuelTankCapacity <= 0){
    remainingFuelPercentage = 0;
  } else {
    remainingFuelPercentage = remainingPetrol / props.car.fuelTankCapacity;
  }
  const currentUser = auth.currentUser;
  const today = new Date();
  const todaysDay = today.getDate();
  const todaysMonth = today.getMonth() + 1;
  let todaysMonthLetters;
  switch(todaysMonth){
    case 1:
      todaysMonthLetters = "Jan";
    break;
    case 2:
      todaysMonthLetters = "Feb";
    break;
    case 3:
      todaysMonthLetters = "Mar";
    break;
    case 4:
      todaysMonthLetters = "Apr";
    break;
    case 5:
      todaysMonthLetters = "May";
    break;
    case 6:
      todaysMonthLetters = "Jun";
    break;
    case 7:
      todaysMonthLetters = "Jul";
    break;
    case 8:
      todaysMonthLetters = "Aug";
    break;
    case 9:
      todaysMonthLetters = "Sep";
    break;
    case 10:
      todaysMonthLetters = "Oct";
    break;
    case 11:
      todaysMonthLetters = "Nov";
    break;
    case 12:
      todaysMonthLetters = "Dec";
    break;

  }
  const todaysYear = today.getFullYear();
  //Importing the background image.
  const imageBg = require("../../assets/imageBg.png");
  //Function which fetches a data value for the current car.
  const getData = async () => {
    const query = doc(db, "Cars", props.car.id);
    const querySnapshot = await getDoc(query);
    let value = querySnapshot.data().toggle;
    console.log("TOGGLE", value);
    setToggle(!value);
  };

  //Running the above function upon render.
  React.useEffect(() => {
    getData();
    console.log("TOGGLE: " + toggle);
  }, []);
  //Function which handles the toggle button.
  async function handleToggle() {
    setToggle(!toggle);
    const carDoc = doc(db, "Cars", props.car.id);
    //Updating the field.
    await updateDoc(carDoc, {
      toggle: toggle,
    });
  }
  async function getCurrentLocation() {
    try {
      const status = await Location.requestForegroundPermissionsAsync();
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

  React.useEffect(() => {
    if (toggle) {
      async function refreshLocation() {
        const location = await getCurrentLocation();
        setCurrentLocation(location);
        console.log("Current location:", location);
      }
      refreshLocation();
      const intervalId = setInterval(() => {
        refreshLocation();
      }, 5000);
      return () => clearInterval(intervalId);
    } else {
      //do nothing.
    }
  }, [toggle]);

  // Calculating the corresponding distance everytime our current location changes
  React.useEffect(() => {
    if (toggle) {
      if (previousLocation && currentLocation) {
        //Calculate the distance between the previous location and the current location
        const distance = calculateDistance(previousLocation, currentLocation);
        //If the distance is less than a certain threshold (e.g. 10 meters), we can assume the car has stopped
        if (distance < 10) {
          console.log("The car has stopped");
        }
      }
      setPreviousLocation(currentLocation);
    } else {
      //do nothing.
    }
  }, [currentLocation]);

  // Calculate the distance traveled.
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
    // Getting the total distance travelled.
    var totalDistanceTravelled = parseFloat(((R * c) / 1000).toFixed(2)); //KM
    // Checking if distance is 0.
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

  // Get the document from the database
  const documentPath = "Cars/" + props.car.id;

  // Getting the desired document
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
  // Getting the distance traveled in the past year.
  const getThisYearsCarRunsData = async () => {
    let kmYearDriven = 0;
    const query = db
      .collection("CarRuns")
      .where("carId", "==", props.car.id)
      .where("year", "==", todaysYear);

    const querySnapshot = await getDocs(query);

    querySnapshot.forEach((documentSnapshot) => {
      var data = documentSnapshot.data();
      setTotalKmDriven(data.kmDriven);
      kmYearDriven = kmYearDriven + data.kmDriven;
    });

    setKmYearDriven(kmYearDriven);
  };
  // Getting the distance traveled in the past month.
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
  // Getting the distance traveled in the past day.
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
  // Calculating the current fuel.
  const getCurrentFuelData = async () => {
    let currentPetrolUsed = 0;
    let currentOilUsed = 0;
    const query = db
      .collection("CarRuns")
      .where("carId", "==", props.car.id)
      .where("isActive", "==", true);

    const querySnapshot = await getDocs(query);

    querySnapshot.forEach((documentSnapshot) => {
      var data = documentSnapshot.data();
      //Calculating the current petrol used using basic arithmetic.
      currentPetrolUsed = currentPetrolUsed + data.kmDriven * props.car.consumptionPerKm;
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
    const intervalId = setInterval(() => {
      getCarData();
      getThisYearsCarRunsData();
      getThisMonthsCarRunsData();
      getTodaysCarRunsData();
      getCurrentFuelData();
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  // Returning the main body to be displayed on screen.
  const dataProgressBarFuel = {
    labels: ["Oil", "Fuel"], // optional
    data: [
      (oilAverage - oilConsumptionAverage * kmDayDriven) / oilAverage,
      remainingFuelPercentage,
    ],
  };

  const dataBarChart = {
    labels: [`Year - ${todaysYear}`, `Month - ${todaysMonthLetters}`, `Day - ${todaysDay}`],
    datasets: [
      {
        data: [kmYearDriven, kmMonthDriven, kmDayDriven],
      },
    ],
  };

  return (
    <ImageBackground
      source={imageBg}
      style={{ resizeMode: "cover", overflow: "hidden", flex: 1 }}
    >
      <View style={styles.container}>
        <TouchableOpacity onPress={handleToggle} style={styles.button}>
          <Text style={styles.buttonText}>
            {toggle ? "Pause Journey" : "Start Journey"}
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        marginBottom={Dimensions.get("window").height * 0.17}
        contentContainerStyle={{
          paddingHorizontal: 15,
        }}
        vertical
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>General Car Details:</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.innerText}>Model: {car.name}</Text>
          <Text style={styles.innerText}>Year: {car.year}</Text>
          <Text style={styles.innerText}>
            Consumption (L/KM): {car.consumptionPerKm}
          </Text>
          <Text style={styles.innerText}>
            Fuel Tank Capacity (L): {car.fuelTankCapacity}L
          </Text>
          <Text style={styles.innerText}>Engine Size: {car.engine}</Text>
        </View>
        <View>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Fuel Status:</Text>
          </View>
          <ProgressChart
            data={dataProgressBarFuel}
            width={Dimensions.get("window").width - 30}
            height={160}
            strokeWidth={16}
            radius={32}
            chartConfig={{
              backgroundGradientFrom: "#233767",
              backgroundGradientFromOpacity: 1,
              backgroundGradientTo: "#233767",
              backgroundGradientToOpacity: 1,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              strokeWidth: 1, // optional, default 3
              barPercentage: 0.5,
              useShadowColorFromDataset: false, // optional
            }}
            hideLegend={false}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>
        <View style={{ marginBottom: 10 }}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Driving Breakdown:</Text>
          </View>
          <BarChart
            fromZero
            data={dataBarChart}
            width={Dimensions.get("window").width - 30}
            height={300}
            chartConfig={{
              paddingTop: "20%",
              backgroundColor: "#233767",
              backgroundGradientFrom: "#233767",
              backgroundGradientTo: "#233767",
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            }}
            style={{
              borderRadius: 16,
            }}
          />
        </View>
      </ScrollView>
    </ImageBackground>
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
  card: {
    height: 170,
    width: Dimensions.get("window").width - 30,
    marginVertical: 8,
    justifyContent: "center",
    backgroundColor: "#233767",
    borderRadius: 15,
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
  innerText: {
    color: "white",
    marginHorizontal: 24,
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "bold",
  },
  container: {
    padding: 10,
    marginHorizontal: 5,
  },
  titleContainer: {
    padding: 8,
    marginTop: 5,

  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white"
  },
});