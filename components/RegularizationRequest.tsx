import React, { useContext, useState } from "react";
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
  Button,
  Platform,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { request, gql } from "graphql-request";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { MyContext } from "./Model/Context";


const Regularize = gql`
  mutation regularizationreq(
    $userid: String
    $checkIn: String
    $checkOut: String
    $reason: String
  ) {
    addRegularization(
      input: {
        userId: $userid
        checkIn: $checkIn
        checkOut: $checkOut
        reason: $reason
      }
    ) {
      regularizationApproval {
        id
        checkIn
        checkOut
        status
      }
    }
  }
`;

const Regularization = ({ navigation }: any) => {
  // const [date, setDate] = useState(new Date());
  // const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [visible, setVisible] = useState(false);
  const [From, setFrom] = useState(new Date());
  const [To, setTo] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [currentSetting, setcurrentSetting] = useState("from");
  const [userId, setUserId] = useState("");
  const [checkIn, setCheckIn] = useState(new Date());
  const [checkOut, setCheckOut] = useState(new Date());
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const { user, setUser } = useContext(MyContext);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDatePickerVisible1, setDatePickerVisibility1] = useState(false);

  //   const handleDateChange = (newDate: any) => {
  //     setDate(newDate);
  //   };

  console.log("user@@@@", user);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: any) => {
    console.warn("A date has been picked: ", typeof date);
    const utcTime = new Date(String(date));
    const istTime = date.toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    });
    console.log("istime", typeof istTime);
    console.log(new Date(istTime));
    setCheckIn(istTime);
    hideDatePicker();
  };
  console.log("timeeee", checkIn);

  const showDatePicker1 = () => {
    setDatePickerVisibility1(true);
  };

  const hideDatePicker1 = () => {
    setDatePickerVisibility1(false);
  };
  const handleConfirm1 = (date: any) => {
    console.log("yewssss");

    console.warn("A date has been picked: ", typeof date);
    const utcTime = new Date(String(date));
    const istTime1 = date.toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    });
    console.log("istime", typeof istTime1);
    console.log(new Date(istTime1));
    setCheckOut(istTime1);
    hideDatePicker1();
  };

  const handleRegularize = () => {
    const url = "http://192.168.0.166:8000/graphql/";

    console.log("Yessss");

    try {
      request(url, Regularize, {
        userid: user.user.id,
        checkIn: checkIn,
        checkOut: checkOut,
        reason: reason,
      })
        .then((response: any) => {
          Alert.alert("Request Successfully");
          console.log("response--->", response);
        })
        .catch((error) => {
          console.error(error);
          Alert.alert("Invalid Request");
        });
    } catch (error) {
      console.error(error);
    }
  };

  const onChange = (event: any, selectedDate: any) => {
    if (currentSetting === "from") {
      const currentDate = selectedDate || From;
      setShow(Platform.OS === "ios");
      setFrom(currentDate);
    } else {
      const currentDate = selectedDate || To;
      setShow(Platform.OS === "ios");
      setTo(currentDate);
    }
  };
  const showTimepicker = (current: any) => {
    setShow(true);
    setcurrentSetting(current);
  };

  return (
    <View>
      <View style={styles.inputView}>
        <Text style={{ fontSize: 17, left: 55,color:'#000' }}>Regularize Request</Text>
        {/* <TextInput
          style={styles.input}
          placeholder="UserID"
          placeholderTextColor="#003f5c"
          value={userId}
          onChangeText={(text) => setUserId(text)}
          autoCorrect={false}
          autoCapitalize={"none"}
        /> */}
        {/* <TextInput
          value={date.toLocaleDateString()}
          style={[styles.input, { fontSize: 19 }]}
          placeholder="Auto Fetch"
          placeholderTextColor="#003f5c"
          //  secureTextEntry={true}
          autoCorrect={false}
          //  autoCapitalize="none"
          editable={false}
        /> */}
        {/* <Button
          title="Auto Fetch"
          onPress={() => {handleDateChange
            // Show a date picker modal here
          }}
          disabled={true}
        /> */}
        <Button title="Check IN" onPress={showDatePicker} />
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="datetime"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
        <Button title="Check Out" onPress={showDatePicker1} />
        <DateTimePickerModal
          isVisible={isDatePickerVisible1}
          mode="datetime"
          onConfirm={handleConfirm1}
          onCancel={hideDatePicker1}
        />
        {/* <TextInput
          style={styles.input}
          //   placeholder="CheckOut"
          placeholderTextColor="#003f5c"
          //   secureTextEntry={true}
          autoCorrect={false}
          //   autoCapitalize="none"
          placeholder="00:00"
          keyboardType="numeric"
          onFocus={() => showTimepicker("to")}
          value={checkOut.toLocaleTimeString()}
          onChangeText={(text) => {
            const date = new Date(text); // Parse the input string into a Date object
            setCheckOut(date); // Update the state with the parsed Date object
          }}
        /> */}
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={From}
            mode={"time"}
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="Reason"
          placeholderTextColor="#003f5c"
          value={reason}
          onChangeText={(text) => setReason(text)}
          // secureTextEntry={true}
          // autoCorrect={false}
          // autoCapitalize="none"
        />
        <View style={styles.buttonView}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              handleRegularize();
              // navigation.navigate("AttenRegularize");
            }}
          >
            <Text style={{ fontSize: 18, color: "#ffff", left: 16 }}>
              Request
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.cancelButton]}>
            <Text style={{ fontSize: 18, color: "#ffff", left: 16 }}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputView: {
    gap: 15,
    width: "100%",
    paddingHorizontal: 40,
    marginBottom: 5,
    marginTop: 100,
  },
  input: {
    height: 50,
    paddingHorizontal: 20,
    borderColor: "#9d9dfa",
    borderWidth: 1,
    borderRadius: 7,
  },
  buttonView: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#32a852",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: "red",
  },
  Datecontainer: {
    minHeight: 376,
  },
});

export default Regularization;
