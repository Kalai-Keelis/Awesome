import React, {useContext, useState} from 'react';
import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  Button,
  TouchableOpacity,
} from 'react-native';
// import Icon from "react-native-vector-icons/Ionicons";
import {request, gql} from 'graphql-request';
import {MyContext} from './Model/Context';

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    tokenAuth(email: $email, password: $password) {
      success
      errors
      token
      refreshToken
      user {
        id
        email
        username
        firstName
        lastName
        role
        empid
        isActive
      }
    }
  }
`;

const LoginForm = ({navigation}: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {user, setUser} = useContext(MyContext);

  const handleLogin = () => {
    const url = 'http://192.168.0.166:8000/graphql/';

    try {
      request(url, LOGIN, {
        email: email,
        password: password,
      })
        .then((response: any) => {
          //  Alert.alert("Login Successfully")
          if (response.tokenAuth.success) {
            setUser(response.tokenAuth);
            console.log('yess');
            navigation.navigate('Check');
          } else {
            Alert.alert('Invalid Login');
            console.log('Noo');
          }
        })
        .catch((error: any) => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <SafeAreaView style={styles.container}>
        <View style={styles.logoContain}>
          <Image
            source={require('./assets/Images/Hrms-Logo1.jpg')}
            style={styles.image}
          />
          <Text style={styles.title}>H R M S</Text>
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.input}
            placeholder="EMAIL"
            placeholderTextColor="#003f5c"
            value={email}
            onChangeText={text => setEmail(text)}
            autoCorrect={false}
            autoCapitalize={'none'}
            keyboardType={'email-address'}
          />
          <TextInput
            style={styles.input}
            placeholder="PASSWORD"
            placeholderTextColor="#003f5c"
            secureTextEntry={true}
            value={password}
            onChangeText={text => setPassword(text)}
            autoCorrect={false}
            autoCapitalize="none"
          />
        </View>
        <View style={styles.rememberView}>
          <View>
            <Pressable
              onPress={() => {
                // navigation.navigate("Header");
              }}
              style={styles.SignUp}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  bottom: 30,
                }}>
                <Text style={styles.forgetText}>Reset Password</Text>
                {/* <Icon
                  name="arrow-forward-outline"
                  size={16}
                  color="#9d9dfa"
                  style={styles.icon}
                /> */}
              </View>
            </Pressable>
          </View>
        </View>

        <View style={styles.buttonView}>
          <TouchableOpacity
            onPress={() => {
              handleLogin();
            }}
            style={styles.LogIn}>
            <Text style={{color: 'white',fontSize:20, marginLeft: 30, marginTop: 5,fontWeight:'600'}}>
              Log in
            </Text>
          </TouchableOpacity>
          {/* <Button
            title="Log in"
            onPress={() => {
              handleLogin();
              // navigation.navigate("BottomNavigate");
            }}
            
          /> */}
          {/* <Text style={styles.optionsText}>OR LOGIN WITH</Text> */}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default LoginForm;

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    alignItems: 'center',
    paddingTop: 20,
  },
  LogIn:{
    backgroundColor: '#818cf8',
    width: 110,
    height: 35,
    borderRadius: 8,
    marginLeft: 15
  },
  logoContain: {
    position: 'relative',
    bottom: 30,
  },
  image: {
    height: 360,
    width: 350,
    bottom: 10,
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    // textTransform: "uppercase",
    textAlign: 'center',
    paddingVertical: 20,
    color: '#9d9dfa',
  },
  inputView: {
    gap: 15,
    width: '100%',
    paddingHorizontal: 40,
    marginBottom: 15,
  },
  input: {
    height: 50,
    color: '#000',
    paddingHorizontal: 20,
    borderColor: '#9d9dfa',
    borderWidth: 1,
    borderRadius: 7,
    bottom: 30,
  },
  rememberView: {
    width: '100%',
    paddingHorizontal: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 8,
  },
  rememberText: {
    fontSize: 13,
  },

  SignUp: {
    marginLeft: 130,
  },
  forgetText: {
    fontSize: 20,
    color: '#9d9dfa',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  button: {
    backgroundColor: '#2c2cdb',
    height: 45,
    borderColor: '#9d9dfa',
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 265,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonView: {
    width: '70%',
    paddingHorizontal: 50,
    // top: -20,
    bottom: 40,
  },
  optionsText: {
    textAlign: 'center',
    paddingVertical: 10,
    color: '#9d9dfa',
    fontSize: 13,
    marginBottom: 6,
  },
  mediaIcons: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 23,
  },
  icons: {
    width: 40,
    height: 40,
  },
  icon: {
    height: 50,
    marginTop: 20,
  },
  footerText: {
    textAlign: 'center',
    color: 'gray',
  },
  signup: {
    color: 'red',
    fontSize: 13,
  },
  errorText: {
    color: 'red',
    marginTop: -2,
    marginLeft: 10,
  },
});
