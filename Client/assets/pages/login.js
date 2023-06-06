import React, { useEffect, useState } from 'react';
import Styles from "../stylesheets/loginstyles.js";
import { Button, View, Text, TextInput, Image, TouchableOpacity } from "react-native";
import Ocean from "../photos/ocean.jpg";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login({ navigation }) {

  const [staySignedIn, setStaySignedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
    fetch(`http://192.168.4.64:5000/user/login?stay=${staySignedIn}`, {
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
  
  const signup = () => {
    navigation.navigate("Signup")
  }

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={Styles.llogin}>Login </Text>
      <View style={Styles.lflex}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={handleEmailChange}
          style={Styles.lemailf}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={handlePasswordChange}
          secureTextEntry
          style={Styles.lpasswordf}
        />
      </View>
      <View style={Styles.lradio}>
        <TouchableOpacity
          onPress={handleStaySignedInChange}
          style={{ height: 20, width: 20, borderRadius: 10, borderWidth: 1, marginRight: 10 }}>
          {staySignedIn && <View style={{ flex: 1, backgroundColor: "black", borderRadius: 10 }} />}
        </TouchableOpacity>
        <Text style={Styles.lstay}>Stay Signed In</Text>
      </View>
      <TouchableOpacity style={Styles.lsubmitf} onPress={handleSubmit}>
        <Text style={{ color: '#e93578', fontSize: 17, fontWeight: 'bold'}}>Submit</Text>
      </TouchableOpacity>
      <Image source={Ocean} style={Styles.limage} />
      <TouchableOpacity onPress={signup}>
        <Text style={Styles.lsign}>Dont Have An Acount? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}
