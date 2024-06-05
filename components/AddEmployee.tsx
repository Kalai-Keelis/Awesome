import { SetStateAction, useEffect, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  ScrollView,
} from "react-native";
import { request, gql } from "graphql-request";
// import { SelectList } from "react_native_simple_dropdown_select_list";
// import { Box, CheckIcon, Select } from "native-base";
// import { Dropdown } from "react-native-element-dropdown";
import {
  MultipleSelectList,
  SelectList,
} from "react-native-dropdown-select-list";
// import { Dropdown } from "react-native-element-dropdown";

const createUsers = gql`
  mutation CreateUser(
    $email: String!
    $password: String!
    $username: String!
    $empId: String!
    $department: String!
    $role: String!
    $desgination: String!
    $teamleader: String!
  ) {
    createUser(
      input: {
        email: $email
        password: $password
        username: $username
        empid: $empId
        department: $department
        role: $role
        designation: $desgination
        teamleader: $teamleader
      }
    ) {
      users {
        id
        email
      }
    }
  }
`;
const managerData = gql`
  query Manager {
    allManagers {
      id
      user {
        id
        username
      }
      status
    }
  }
`;

const createManager = gql`
mutation Manager($id: String!, $status: String!){
  addmanagerApproval($id: String!, $status: String!){
  managerapproval{
    id
    status
    lastupdate
    user{
      username
      email
    }
  }
  }
}`;

const PASSWORD_RESET_REQUEST = gql`
  mutation ResetRequest($email: String!) {
    sendPasswordResetEmail(email: $email) {
      success
      errors
    }
  }
`;

const AddEmployee = () => {
  const [empid, setEmpId] = useState("");
  const [empPass, setEmpPass] = useState("");
  const [empName, setEmpName] = useState("");
  const [empMailId, setEmpMailId] = useState("");
  const [empContact, setEmpContact] = useState("");
  const [empDepartment, setEmpDepartment] = useState("");
  const [empRole, setEmpRole] = useState("");
  const [empDesignation, setEmpDesignation] = useState("");
  const [teamLead, setTeamLead] = useState("");
  const [teamLeadList, setTeamLeadList] = useState([]);
  const [data1, setData1] = useState([]);


  console.log("teamm", teamLead);

  const handleSave = async (e: any) => {
    e.preventDefault();

    const variables: any = {
      empId: empid,
      email: empMailId,
      password: empPass,
      username: empName,
      //empContact: empContact,
      department: empDepartment,
      role: empRole,
      desgination: empDesignation,
      teamleader: teamLead,
      //   roleStatus :"In-Active"
    };

    const url = "http://192.168.0.166:8000/graphql/";

    request(url, createUsers, variables)
      .then((response: any) => {
        console.log("create user res", response);
        Alert.alert("Add Employee Success")
        request(url, PASSWORD_RESET_REQUEST, { email: empMailId }).then(
          (response: any) => {
            console.log("reset res", response);
          }
        );

        const val = Object.keys(response?.createUser?.users).length;
        console.log("create project val", val);
      })
      .catch((err: any) => {
        console.log(err);
        Alert.alert("Invalid Employee")
      });   
  };

  const fetchData = () => {
    const url = "http://192.168.0.166:8000/graphql/";
    request(url, managerData).then((res: any) => {
      setData1(res.allManagers);
      console.log("res----->", res);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const Option = data1.map((item: any) => ({
    value: item.user.username,
    key:item.id,
  }))
 
  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View>
        <View style={styles.inputView}>
          <Text style={styles.addText}>Add Employee</Text>
          <TextInput
            style={styles.input}
            placeholder="EmpID"
            placeholderTextColor="#003f5c"
            autoCorrect={false}
            autoCapitalize="none"
            keyboardType="email-address"
            value={empid}
            onChangeText={(text) => setEmpId(text)}
          />

          <TextInput
            style={styles.input}
            placeholder="EmpName"
            placeholderTextColor="#003f5c"
            secureTextEntry={false}
            autoCorrect={false}
            autoCapitalize="none"
            value={empName}
            onChangeText={(text) => setEmpName(text)}
          />

          <TextInput
            style={styles.input}
            placeholder="MailId"
            placeholderTextColor="#003f5c"
            secureTextEntry={false}
            autoCorrect={false}
            autoCapitalize="none"
            value={empMailId}
            onChangeText={(text) => setEmpMailId(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#003f5c"
            secureTextEntry={true}
            autoCorrect={false}
            autoCapitalize="none"
            value={empPass}
            onChangeText={(text) => setEmpPass(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Contact Number"
            placeholderTextColor="#003f5c"
            secureTextEntry={false}
            autoCorrect={false}
            autoCapitalize="none"
            value={empContact}
            onChangeText={(text) => setEmpContact(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Department"
            placeholderTextColor="#003f5c"
            secureTextEntry={false}
            autoCorrect={false}
            autoCapitalize="none"
            value={empDepartment}
            onChangeText={(text) => setEmpDepartment(text)}
          />
          <View>
            <SelectList 
              setSelected={(val: any) => setTeamLead(val)}
              data={Option}
              save="value"
            />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Role"
            placeholderTextColor="#003f5c"
            secureTextEntry={false}
            autoCorrect={false}
            autoCapitalize="none"
            value={empRole}
            onChangeText={(text) => setEmpRole(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Designation"
            placeholderTextColor="#003f5c"
            secureTextEntry={false}
            autoCorrect={false}
            autoCapitalize="none"
            value={empDesignation}
            onChangeText={(text) => setEmpDesignation(text)}
          />
        </View>
        <View style={styles.buttonView}>
          <Button title="Save" onPress={handleSave} />
        </View>
      </View>
    </ScrollView>
  );
};
export default AddEmployee;
const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    alignItems: "center",
    paddingTop: 20,
  },
  logoContain: {
    position: "relative",
  },
  image: {
    height: 180,
    width: 360,
    top: 20,
    left: -1,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    // textTransform: "uppercase",
    textAlign: "center",
    paddingVertical: 20,
    color: "#9d9dfa",
  },
  inputView: {
    gap: 15,
    width: "100%",
    paddingHorizontal: 40,
    marginBottom: 1,
    marginTop: 0,
  },
  addText: {
    fontSize: 25,
    left: 70,
    color:'#000'
  },
  input: {
    height: 50,
    paddingHorizontal: 20,
    borderColor: "#9d9dfa",
    borderWidth: 1,
    borderRadius: 7,
  },
  rememberView: {
    width: "100%",
    paddingHorizontal: 50,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 8,
  },
  rememberText: {
    fontSize: 13,
  },

  SignIn: {
    marginLeft: 200,
  },

  forgetText: {
    fontSize: 20,
    color: "#9d9dfa",
  },
  button: {
    backgroundColor: "#2c2cdb",
    height: 45,
    borderColor: "#9d9dfa",
    borderWidth: 1,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    width: 265,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonView: {
    width: "60%",
    paddingHorizontal: 50,
    top: 20,
    left: 65,
  },
  optionsText: {
    textAlign: "center",
    paddingVertical: 10,
    color: "#9d9dfa",
    fontSize: 13,
    marginBottom: 6,
  },
  mediaIcons: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 23,
  },
  icons: {
    width: 40,
    height: 40,
  },

  footerText: {
    textAlign: "center",
    color: "gray",
  },
  signup: {
    color: "red",
    fontSize: 13,
  },
  errorText: {
    color: "red",
    marginTop: -2,
    marginLeft: 10,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
    color: "#000",
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#000",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#000",
  },
  iconStyle: {
    width: 20,
    height: 20,
    color: "#000",
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: "#000",
  },
});
