import React, {ReactNode, useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Button,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import {request, gql} from 'graphql-request';
// import { FontAwesome } from "@expo/vector-icons";
import {MyContext} from './Model/Context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Icon} from 'react-native-paper';

const Checkin = gql`
  mutation checkin($id: String!) {
    checkInUpdate(id: $id) {
      checkin {
        id
        user {
          id
        }
      }
    }
  }
`;

const Checkout = gql`
  mutation checkout($id: String!) {
    checkOut(id: $id) {
      checkout {
        id
        lastUpdate
      }
    }
  }
`;
const LoginUpdate = gql`
  mutation login($id: String!) {
    login(id: $id) {
      set
    }
  }
`;
const LogData = gql`
  query login($id: String!) {
    login(Id: $id) {
      id
      login
      logout
      lastUpdate
    }
  }
`;
const LogoutUpdate = gql`
  mutation logout($id: String!) {
    logout(id: $id) {
      set
    }
  }
`;
const empAttendance = gql`
  query data($id: String!) {
    userAttendanceDetails(id: $id) {
      id
      checkIn
      checkOut
      lastUpdate
      totalWorkingHours
      user {
        id
        empid
        username
      }
    }
  }
`;
const CheckInOut = () => {
  const [status1, setStatus1] = useState(false);
  const [activate, setActivate] = useState(false);
  const [dataLogin, setDataLogin] = useState('');
  const [dataLogout, setDataLogout] = useState('');
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [data, setData] = useState([]);
  const {user, setUser, login, setLogin, logout, setLogout} =
    useContext(MyContext);
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const day = String(currentDate.getDate()).padStart(2, '0');
  const formattedDate: string = `${year}-${month}-${day}`;

  const variables1: any = {
    id: user.user.id,
  };

  const url = 'http://192.168.0.166:8000/graphql/';

  const handleCheckIn = () => {
    if (formattedDate !== dataLogout) {
      request(url, LoginUpdate, {
        id: user.user.id,
      }).then((response: any) => {
        console.log(response);
        setStatus1(true);
        setActivate(true);
        request(url, Checkin, {
          id: user.user.id,
        }).then((response: any) => {
          console.log(response);
          Alert.alert('CheckIn success!');
        });
      });
    } else {
      Alert.alert('Already CheckIN!');
    }
  };
  const handleCheckOut = () => {
    setIsCheckingOut(true);
    request(url, LogoutUpdate, {
      id: user.user.id,
    }).then((response: any) => {
      console.log(response);

      setStatus1(true);
      request(url, Checkout, {
        id: user.user.id,
      })
        .then((response: any) => {
          console.log(response);
          Alert.alert('CheckOut success!');
        })
        .catch((err: any) => {
          setIsCheckingOut(false);
        });
    });
  };
  const givenTime_2: Date = new Date(login);
  const givenTime_3: Date = new Date(logout);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, [currentTime]);

  const differenceInMillis =
    currentTime.getDate() == givenTime_3.getDate()
      ? givenTime_3.getTime() - givenTime_2.getTime()
      : currentTime.getTime() - givenTime_2.getTime();
  let differenceInSeconds = Math.floor(differenceInMillis / 1000);
  if (differenceInSeconds < 0) {
    differenceInSeconds = -differenceInSeconds;
  }

  const hours = Math.floor((differenceInSeconds / 3600) % 24);
  const minutes = Math.floor((differenceInSeconds % 3600) / 60);
  const seconds = differenceInSeconds % 60;

  const FetchData = () => {
    request(url, empAttendance, {id: user.user.id})
      .then((response: any) => {
        setData(response.userAttendanceDetails);
      })
      .catch(error => {
        console.error(error);
      });
    request(url, LogData, {id: user.user.id}).then((res: any) => {
      const updateTime = new Date(res.login.login);
      setLogin(res.login.login);
      const dateString = updateTime.toISOString().split('T')[0];
      setDataLogin(dateString);
      setLogout(res.login.logout);
      const date1 = new Date(res.login.logout);
      const dateString1 = date1.toISOString().split('T')[0];
      setDataLogout(dateString1);
      // console.log("login", res.login.login);
      setStatus1(false);
    });
  };
  const reload = status1 ? FetchData() : null;
  useEffect(() => {
    FetchData();
  }, [reload]);

  return (
    <View>
      <Text style={styles.txttt}>CheckIn & CheckOut</Text>
      <View
        style={{flexDirection: 'row', marginTop: 150, marginLeft: 20, gap: 30}}>
        {formattedDate == dataLogin ? (
          <View style={styles.container}>
            <Text style={styles.subtitle}>Running Timer</Text>
            <View style={styles.timer}>
              <Text style={styles.timeSeparator}></Text>
              <Text style={[styles.timeUnit, styles.hourUnit]}>{hours}</Text>
              <Text style={styles.timeSeparator}></Text>
              <Text style={[styles.timeUnit, styles.minuteUnit]}>
                {minutes}
              </Text>
              <Text style={styles.timeSeparator}></Text>
              <Text style={[styles.timeUnit, styles.secondUnit]}>
                {seconds}
              </Text>
              <Text style={styles.timeSeparator}></Text>
            </View>

            {/* <Text style={styles.timetitle}>H M S</Text> */}
          </View>
        ) : null}
        <Text style={{marginLeft: -20, color: '#000', fontSize: 19}}>
          CheckInTime: {login.split(' ')[1]}
        </Text>
        {/* <Text style={{marginLeft: -20,color:'#000',fontSize:19}}>CheckOutTime: {logout.split(' ')[1]}</Text> */}
        <View style={{flexDirection: 'row', marginLeft: 10, marginTop: -50}}>
          {formattedDate !== dataLogin ? (
            <TouchableOpacity onPress={handleCheckIn} style={styles.CheckIn}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 18,
                  marginLeft: 20,
                  marginTop: 10,
                }}>
                Check In
              </Text>
            </TouchableOpacity>
          ) : dataLogin !== dataLogout ? (
            <TouchableOpacity onPress={handleCheckOut} style={styles.CheckIn11}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 18,
                  marginLeft: 13,
                  marginTop: 7,
                }}>
                Check Out
              </Text>
            </TouchableOpacity>
          ) : null}
          {/* <Text style={{marginLeft: -20,color:'#000',fontSize:19}}>CheckOutTime: {logout.split(' ')[1]}</Text> */}
        </View>
      </View>
    </View>
  );
};
export default CheckInOut;

