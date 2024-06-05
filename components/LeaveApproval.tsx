import React, {useContext, useEffect, useState} from 'react';
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
} from 'react-native';
import {Avatar, Card} from 'react-native-paper';
import {request, gql} from 'graphql-request';
import axios from 'axios';
import {MyContext} from './Model/Context';

const RequestTable = [
  {
    Id: '1',
    name: 'Employee1',
    leave: '10/05/2024 - 14/05/2024',
    status: 'Approved',
  },
  {
    Id: '2',
    name: 'Employee1',
    leave: '10/05/2024 - 14/05/2024',
    status: 'Rejected',
  },
  {
    Id: '3',
    name: 'Employee1',
    leave: '10/05/2024 - 14/05/2024',
    status: 'Pending With HR',
  },
  {
    Id: '4',
    name: 'Employee1',
    leave: '10/05/2024 - 14/05/2024',
    status: 'Pending With Manager',
  },
];
const LeaveeRequest = gql`
  query {
    requestsForLeave {
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
const LeaveApprovalManager = gql`
mutation Leave_approval($id: String!, $status: String!){
  leaveapprovalmanager($id: String!, $status: String!){
    leaveApprovalManager{
      teamleaderId
      
    }
  }
}
`;
const LeaveApprovalHR = gql`
mutation Leave_approval ($id: String!, $status: String!){
  leaveapprovalhr($id: String!, $status: String!){
    leaveApprovalHR{
      
      id
    }
    }
    
  }
`;

// const allUser = gql`list all leave data from leave table `;

const LeaveApproval = ({navigation}: any) => {
  const [status, setStatus] = useState('');
  const [allData, setAllData] = useState([]);
  const [reload, setReload] = useState(false);
  const {user, setUser, login, setLogin, logout, setLogout} =
    useContext(MyContext);
  const role = user.user.role;
  const EmpId = user.user.id;
  const adminRole = 'Admin';

  const url = 'http://192.168.145.53:8000/graphql/';

  const handleLeaveeApprovalManager = (e: any) => {
    request(url, LeaveApprovalManager, {
      id: e.id,
      status: status,
    })
      .then((response: any) => {
        console.log('leave request', response);
        setReload(true);
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const handleLeaveeApprovalHR = (e: any) => {
    const APIURL = 'http://192.168.0.166:8000/api/';
    request(url, LeaveApprovalHR, {
      id: e.id,
      status: status,
    })
      .then((response: any) => {
        console.log('leave request', response);
        setReload(true);
        const url3 = `${APIURL}leave_confirmation/${e.id}/`;
        axios
          .get(url3, {
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
      .catch((err: any) => {
        console.log(err);
      });
  };

  const Fetch = () => {
    request(url, LeaveeRequest)
      .then((response: any) => {
        console.log('leave request', response);
        setAllData(response.requestsForLeave);
      })
      .catch((err: any) => {
        console.log(err);
      });
    // request(BASEURL, leaveDetails, { empoloyeeid: Id }).then((res: any) => {
    //   setData(res.leaveTrackDetails);
    // }
    // );
    // request(BASEURL, leaveTrackDetailsForTeamLeader, { teamleaderid: EmpID }).then((res: any) => {

    //   setData1(res.leaveTrackDetailsForTeamLeader)
    // }
    // );

    setReload(false);
  };

  const val = reload ? Fetch() : null;
  useEffect(() => {
    Fetch();
    setReload(false);
  }, [EmpId, reload, val]);

  return (
    <View>
      <View style={{backgroundColor: '#ffff'}}>
        <Text style={{fontSize: 18, left: 125, top: 1}}>Leave Approval</Text>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {allData.map((col: any, index: any) => (
            <Card style={styles.card}>
              <Card.Content style={{flexDirection: 'row'}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  {/* <Text>{index + 1}</Text> */}
                  <Text style={{marginRight: 2}}>{col.Id}</Text>
                  <Text style={{marginLeft: 20}}>
                    {/* {col.name} */}
                    {col.requestedOn}
                  </Text>
                  <Text style={{marginLeft: 20}}>{col.status}</Text>
                </View>
                {role == adminRole ? (
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      // navigation.navigate("LeaveRequest");
                      handleLeaveeApprovalHR(col);
                    }}>
                    <Text
                      style={{fontSize: 18, color: '#ffff', left: 20, top: 3}}>
                      HR
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.button}
                    onPress={(col: any) => {
                      // navigation.navigate("LeaveRequest");
                      handleLeaveeApprovalManager(col);
                    }}>
                    <Text
                      style={{fontSize: 18, color: '#ffff', left: 20, top: 3}}>
                      Manager
                    </Text>
                  </TouchableOpacity>
                )}
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default LeaveApproval;

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#ffff',
    paddingTop: 650,
  },
  card: {
    marginTop: 10,
    height: 60,
    backgroundColor: '#ffff',
  },
  button: {
    backgroundColor: '#32a852',
    borderRadius: 3,
    marginTop: 30,
    width: 100,
    height: 30,
    marginLeft: 120,
  },
});
