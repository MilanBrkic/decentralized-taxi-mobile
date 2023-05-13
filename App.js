import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Registration from "./screens/Registration";
import MainMenu from "./screens/MainMenu";
import PassengerPage from "./screens/PassengerPage";
import DriverPage from "./screens/DriverPage";
import DriveDetailsPage from "./screens/DriveDetailsPage";

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
          }}
        />
        <Stack.Screen
          name="PassengerPage"
          component={PassengerPage}
          options={{ headerShown: false }}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
