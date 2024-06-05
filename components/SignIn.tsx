import React, { useState } from "react";
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
} from "react-native";

const SignUp = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const validatePassword = () => {
    if (!password) {
      setPasswordError("Password is required");
    } else {
      setPasswordError("");
    }
  };

  const validateConfirmPassword = () => {
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };
  const handleSignUp = () => {
    // validateEmail();
    validatePassword();
    validateConfirmPassword();

    if (email && password && confirmPassword && password === confirmPassword) {
      // Perform sign up logic
      Alert.alert("Reset successful");
      navigation.navigate("HRMS");
    } else {
      console.log("Please fill in all fields");
      Alert.alert("Reset Password");
    }
  };

  return (
    <View>
      <View>
        {/* <Image
          source={require("../assets/Images/Security.png")}
          style={styles.image}
        /> */}
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.input}
          placeholder="PASSWORD"
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
          onBlur={validatePassword}
          autoCorrect={false}
          autoCapitalize="none"
        />
        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}
        <TextInput
          style={styles.input}
          placeholder="CONFIRM PASSWORD"
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
          onBlur={validateConfirmPassword}
          autoCorrect={false}
          autoCapitalize="none"
        />
        {confirmPasswordError ? (
          <Text style={styles.errorText}>{confirmPasswordError}</Text>
        ) : null}
      </View>
      <View style={styles.buttonView}>
        <Button title="Reset" onPress={handleSignUp} />
        {/* <Text style={styles.optionsText}>OR LOGIN WITH</Text> */}
      </View>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
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
    marginBottom: 5,
    marginTop: 30,
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
});
