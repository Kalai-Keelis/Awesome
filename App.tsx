import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import MyProvider from './components/Model/Provider';
import {createStackNavigator} from '@react-navigation/stack';
import LoginForm from './components/Login';
// import {FontAwesome} from '@expo/vector-icons';
import CheckInOut from './components/Check';
import {NavigationContainer} from '@react-navigation/native';
import BottomNavigate from './components/BottomNavigate';
import Icon from 'react-native-ico-universalicons';
import AddEmployee from './components/AddEmployee';
import Regularization from './components/RegularizationRequest';
import AttenRegularization from './components/AttenRegularize';
import LeaveRequest from './components/LeaveRequest';

const Stack = createStackNavigator();

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function App({navigation}: any): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <MyProvider>
      <StatusBar animated={true} backgroundColor="#9d9dfa" />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            // name="Login"
            // headerMode="Login"
            component={LoginForm}
            options={{
              headerTitle: '',
              headerStyle: {
                backgroundColor: '#9d9dfa',
                height: 30,
              },
              headerTintColor: 'white',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
            name="HRMS"
          />

          <Stack.Screen
            component={CheckInOut}
            options={({navigation}: any) => ({
              headerTitle: '',
              headerStyle: {
                backgroundColor: '#9d9dfa',
                height: 65,
              },
              headerTintColor: 'white',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('BottomNavigate')}>
                  <Icon
                    name="arrow-turning-to-right"
                    size={30}
                    color="#fff"
                    style={{marginRight: 15}}
                  />
                </TouchableOpacity>
              ),
            })}
            name="Check"
          />
          <Stack.Screen
            component={BottomNavigate}
            options={({navigation}: any) => ({
              headerTitle: '',
              headerStyle: {
                backgroundColor: '#9d9dfa', // Customize header background color
                height: 85,
              },
              headerTintColor: 'white', // Customize header text color
              headerTitleStyle: {
                fontWeight: 'bold', // Customize header title style
              },
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('AddEmployee')}>
                  <Icon
                    name="plus-page-interface-add-symbol"
                    size={60}
                    color="#fff"
                    style={{marginRight: 25}}
                  />
                </TouchableOpacity>
              ),
            })}
            name="BottomNavigate"
          />
          <Stack.Screen
            component={AddEmployee}
            options={{
              headerTitle: '',
              headerStyle: {
                backgroundColor: '#9d9dfa', // Customize header background color
                height: 70,
              },
              headerTintColor: 'white', // Customize header text color
              headerTitleStyle: {
                fontWeight: 'bold', // Customize header title style
              },
            }}
            name="AddEmployee"
          />
          <Stack.Screen
          component={Regularization}
          options={{
            headerTitle: "",
            headerStyle: {
              backgroundColor: "#9d9dfa", // Customize header background color
              height: 80,
            },
            headerTintColor: "white", // Customize header text color
            headerTitleStyle: {
              fontWeight: "bold", // Customize header title style
            },
          }}
          name="RegularizationRequest"
        />
        <Stack.Screen
          component={AttenRegularization}
          options={{
            headerTitle: "",
            headerStyle: {
              backgroundColor: "#9d9dfa", // Customize header background color
              height: 80,
            },
            headerTintColor: "white", // Customize header text color
            headerTitleStyle: {
              fontWeight: "bold", // Customize header title style
            },
          }}
          name="AttenRegularize"
        />
        <Stack.Screen
          component={LeaveRequest}
          options={{
            headerTitle: "",
            headerStyle: {
              backgroundColor: "#9d9dfa", // Customize header background color
              height: 80,
            },
            headerTintColor: "white", // Customize header text color
            headerTitleStyle: {
              fontWeight: "bold", // Customize header title style
            },
          }}
          name="LeaveRequest"
        />
        </Stack.Navigator>
      </NavigationContainer>
    </MyProvider>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
