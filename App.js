import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Registration from "./screens/Registration";
import MainMenu from "./screens/MainMenu";
import PassengerPage from "./screens/PassengerPage";
import DriverPage from "./screens/DriverPage";
import DriveDetailsPage from "./screens/DriveDetailsPage";
import RideArrangedPage from "./screens/RideArrangedPage";
import RideStartedPage from "./screens/RideStartedPage";

const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Registration">
        <Stack.Screen
          name="Registration"
          component={Registration}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="MainMenu"
          component={MainMenu}
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="PassengerPage"
          component={PassengerPage}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="DriverPage"
          component={DriverPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DriveDetailsPage"
          component={DriveDetailsPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RideArrangedPage"
          component={RideArrangedPage}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="RideStartedPage"
          component={RideStartedPage}
          options={{ headerShown: false, gestureEnabled: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
