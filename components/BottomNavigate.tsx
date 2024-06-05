import React, {
  ReactNode,
  useContext,
  useEffect,
  useState,
  createRef,
} from 'react';
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
  Modal,
  Pressable,
} from 'react-native';
import {
  Provider,
  Appbar,
  Title,
  Paragraph,
  BottomNavigation,
  useTheme,
  Menu,
  IconButton,
  Divider,
} from 'react-native-paper';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-ico-universalicons';
import {Header, PricingCard, SearchBar} from 'react-native-elements';
// import ImagePicker from "react-native-image-picker";
import {request, gql} from 'graphql-request';
import {Calendar} from 'react-native-calendars';
import {Theme} from 'react-native-elements';
// import { Card } from "react-native-paper";
// import Icon from "react-native-vector-icons/FontAwesome";
// import DateTimePickerModal from "react-native-modal-datetime-picker";
import {Avatar, Card} from 'react-native-paper';
// import { FontAwesome } from "@expo/vector-icons";
import {MyContext} from './Model/Context';
import LeaveApproval from './LeaveApproval';

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
// const Checkin =gql`
// mutation checkin($id:String!){
//   checkIn(id:$id){
//     checkin{
//       id
//       lastUpdate
//     }
//   }
// }`;

// const Checkout = gql`
// mutation checkout($id:String!){
//   checkOut(id:$id){
//     checkout{
//       id
//       lastUpdate
//     }
//   }
// }`;
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

const userDetail = gql`
  query userDetail($id: String!) {
    userDetail(Id: $id) {
      id
      email
      username
      login
    }
  }
`;

interface CustomCalendarTheme {
  theme?: Theme;
  textDayFontSize?: number;
  textMonthFontSize?: number;
  textDayHeaderFontSize?: number;
  todayTextColor?: string;
  dayTextColor?: string;
  monthTextColor?: string;
  arrowColor?: string;
  textDisabledColor?: string;
  textDayFontWeight?: string;
  textMonthFontWeight?: string;
  textDayHeaderFontWeight?: string;
  textDayStyle?: {[key: string]: any};
  textMonthStyle?: {[key: string]: any};
  textDayHeaderStyle?: {[key: string]: any};
  todayBackgroundColor?: string;
  dayBackgroundColor?: string;
  selectedDayBackgroundColor?: string;
  selectedDayTextColor?: string;
}

const RequestTable = [
  {
    Id: '1',
    leave: '10/05/2024 - 14/05/2024',
    status: 'Approved',
    icon: 'user1',
  },
  {
    Id: '2',
    leave: '10/05/2024 - 14/05/2024',
    status: 'Rejected',
    icon: 'user2',
  },
  {
    Id: '3',
    leave: '10/05/2024 - 14/05/2024',
    status: 'Pending With HR',
    icon: 'user3',
  },
  {
    Id: '4',
    leave: '10/05/2024 - 14/05/2024',
    status: 'Pending With Manager',
    icon: 'user4',
  },
];

