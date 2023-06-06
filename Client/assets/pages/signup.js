import React, { useState } from 'react';
import Styles from "../stylesheets/signupstyles.js";
import { Button, View, Text, TextInput, Image, TouchableOpacity } from "react-native";
import Cherry from "../photos/cherry.jpg";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Signup({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [staySignedIn, setStaySignedIn] = useState(false);

  const handleEmailChange = (value) => {
    setEmail(value);
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
  };

  const handleStaySignedInChange = () => {
    setStaySignedIn(!staySignedIn);
  };

  const handleSubmit = () => {
    const data = {
      email: email,
      password: password
    };
    fetch(`http://192.168.4.64:5000/user/signup?stay=${staySignedIn}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      AsyncStorage.setItem('userId', data.user);
      AsyncStorage.setItem('loggedin', 'true')
      navigation.navigate("Home")
    })
    .catch(error => {
      console.log(error.message);
    });
  };

  const login = () => {
    navigation.navigate("Login")
  }

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={Styles.slogin}>Signup </Text>
      <View style={Styles.sflex}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={handleEmailChange}
          style={Styles.semailf}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={handlePasswordChange}
          secureTextEntry
          style={Styles.spasswordf}
        />
      </View>
      <View style={Styles.sradio}>
        <TouchableOpacity
          onPress={handleStaySignedInChange}
          style={{ height: 20, width: 20, borderRadius: 10, borderWidth: 1, marginRight: 10 }}>
          {staySignedIn && <View style={{ flex: 1, backgroundColor: "black", borderRadius: 10 }} />}
        </TouchableOpacity>
        <Text style={Styles.sstay}>Stay Signed In</Text>
      </View>
      <TouchableOpacity style={Styles.ssubmitf} onPress={handleSubmit}>
        <Text style={{ color: '#e93578', fontSize: 17, fontWeight: 'bold'}}>Submit</Text>
      </TouchableOpacity>
      <Image source={Cherry} style={Styles.simage} />
      <TouchableOpacity onPress={login}>
        <Text style={Styles.slog}>Already Have An Acount? Login</Text>
      </TouchableOpacity>
    </View>
  );
}
