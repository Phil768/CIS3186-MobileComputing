# Instructions for Usability Study

## Application Information

Mekkanik makes use of mobile's GPS/location sensor to calculate the distance travelled by a car and displays information related to the car and distance travelled back to the user. Distance travelled is calculated using the [Haversine Formula](https://www.igismap.com/haversine-formula-calculate-geographic-distance-earth/). 

Information that is displayed back to the user is as follows:
- General Car Information (Name, make, etcetera)
- Distance (KM) travelled by specific car (split into current year, current month, and current day)
- Fuel remaining (Calculated as follows: find the fuel consumption value per 1 KM travelled for current car - then multiply value with KM driven)

## Prerequisites

For this usability study to work, we will be needing an Android device. For non-Android users, we have created a mock button that would simulate what would be inserted inside the database had the GPS location of your mobile phone changed, similar to what would happen when a car is driven.

**ANDROID USERS ONLY** -- **GPS Emulator** app will be used to mock and fake our current mobile location - please download this from the Play Store. After downloading follow instructions of this [video](https://youtu.be/XDfb5P12yMI) to learn how to mock your GPS location. NOTE: Unless done before, you will need to enable Android Developer Settings for this to work. If you do not want to download this, you can make use of the mock button created as well.

## Usability Study
For this usability study, to use our application, just download the Code from the github repository and save to your directory of choice. Open the application with your IDE of choice and run
```
npm install
```
to download necessary dependencies.

Now you can run 
```
npm expo start
```
to use Mekkanik.

Now, create an account, login and add a new car of your choice. After clicking on the newly added car let's mock our mobile's GPS location to update values related to that car. Follow instructions according to your device:

1. **ANDROID**: Select the added car, and you should now be in the Home Screen, without closing the application, open the **GPS Emulator** application and change your location. Navigate back to our application and wait for the KM Driven and Current Fuel values to update accordingly.

2. **IOS**: Go to the Settings Screen and click on the "Mock Moving Car" button. Now, go to the Home Screen and see that the KM Driven and Current Fuel values weare updated. NOTE: The mock moving button mocks the movement of the current car by 50KM.

Now, go back to the Settings tab and click on the "Reset Car" button. All values of the car should now be updated to their original values.

Now, go to the Map Section of the application and click on the 'Display near fuel stations' button to display fuel stations near your current location.

Go back to the Settings tab and log out.

Usability study is now done, feel free to mess around the application for a while. Afterwards, please fill in the usability study sheet provided [here](https://forms.gle/UBXQ2cH1Cz3EqCy69).