const BottomNavigate = ({navigation}: any) => {
  const [userData, setUserData] = useState([]);
  const [alertMessage, setAlertMessage] = useState([]);
  const [status, setStatus] = useState([]);
  const [status1, setStatus1] = useState(false);
  const [activate, setActivate] = useState(false);
  const [data, setData] = useState([]);
  const {user, setUser, login, setLogin, logout, setLogout} =
    useContext(MyContext);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showTabs, setShowTabs] = useState(true);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  
  // const [dataLogin, setDataLogin] = useState("");
  // const [dataLogout, setDataLogout] = useState("");
  // const [currentTime, setCurrentTime] = useState<Date>(new Date());
  // const currentDate = new Date();
  // const year = currentDate.getFullYear();
  // const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  // const day = String(currentDate.getDate()).padStart(2, "0");
  // const formattedDate: string = `${year}-${month}-${day}`;

  const variables: any = {
    id: user.user.id,
  };
  const variables1: any = {
    id: user.user.id,
  };

  const theme: CustomCalendarTheme = {
    textDayFontSize: 15,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 13,
    todayTextColor: '#6d95da',
    dayTextColor: '#2d4150',
    monthTextColor: '#6d95da',
    arrowColor: '#6d95da',
    textDisabledColor: '#b6c1cd',
    textDayFontWeight: '200',
    textMonthFontWeight: '300',
    textDayHeaderFontWeight: '200',
    textDayStyle: {fontWeight: '200'},
    textMonthStyle: {color: '#6d95da', fontWeight: '300', fontSize: 16},
    textDayHeaderStyle: {color: '#b6c1cd', fontSize: 13},
    todayBackgroundColor: '#6d95da',
    dayBackgroundColor: 'transparent',
    selectedDayBackgroundColor: '#6d95da',
    selectedDayTextColor: 'white',
  };

  const url = 'http://192.168.0.166:8000/graphql/';

  const FetchData = () => {
    request(url, empAttendance, {id: user.user.id})
      .then((response: any) => {
        setData(response.userAttendanceDetails);
      })
      .catch(error => {
        console.error(error);
      });
  };
  const reload = status1 ? FetchData() : null;
  useEffect(() => {
    FetchData();
  }, [reload]);

  const options_1: any = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Kolkata',
  };

  const givenTime_2: Date = new Date(login);
  const givenTime_3: Date = new Date(logout);

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     setCurrentTime(new Date());
  //   }, 1000);
  //   return () => clearInterval(intervalId);
  // }, [currentTime]);

  // const differenceInMillis =
  //   currentTime.getDate() == givenTime_3.getDate()
  //     ? givenTime_3.getTime() - givenTime_2.getTime()
  //     : currentTime.getTime() - givenTime_2.getTime();
  // let differenceInSeconds = Math.floor(differenceInMillis / 1000);
  // if (differenceInSeconds < 0) {
  //   differenceInSeconds = -differenceInSeconds;
  // }

  // const hours = Math.floor((differenceInSeconds / 3600) % 24);
  // const minutes = Math.floor((differenceInSeconds % 3600) / 60);
  // const seconds = differenceInSeconds % 60;

  // console.log("sam--->", hours, minutes, seconds);

  const HomeRoute = () => (
    <View style={styles.container}>
      {/* <Header
        barStyle="light-content"
        // leftComponent={{ icon: "menu", color: "#fff" }}
        centerComponent={{text: 'HRMS', style: {color: '#fff'}}}
        rightComponent={{
          color: '#fff',
          size: 30,
          onPress: () => navigation.navigate('AddEmployee'),
        }}
        containerStyle={{
          backgroundColor: '#9d9dfa',
          justifyContent: 'space-around',
          top: 0,
        }}
      /> */}
      {/* <StatusBar animated={true} backgroundColor="#9d9dfa" /> */}
      <View style={{backgroundColor: '#ffff', marginBottom: 700}}>
        <Text>Home</Text>
      </View>
      {/* <View
        style={{ flexDirection: "row", marginTop: 80, marginLeft: 20, gap: 30 }}
      >
        {formattedDate == dataLogin ? (
          <View style={styles.container}>
            <Text style={styles.subtitle}>Countdown Timer</Text>
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

          
          </View>
        ) : null}
        <Text style={{ marginLeft: -20 }}>
          CheckInTime: {login.split(" ")[1]}
        </Text>
        <View style={{ flexDirection: "row", marginLeft: 10, marginTop: -50 }}>
          {formattedDate !== dataLogin ? (
            // <TouchableOpacity onPress={handleCheckIn} style={styles.CheckIn}>
            //   <Text style={{ color: "white", marginLeft: 32, marginTop: 10 }}>
            //     Check In
            //   </Text>
            // </TouchableOpacity>
            <FontAwesome
              name="heart"
              size={40}
              color="green"
              onPress={handleCheckIn}
            />
          ) : dataLogin !== dataLogout ? (
            <FontAwesome
              name="heart"
              size={40}
              color="red"
              onPress={handleCheckOut}
            />
          ) : // <TouchableOpacity onPress={handleCheckOut} style={styles.CheckIn11}>
          //   <Text style={{ color: "white", marginLeft: 32, marginTop: 10 }}>
          //     Check Out
          //   </Text>
          // </TouchableOpacity>
          null}
        </View>
      </View> */}
    </View>
  );

  const LeaveRequest = (props: any) => (
    <View>
      <View style={{backgroundColor: '#fff'}}>
        <Text style={{fontSize: 18, left: 125, top: 5, color: '#000'}}>
          Leave Request
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {RequestTable.map((col: any, index: any) => (
          <Card style={styles.card}>
            {/* <Pressable
              style={[styles.buttonModal, styles.buttonOpen]}
              onPress={() => setModalVisible(true)}>
              <Text style={styles.textStyle}>Show Modal</Text>
            </Pressable> */}
            <Card.Content key={index}>
              <View
                style={{
                  // flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                {/* <Text>{index + 1}</Text> */}
                <Text style={{marginRight: 2, color: '#000', fontSize: 17}}>
                  {col.Id}
                </Text>
                <Text style={{marginLeft: 40, color: '#000', fontSize: 17}}>
                  {col.leave}
                </Text>
                <Text style={{marginLeft: 50, color: '#000', fontSize: 17}}>
                  {col.status}
                </Text>
                <Icon
                  onPress={() => setModalVisible(true)}
                  name="paragraph-justified-option-symbol-for-interface-of-five-parallel-horizontal-lines"
                  size={45}
                  color="#000"
                  style={{
                    fontWeight: '900',
                    left: 210,
                    fontSize: 50,
                    bottom:70
                  }}>{col.icon}</Icon>
              </View>
            </Card.Content>
          </Card>
        ))}
        <View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Pressable style={styles.modalText}>
                  <Text style={styles.textStyle1}>Edit</Text>
                </Pressable>
                <Pressable style={styles.modalText1}>
                  <Text style={styles.textStyle2}>Delete</Text>
                </Pressable>
                <Pressable
                  style={[styles.buttonModal, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}>
                  <Text style={styles.textStyle}>Close</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </View>
        <View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.navigate('LeaveRequest');
            }}>
            <Text style={{fontSize: 18, color: '#ffff', left: 18, top: 8}}>
              New Request
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );

  const AttenRoute = () => (
    <View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginLeft: -1,
          marginTop: 0,
          backgroundColor: '#ffff',
        }}>
        <Text
          style={{fontSize: 17, marginLeft: 60, color: '#000', marginTop: 20}}>
          Attendance Regularization
        </Text>
        <TouchableOpacity
          style={{marginLeft: 10}}
          onPress={() => {
            navigation.navigate('AttenRegularize');
          }}>
          <Icon
            name="open-folder-with-plus-sign"
            size={45}
            color="#000"
            style={{fontWeight: '900', left: 20, fontSize: 50, top: 10}}
          />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container1}>
          <Calendar
            onDayPress={day => console.log('selected day', day)}
            minDate={'2018-04-20'}
            startDate={'2018-04-30'}
            endDate={'2018-05-05'}
            theme={theme}
            style={styles.calendarView}
          />

          <View>
            <View style={styles.cardContainer}>
              {data.map((check: any, index: any) => (
                <Card.Actions key={index} style={{right: 0, top: 5}}>
                  <TouchableOpacity style={styles.button1}>
                    {/* <Icon name="calendar" size={20} color="#fff" /> */}
                    <Text
                      style={{
                        fontSize: 15,
                        color: '#ffff',
                        fontWeight: '700',
                        left: 13,
                        top: 6,
                      }}>
                      {new Date(check.checkIn).getDate()}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button2}>
                    <Text
                      style={{
                        fontSize: 15,
                        color: '#ffff',
                        fontWeight: '700',
                        left: 13,
                        top: 6,
                      }}>
                      Check In{' '}
                      {check.checkIn != null ? check.checkIn.split('T')[1] : ''}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button3}>
                    <Text
                      style={{
                        fontSize: 15,
                        color: '#ffff',
                        fontWeight: '700',
                        left: 13,
                        top: 6,
                      }}>
                      Check Out{' '}
                      {check.checkout != null
                        ? check.checkOut.split('T')[1]
                        : ''}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Icon
                      name="cloud-black-shape-with-three-dots-inside" // Use "dots-vertical" for MaterialCommunityIcons instead of "ellipsis-v"
                      size={25}
                      color="#000"
                      style={{
                        fontWeight: '700',
                        left: 10,
                      }}
                    />
                  </TouchableOpacity>
                </Card.Actions>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
  const DepartRoute = () => (
    <View>
      <LeaveApproval />
    </View>
  );

  const _goBack = () => console.log('Went back');
  const _handleSearch = () => console.log('Searching');
  const _handleMore = () => console.log('Shown more');

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'Home', title: 'Home', icon: 'home'},
    {
      key: 'LeaveRequest',
      title: 'LeaveRequest',
      icon: 'id-card-interface-symbol',
    }, // Custom icon name
    {key: 'Attendance', title: 'Attendance', icon: 'graphic-page'}, // Custom icon name
    {key: 'Department', title: 'Leave Approval', icon: 'home-sign'}, // Custom icon name
  ]);

  const renderIcon = ({route, color}: any) => {
    return <Icon name={route.icon} size={24} color={color} />;
  };

  const renderScene = BottomNavigation.SceneMap({
    Home: HomeRoute,
    LeaveRequest: LeaveRequest,
    Attendance: AttenRoute,
    Department: DepartRoute,
  });

  return (
    <Provider>
      {/* <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={_goBack} />
        <Appbar.Content title="Mywebtuts" subtitle="Subtitle" />
        <Appbar.Action icon="magnify" onPress={_handleSearch} />
        <Appbar.Action icon="dots-vertical" onPress={_handleMore} />
      </Appbar.Header> */}
      <BottomNavigation
        navigationState={{index, routes}}
        onIndexChange={setIndex}
        renderScene={renderScene}
        renderIcon={renderIcon} // Render custom icons
        style={{backgroundColor: '#fff'}}
      />
    </Provider>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    // flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 850,
    paddingTop: 20,
    backgroundColor: '#ffff',
  },
  header: {
    backgroundColor: '#ffff', // Example color
  },
  container: {
    // flex: 1,
    backgroundColor: '#fff',
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
    height: 100,
    width: 250,
    backgroundColor: '#ffff',
    borderRadius: 1,
    marginLeft: 50,
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
    borderRadius: 10,
    width: 120,
    height: 40,
    marginLeft: 90,
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
  },
  timer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -10,
  },
  CheckIn11: {
    backgroundColor: '#264a2e',
    borderRadius: 1,
    width: 120,
    height: 40,
    marginLeft: 10,
  },
  CheckIn1: {
    backgroundColor: '#fa112d',
    borderRadius: 1,
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
  },
  timeSeparator: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 5,
  },
  timetitle: {
    fontSize: 17,
    padding: 10,
    paddingRight: 19,
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 0,
    // },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    left: 20,
    bottom: 170,
  },
  buttonModal: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textStyle1: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    top: 4,
  },
  textStyle2: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    top: 4,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#32a852',
    width: 70,
    height: 25,
    borderRadius: 2,
  },
  modalText1: {
    marginBottom: 15,
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#fa1616',
    width: 70,
    height: 25,
    borderRadius: 2,
  },
});

export default BottomNavigate;
