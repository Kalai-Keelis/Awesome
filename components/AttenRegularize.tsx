import React, { useState, useEffect, useContext } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  Alert,
} from "react-native";
// import DateTimePickerModal from "react-native-modal-datetime-picker";
import { PaperProvider, Card } from "react-native-paper";
import { request, gql } from "graphql-request";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import { MyContext } from "./Model/Context";

const GetManager = gql`
query  getManager($id:String!){
  getManager(id:$id){
    id
    user{
      id
      username
      email
      empid
      designation
    }
    checkIn
    checkOut
    reason
    requestedDate
    hrApproval
    teamApproval
    teamleaderId
    status
    lastUpdate
    
  }
}

`;

const TeamUpdateForLeave = gql`
mutation regularizationApproval($id: String!,$status:Boolean!) {
  addmanagerApproval(id: $id,status:$status) {
     managerapproval{
       id
       status
     }
   }
}
`;

const HRUpdateForLeave = gql`
mutation regularizationApproval($id: String!,$status:String!) {
  regularizationApproval(id: $id,status:$status) {
     regularizationApprovalHR{
       id
       checkIn
       checkOut
       hrApproval
       teamApproval
       lastUpdate
     }
   }
}
`;

const allUser = gql`
query{
  requestRegularization{
    id
    user{
      id
      username
      email
      empid
      designation
    }
    checkIn
    checkOut
    reason
    requestedDate
    hrApproval
    teamApproval
    teamleaderId
    status
    lastUpdate
    
  }
}
`

// const Regularize = gql`
//   mutation regularization($id: String) {
//     regularizationApproval(id: $id) {
//       regularizationApprovalHR {
//         id
//         status
//         checkIn
//         checkOut
//         lastUpdate
//       }
//     }
//   }
// `;
const AttendanceTable = gql`
  query data($id: String!) {
    regularizationRequestByMe(id: $id) {
      id
      user {
        id
        empid
        username
        email
      }
      requestedDate
      checkIn
      checkOut
      reason
      status
    }
  }
`;

const AllData = gql`
  query {
    requestRegularization {
      id
      checkIn
      checkOut
      requestedDate
      reason
      user {
        id
        empid
        username
      }
      status
    }
  }
`;