const styles = StyleSheet.create({
  txttt:{
    color:'#000',
    fontSize:20,
    fontWeight:'600',
    margin:'auto',
    top: 40
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 50,
    paddingTop: 20,
  },
  header: {
    backgroundColor: '#2723', // Example color
  },
  container: {
    // flex: 1,
    // backgroundColor: "#fff",
    marginBottom: 10,
    marginTop: -50,
  },
  enabledButton: {
    backgroundColor: '#264a2e',
    borderRadius: 10,
    width: 120,
    height: 40,
    marginLeft: 90, // Default color when button is enabled
  },
  disabledButton: {
    backgroundColor: '#ccc', // Color when button is disabled
    borderRadius: 10,
    width: 120,
    height: 40,
    marginLeft: 90,
  },
  textinfo: {
    margin: 10,
    textAlign: 'center',
    fontSize: 17,
  },
  card: {
    marginTop: 10,
    height: 60,
  },
  cardbox: {
    margin: 30,
    backgroundColor: '#ffff',
    padding: 10,
    width: 300,
    height: 150,
  },
  CTitle: {
    fontSize: 30,
    marginLeft: 70,
    marginRight: 0,
    marginTop: 15,
    width: 180,
    height: 50,
  },
  CTitle1: {
    fontSize: 30,
    marginLeft: 60,
  },
  CheckIn: {
    backgroundColor: '#264a2e',
    borderRadius: 18,
    width: 100,
    height: 40,
    marginLeft: 0,
  },
  container1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    marginTop: 100,
  },
  title: {
    fontSize: 17,
    marginBottom: 20,
  },
  calendarView: {
    top: -60,
    width: 300,
  },
  cardContainer: {
    // display: "flex",
    height: 200,
    width: 300,
    borderRadius: 0,
  },
  button1: {
    backgroundColor: '#841584',
    width: 50,
    height: 30,
    borderRadius: 5,
  },
  button2: {
    backgroundColor: '#195e41',
    width: 100,
    height: 40,
    borderRadius: 5,
  },
  button3: {
    backgroundColor: '#f21684',
    width: 100,
    height: 40,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#32a852',
    borderRadius: 3,
    marginTop: 30,
    width: 120,
    height: 40,
    marginLeft: 120,
  },
  container11: {
    // flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  title1: {
    fontSize: 30,
    fontWeight: 'bold',
    paddingVertical: 20,
    color: 'green',
  },
  subtitle: {
    marginBottom: 20,
    fontSize: 18,
    color: '#000',
  },
  timer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -10,
  },
  CheckIn11: {
    backgroundColor: '#fa112d',
    borderRadius: 18,
    width: 90,
    height: 35,
    marginLeft: -120,
  },
  CheckIn1: {
    backgroundColor: '#264a2e',
    borderRadius: 18,
    width: 120,
    height: 40,
    marginLeft: 10,
  },
  timeUnit: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  yearUnit: {
    backgroundColor: 'red',
    borderRadius: 15,
    color: 'white',
  },
  dayUnit: {
    backgroundColor: '#3498db',
    borderRadius: 15,
    color: 'white',
  },
  hourUnit: {
    backgroundColor: '#27ae60',
    borderRadius: 5,
    color: 'white',
  },
  minuteUnit: {
    backgroundColor: '#f39c12',
    borderRadius: 5,
    color: 'white',
  },
  secondUnit: {
    backgroundColor: '#9b59b6',
    borderRadius: 5,
    color: 'white',
    width: 50
  },
  timeSeparator: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 5,
    color: '#000',
  },
  timetitle: {
    fontSize: 17,
    padding: 10,
    paddingRight: 19,
    fontWeight: 'bold',
  },
});
