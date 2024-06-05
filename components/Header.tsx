import * as React from "react";
import { Button, View } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
// import { NavigationContainer, useNavigation } from "@react-navigation/native";
import CustomDrawer from "./CustomDrawer";
import BottomNavigate from "./BottomNavigate";
// import { Ionicons } from "@expo/vector-icons";
import AddEmployee from "./AddEmployee";
import AttenRegularization from "./AttenRegularize";
import Regularization from "./RegularizationRequest";
import SignUp from "./SignIn";
// import CalendarAttendance from "./Calendars";
// import CounterTime from "./Counter";

const Drawer = createDrawerNavigator();

const Layout = () => {
  // const EmployeeDrawerIcon = ({ color, size }: any) => (
  //   <Ionicons name="people-outline" size={size} color={color} />
  // );

  return (
    <Drawer.Navigator
      initialRouteName="Login"
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        drawerStyle: {
          width: 230,
        },
      }}
    >
      {/* <Drawer.Screen name="BottomNavigate" component={BottomNavigate} /> */}
      <Drawer.Screen
        name="Reset Password"
        component={SignUp}
        options={{ swipeEnabled: false }}
      />
      <Drawer.Screen
        name="AddEmployee"
        component={AddEmployee}
        options={{ swipeEnabled: false }}
      />
      <Drawer.Screen
        name="Regularization"
        component={Regularization}
        options={{ swipeEnabled: false }}
      />
      <Drawer.Screen
        name="Attendance"
        component={AttenRegularization}
        options={{ swipeEnabled: false }}
      />

      {/* <Drawer.Screen
        name="AttenRegularize"
        component={AttenRegularization}
        options={{ swipeEnabled: false }}
      /> */}
      {/* <Drawer.Screen
        name="Employees"
        component={EmplopyeeScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <EmployeeDrawerIcon color={color} size={size} />
          ),
        }}
      /> */}
    </Drawer.Navigator>
  );
};
export default Layout;
