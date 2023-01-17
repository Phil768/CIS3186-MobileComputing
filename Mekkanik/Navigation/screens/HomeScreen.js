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
  Dimensions
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
  StackedBarChart
} from "react-native-chart-kit";

export default function HomeScreen(props) {
  /*Creating the required state to be used by the below function*/
  const [car, setCar] = React.useState({});
  const [kmYearDriven, setKmYearDriven] = React.useState(0);
  const [kmMonthDriven, setKmMonthDriven] = React.useState(0);
  const [kmDayDriven, setKmDayDriven] = React.useState(0);
  const [toggle, setToggle] = React.useState(false);
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
  //Importing the background image.
  const imageBg = require("../../assets/imageBg.png");
  //Function which fetches a data value for the current car.
  const getData = async () => {
    const query = doc(db, "Cars", props.car.id);
    const querySnapshot = await getDoc(query);
    let value = querySnapshot.data().toggle;
    console.log("VALUE", value);
    setToggle(!value);
  };

  const dataProgressBarOil = {
    labels: ["brake", "engine", "cool liqd"], // optional
    data: [0.65, 0.7, 0.8]
  };

  const dataProgressBarFuel = {
    labels: ["Elec", "Oil"], // optional
    data: [0.3, 0.7]
  };

  const dataLineChartOilCons ={
    labels: ["October", "November", "December", "January"],
    datasets: [{data: [32.7, 21.1, 38.9, 45.2,]}]
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
    if (toggle) {
      getThisYearsCarRunsData();
      getThisMonthsCarRunsData();
      getTodaysCarRunsData();
      getCurrentFuelData();
    } else {
      //do nothing.
    }
  }, [toggle]);
  // Returning the main body to be displayed on screen.
  return (
    <ImageBackground
      source={imageBg}
      style={{ resizeMode: "cover", overflow: "hidden", flex: 1 }}
    >
      <View style={styles.container}>
        <TouchableOpacity onPress={handleToggle} style={styles.button}>
          <Text style={styles.buttonText}>{toggle ? "Pause" : "Start"}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
      marginBottom={Dimensions.get("window").height * 0.15}
        contentContainerStyle={{
          paddingHorizontal: 15,
          
        }}
        vertical
        showsVerticalScrollIndicator={false}
      >

<View >
  <LineChart
    data={dataLineChartOilCons}
    width={Dimensions.get("window").width -30} // from react-native
    height={220}
    yAxisLabel=""
    yAxisSuffix="L"
    yAxisInterval={1} // optional, defaults to 1
    chartConfig={{
      backgroundColor: "#233767",
      backgroundGradientFrom: "#233767",
      backgroundGradientTo: "#233767",
      decimalPlaces: 2, // optional, defaults to 2dp
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      style: {
        borderRadius: 16
      },
      propsForDots: {
        r: "6",
        strokeWidth: "2",
        stroke: "#ffa726"
      }
    }}
    bezier
    style={{
      marginVertical: 8,
      borderRadius: 16,

    }}
  />
</View>

<View>
<ProgressChart
  data={dataProgressBarOil}
  width={Dimensions.get("window").width -30}
  height={220}
  strokeWidth={16}
  radius={32}
  chartConfig={chartConfig}
  hideLegend={false}
  style={{
      marginVertical: 8,
      borderRadius: 16,
    }}
/>
</View>

<View>
<ProgressChart
  data={dataProgressBarFuel}
  width={Dimensions.get("window").width -30}
  height={220}
  strokeWidth={16}
  radius={32}
  chartConfig={chartConfig}
  hideLegend={false}
  style={{
      marginVertical: 8,
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
    height: 200,
    width: 300,

    justifyContent: "center",
    backgroundColor: "#DDDDDD",
    margin: 15,
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
    fontFamily: "Helvetica",
    fontWeight: "bold",
  },
  container: {
   
  },
});

const chartConfig = {
  backgroundGradientFrom: "#233767",
  backgroundGradientFromOpacity: 1,
  backgroundGradientTo: "#233767",
  backgroundGradientToOpacity: 1,
  color: (opacity = 1) => `rgba(242, 176, 101, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false,// optional
  
  
};
