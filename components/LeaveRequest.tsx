import React, {useContext, useMemo, useState} from 'react';
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
  Button,
  Platform,
  Alert,
  ScrollView,
  FlatList,
  Switch,
} from 'react-native';
// import { SelectList } from "react_native_simple_dropdown_select_list";
import DateTimePicker from '@react-native-community/datetimepicker';
// import SwitchToggle from "react-native-switch-toggle";
import {RadioButton} from 'react-native-paper';
// import Icon from "react-native-vector-icons/FontAwesome";
import {request, gql} from 'graphql-request';
import {MyContext} from './Model/Context';
import Icon from 'react-native-ico-universalicons';

const LeaveeRequestbyme = gql`
  query {
    leaveRequestsByMe {
      id
      requestedOn
      leaveType
      leaveFrom
      leaveTill
      totalDays
      halfDay
      reason
      halfDay
      lastUpdate
    }
  }
`;

const AddLeaveRequest = gql`
mutation ($id: String!){
  addRegularization($id: String!){
    input:{
      userId:"Q3VzdG9tVXNlclZpZXc6MQ=="
      checkIn:"05/21/2024, 02:15:00 AM"
      checkOut:"05/21/2024, 02:15:00 PM"
      reason:"ygduwhdu"
    }
  ){regularizationApproval{
    id
    checkIn
    checkOut
    requestedDate
    reason
    lastUpdate
  }}
    
  }

  
`;
const LeaveRequest = ({formik, name, title, navigation}: any) => {
  const [selected, setSelected] = React.useState();
  const [selected1, setSelected1] = React.useState('');
  const [Fromdate, setFromDate] = useState(new Date());
  const [FromDatePicker, setFromDatePicker] = useState(false);
  const [FromMode, setFromMode] = useState('date');
  const [Todate, setToDate] = useState(new Date());
  const [ToDatePicker, setToDatePicker] = useState(false);
  const [Tomode, setToMode] = useState('date');
  const [status, setStatus] = useState('checked');
  const [isOn, setIsOn] = useState(false);

  const [firstHalf, setFirstHalf] = React.useState('first');
  const [isEnabled, setIsEnabled] = useState(false);
  const [leave, setLeave] = useState(false);
  const [leaveType, setLeaveType] = useState('');
  const [halfDay, setHalfDay] = useState('');
  const [from, setFrom] = useState('');
  const [To, setTo] = useState('');
  const [duration, setDuration] = useState('');
  const [reason, setReason] = useState('');
  const {user, setUser} = useContext(MyContext);
  const [checked, setChecked] = useState('first');
  const [casualLeaveCount, setCasualLeaveCount] = useState(0);
  const [sickLeaveCount, setSickLeaveCount] = useState(0);
  const [privilegeLeaveCount, setPrivilegeLeaveCount] = useState(0);

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const FromDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || Fromdate;
    setFromDatePicker(false);
    currentDate.setHours(0, 0, 0, 0);
    setFromDate(currentDate);
  };

  const showMode = (currentMode: any) => {
    setFromDatePicker(true);
    setFromMode(currentMode);
  };

  const FromDateChangepicker = () => {
    showMode('date');
  };

  const ToDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || Todate;
    setToDatePicker(false);
    setToDate(currentDate);
  };

  const ToModeChange = (currentMode: any) => {
    setToDatePicker(true);
    setToMode(currentMode);
  };

  const ToDateChangepicker = () => {
    ToModeChange('date');
  };

  const url = 'http://192.168.0.166:8000/graphql/';

  const handleLeaveRequestbyme = () => {
    request(url, LeaveeRequestbyme)
      .then((response: any) => {
        console.log('leave request', response);
        setLeave(true);
        Alert.alert('Request Success');
      })
      .catch((err: any) => {
        console.log(err);
        Alert.alert('Invalid Request');
      });
  };

  const handleRadioButtonPress = (value: any) => {
    setChecked(value);
    if (value === 'first') {
      setCasualLeaveCount(casualLeaveCount + 1);
    } else if (value === 'second') {
      setSickLeaveCount(sickLeaveCount + 1);
    } else if (value === 'third') {
      setPrivilegeLeaveCount(privilegeLeaveCount + 1);
    }
  };

  const data1 = [
    {key: '1', value: 'First Half'},
    {key: '2', value: 'Second Half'},
  ];

  return (
    <View>
      <Text style={{fontSize: 23, marginLeft: 100, color: '#000'}}>
        Request Leave
      </Text>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <Text style={styles.text1}>{casualLeaveCount}</Text>
          <Text style={styles.text2}>{sickLeaveCount}</Text>
          <Text style={styles.text3}>{privilegeLeaveCount}</Text>
        </View>
        <View style={styles.container3}>
          <Text style={styles.text4}>Casual</Text>
          <Text style={styles.text5}>Sick</Text>
          <Text style={styles.text6}>Privilege</Text>
        </View>

        <View>
          <Text
            style={{
              fontSize: 20,
              color: '#000',
              marginLeft: 50,
              marginTop: 20,
            }}>
            Leave Type*
          </Text>

          <View style={{flexDirection: 'row', marginLeft: 43}}>
            <View style={{flexDirection: 'row'}}>
              <RadioButton
                value="first"
                status={checked === 'first' ? 'checked' : 'unchecked'}
                onPress={() => handleRadioButtonPress('first')}
              />
              <Text style={{top: 10, color: '#000'}}>Casual</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <RadioButton
                value="second"
                status={checked === 'second' ? 'checked' : 'unchecked'}
                onPress={() => handleRadioButtonPress('second')}
              />
              <Text style={{top: 10, color: '#000'}}>Sick</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <RadioButton
                value="third"
                status={checked === 'third' ? 'checked' : 'unchecked'}
                onPress={() => handleRadioButtonPress('third')}
              />
              <Text style={{top: 10, color: '#000'}}>Privilege</Text>
            </View>
            
            {/* <View style={{ flexDirection: "row" }}>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
                style={{ bottom: 1, left: 5 }}
              />
              <Text style={{ fontSize: 15, marginLeft: 2,color:'#000', marginTop: 7 }}>
                Half Day
              </Text>
            </View> */}
          </View>
        </View>
        <View>
          <Text
            style={{
              fontSize: 20,
              marginLeft: 50,
              marginTop: 20,
              color: '#000',
            }}>
            From*
          </Text>
          <View style={styles.fromDate}>
            <View style={styles.container1}>
              {FromDatePicker && (
                <DateTimePicker
                  value={Fromdate}
                  mode={FromMode}
                  is24Hour={true}
                  display="default"
                  onChange={FromDateChange}
                />
              )}
              <Icon
                name="monthly-calendar"
                size={50}
                color={'#039dfc'}
                onPress={FromDateChangepicker}
              />
            </View>
            <View style={styles.buttonContainer}>
              <Text style={{color: '#000'}}>{Fromdate.toLocaleDateString()}</Text>
              {/* <Button onPress={FromDateChangepicker} title="From Date" /> */}
              {/* <Button onPress={showTimepicker} title="Select Time" /> */}
            </View>
          </View>
        </View>
        <View>
          <Text
            style={{
              fontSize: 20,
              marginLeft: 50,
              marginTop: 20,
              color: '#000',
            }}>
            To*
          </Text>
          <View style={styles.ToDate}>
            <View style={styles.container2}>
              {ToDatePicker && (
                <DateTimePicker
                  value={Todate}
                  mode={Tomode}
                  is24Hour={true}
                  display="default"
                  onChange={ToDateChange}
                />
              )}
              <Icon
                name="monthly-calendar"
                size={30}
                color={'#039dfc'}
                onPress={ToDateChangepicker}
              />
            </View>
            <View style={styles.buttonContainer}>
              <Text style={{color: '#000'}}>{Todate.toLocaleDateString()}</Text>
              {/* <Button onPress={ToDateChangepicker} title="To Date" /> */}
              {/* <Button onPress={showTimepicker} title="Select Time" /> */}
            </View>
          </View>
        </View>
        {/* <View>
          <Text style={{ fontSize: 20, marginLeft: 50, marginTop: 20 }}>
            Half Day
          </Text>
          <View style={{ marginLeft: 50 }}>
            <SwitchToggle
              switchOn={isOn}
              onPress={() => setIsOn(!isOn)}
              circleColorOff="red"
              circleColorOn="#083320"
              backgroundColorOn="#6D6D6D"
              backgroundColorOff="#C4C4C4"
            />
          </View>
        </View> */}
        <View>
          <Text
            style={{
              fontSize: 20,
              marginLeft: 50,
              marginTop: 20,
              color: '#000',
            }}>
            Half Day Duration*
          </Text>
          <View style={{flexDirection: 'row', marginLeft: 45}}>
            <View style={{flexDirection: 'row'}}>
              <Switch
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
                style={{bottom: 1, left: 5}}
              />
              <Text style={{top: 10, color: '#000', left: 3}}>Half Day</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <RadioButton
                value="first"
                status={firstHalf === 'first' ? 'checked' : 'unchecked'}
                onPress={() => setFirstHalf('first')}
              />
              <Text style={{top: 10, color: '#000'}}>First Half</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <RadioButton
                value="second"
                status={firstHalf === 'second' ? 'checked' : 'unchecked'}
                onPress={() => setFirstHalf('second')}
              />
              <Text style={{top: 10, color: '#000'}}>Second Off</Text>
            </View>
          </View>
        </View>
        <View style={{marginLeft: 20}}>
          <Text
            style={{
              fontSize: 20,
              marginLeft: 35,
              marginTop: 20,
              color: '#000',
            }}>
            Reason*
          </Text>
          <TextInput
            style={styles.input1}
            placeholder="Reason"
            placeholderTextColor="#003f5c"
          />
        </View>
        <View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.navigate('BottomNavigate');
            }}>
            <Text style={{fontSize: 18, color: '#ffff', left: 30, top: 8}}>
              Request
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default LeaveRequest;
const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 50,
    paddingTop: 20,
  },
  container: {
    flexDirection: 'row',
    gap: 55,
    // justifyContent: "space-around",
    alignItems: 'center',
    padding: 10,
    marginTop: 10,
    marginLeft: 40,
  },
  container3: {
    flexDirection: 'row',
    gap: 55,
    // justifyContent: "space-around",
    alignItems: 'center',
    padding: 1,
    marginTop: -10,
    marginLeft: 50,
  },
  input1: {
    height: 50,
    width: 280,
    paddingHorizontal: 10,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 10,
    marginLeft: 30,
    top: 10,
  },
  input: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    fontSize: 16,
    marginBottom: 10,
  },
  title: {
    color: 'purple',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  container1: {
    // flex: 1,
    // backgroundColor: "#fff",
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 1,
  },
  container2: {
    // flex: 1,
    // backgroundColor: "#fff",
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginRight: 100,
  },
  button: {
    backgroundColor: '#32a852',
    borderRadius: 3,
    marginTop: 30,
    width: 120,
    height: 40,
    marginLeft: 120,
  },
  // roundedContainer: {
  //   borderRadius: 20, // Adjust the value as needed
  //   overflow: "hidden", // Ensures that the rounded corners are applied
  // },
  fromDate: {
    flexDirection: 'row',
    gap: 30,
    marginLeft: 70,
    marginTop: 10,
  },
  ToDate: {
    flexDirection: 'row',
    gap: 30,
    marginLeft: 70,
    marginTop: 10,
  },
  text1: {
    fontSize: 23,
    borderRadius: 40, // Adjust the value as needed
    overflow: 'hidden',
    backgroundColor: '#fcb103',
    color: '#000',
    padding: 5,
    width: 40,
    paddingLeft: 18,
  },
  text2: {
    fontSize: 23,
    borderRadius: 40, // Adjust the value as needed
    overflow: 'hidden',
    backgroundColor: '#03dbfc',
    color: '#000',
    padding: 5,
    width: 40,
    paddingLeft: 18,
  },
  text3: {
    fontSize: 23,
    borderRadius: 35, // Adjust the value as needed
    overflow: 'hidden',
    backgroundColor: '#b154e3',
    color: '#000',
    padding: 5,
    width: 40,
    paddingLeft: 18,
  },
  text4: {
    fontSize: 20,
    color: '#000',
  },
  text5: {
    fontSize: 20,
    color: '#000',
  },
  text6: {
    fontSize: 20,
    color: '#000',
  },
  countContainer: {
    marginTop: 20,
    marginLeft: 70,
  },
  countText: {
    fontSize: 15,
    color: '#000',
  },
});