const AttenRegularization = ({ navigation }: any) => {
  const { user, setUser } = useContext(MyContext);
  const [Reload, setReload] = useState(false);
  const [data, setData] = useState([]);
  const [manager, setGetManager] = useState([]);
  const [status, setStatus] = useState("Pending");
  const roll = user.user.role;
  const adminRoll = "Admin";
  console.log("adminn",adminRoll);
  
  console.log("userrrrr", user.user);

  const url = "http://192.168.0.166:8000/graphql/";

  // const APIURL = "http://127.0.0.1:8000/api/";


  const handleHRApproval = async (e: any) => {
    console.log(e);
    request(url, HRUpdateForLeave, {
      id: e,
      status: status,
    }).then((response: any) => {
      setReload(true)
      const url3 = `leave_confirmation/${e}/`;
      axios.get(url3,{
         headers: {
           'Content-Type': 'multipart/form-data',
         },
       })
         .then((response: any) => {
           console.log('response->', response);
          })
         .catch((error: any) => {
           console.log('error->', error);
         });
    })
  };

  const handelTeamUpdateForLeave = async (e: any) => {
    console.log(e);
    request(url, TeamUpdateForLeave, {
      id: e,
      status: status,
    }).then((response: any) => {
      setReload(true)
    })
  };

  // const handleUpdate = (col: any) => {
  //   console.log("clickk", col);
  //   request(url, Regularize, {
  //     id: col,
  //   })
  //     .then((response: any) => {
  //       setReload(true);
  //       Alert.alert("Update Successfully");
  //       // setData(response.regularizationRequestByMe);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //       Alert.alert("Invalid Update");
  //     });
  // };

  const handleLoader = () => {
    request(url, GetManager,{
      id: user.user.id,
    })
    .then((response: any) => {
      setGetManager(response.getManager);
      setReload(false);
    })
    .catch((error) => {
      console.error(error);
    });
    if (roll == adminRoll) {
      request(url, AllData)
        .then((response: any) => {
          setData(response.requestRegularization);
          setReload(false);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      request(url, AttendanceTable, {
        id: user.user.id,
      })
        .then((response: any) => {
          setData(response.regularizationRequestByMe);
          setReload(false);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const reload = Reload ? handleLoader() : null;

  useEffect(() => {
    handleLoader();
  }, [reload]);
  console.log("data111", data);

  const leftComponent = ({ size }: { size: number }) => (
    <Image
      resizeMode="cover"
      style={{ width: size, height: size, borderRadius: size / 2 }}
      source={{
        uri: "https://fastly.picsum.photos/id/168/700/700.jpg?hmac=TdvFbMN99iyiBXtZ2P8n01OzXKYcEjCkhlSnsZZ5LyU",
      }}
    />
  );


  // var myDate = "2024-05-13T18:30:00";
  // myDate = myDate.split("T")[1];

  return (
    <PaperProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginLeft: 55,
            top: 20,
          }}
        >
          <Text style={{ fontSize: 17,color:'#000' }}>Attendance Regularization</Text>
          <TouchableOpacity
            style={{ marginLeft: 10 }}
            onPress={() => {
              navigation.navigate("RegularizationRequest");
            }}
          >
            <Icon
              name="plus"
              size={30}
              color="#000"
              style={{ fontWeight: "700", left: 30 }}
            />
          </TouchableOpacity>
        </View>
        <ScrollView>
          <Card
            style={{ margin: 30, paddingBottom: 50, backgroundColor: "#ffff" }}
          >
            <Card.Title
              title="Regularization"
              subtitle="Employees"
              titleStyle={{ fontSize: 18, fontWeight: "bold", color: "#000" }}
              subtitleStyle={{ fontSize: 14, color: "#000" }}
              left={leftComponent}
            />
            {data
              ? data.map((col: any, index: any) => (
                  <Card key={index} style={styles.MainRow}>
                    <Text
                      style={{
                        left: 10,
                        top: 10,
                        fontSize: 20,
                        fontWeight: "600",
                        color: '#000'
                      }}
                    >
                      EmpID: {index + 1}
                      {col.user.empid}
                    </Text>
                    <Text
                      style={{
                        left: 10,
                        top: 10,
                        fontSize: 18,
                        fontWeight: "500",
                        color: '#000'
                      }}
                    >
                      CheckIn: {col.checkIn.split("T")[1]}
                    </Text>
                    <Text
                      style={{
                        left: 10,
                        top: 10,
                        fontSize: 18,
                        fontWeight: "500",
                        color: '#000'
                      }}
                    >
                      CheckOut: {col.checkOut.split("T")[1]}
                    </Text>
                    <Text
                      style={{
                        left: 10,
                        top: 10,
                        fontSize: 18,
                        fontWeight: "500",
                        color: '#000'
                      }}
                    >
                      Reason: {col.reason}
                    </Text>
                    <Text
                      style={{
                        left: 10,
                        top: 10,
                        fontSize: 18,
                        fontWeight: "500",
                        color: '#000'
                      }}
                    >
                      RequstDate: {col.requestedDate}
                    </Text>
                    <Text
                      style={{
                        left: 10,
                        top: 10,
                        fontSize: 19,
                        fontWeight: "600",
                        color: '#000'
                      }}
                    >
                      Status: {col.status ? "Approved" : "Pending"}
                    </Text>
                    {roll == adminRoll ? (
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleHRApproval(col.id)}
                      >
                        <Text
                          style={{
                            fontSize: 18,
                            color: "#ffff",
                            left: 13,
                            bottom: -1,
                          }}
                        >
                          HR
                        </Text>
                      </TouchableOpacity>
                    ) : 
                    null             
                    }
                  </Card>
                ))
              : null}
          </Card>
        </ScrollView>
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 5,
  },
  cell: {
    flex: 1,
    textAlign: "center",
    marginRight: 1,
    marginLeft: -10,
  },
  cell1: {
    paddingVertical: 15, // Adjust the padding value as needed
  },
  button: {
    backgroundColor: "#32a852",
    borderRadius: 3,
    marginTop: 13,
    width: 80,
    height: 30,
    marginLeft: 13,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    paddingVertical: 20,
    color: "green",
  },
  subtitle: {
    marginBottom: 20,
    fontSize: 18,
  },
  timer: {
    flexDirection: "row",
    alignItems: "center",
  },
  CheckIn: {
    backgroundColor: "#264a2e",
    borderRadius: 10,
    width: 120,
    height: 40,
    marginLeft: 10,
  },
  CheckIn1: {
    backgroundColor: "#fa112d",
    borderRadius: 10,
    width: 120,
    height: 40,
    marginLeft: 10,
  },
  timeUnit: {
    fontSize: 24,
    fontWeight: "bold",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  yearUnit: {
    backgroundColor: "red",
    borderRadius: 15,
    color: "white",
  },
  dayUnit: {
    backgroundColor: "#3498db",
    borderRadius: 15,
    color: "white",
  },
  hourUnit: {
    backgroundColor: "#27ae60",
    borderRadius: 15,
    color: "white",
  },
  minuteUnit: {
    backgroundColor: "#f39c12",
    borderRadius: 15,
    color: "white",
  },
  secondUnit: {
    backgroundColor: "#9b59b6",
    borderRadius: 15,
    color: "white",
  },
  timeSeparator: {
    fontSize: 24,
    fontWeight: "bold",
    marginHorizontal: 5,
  },
  timetitle: {
    fontSize: 17,
    padding: 10,
    paddingRight: 19,
    fontWeight: "bold",
  },
  MainRow: {
    marginLeft: 30,
    padding: 15,
    marginTop: 5,
    width: 250,
    height: 215,
    backgroundColor: "#ffff",
  },
});

export default AttenRegularization;
