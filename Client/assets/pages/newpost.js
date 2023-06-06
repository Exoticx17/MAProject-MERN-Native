import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import Styles from '../stylesheets/newpoststyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NewPost({ navigation }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [hashtag1, setHashtag1] = useState('');
  const [hashtag2, setHashtag2] = useState('');
  const [hashtag3, setHashtag3] = useState('');
  const [file, setFile] = useState(null);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    retrieveUserId();
    checkIfLoggedIn();
  }, []); 

  const checkIfLoggedIn = async () => {
    try {
      const loggedin = await AsyncStorage.getItem('loggedin');
      if (loggedin === 'true') {
        console.log('LoggedIn')
      }
      else{
        navigation.navigate("Login")
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const retrieveUserId = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      if (storedUserId !== null) {
        setUserId(storedUserId);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleNameChange = (value) => {
    setName(value);
  };

  const handleDescriptionChange = (value) => {
    setDescription(value);
  };

  const handleHashtag1Change = (value) => {
    setHashtag1(value);
  };

  const handleHashtag2Change = (value) => {
    setHashtag2(value);
  };

  const handleHashtag3Change = (value) => {
    setHashtag3(value);
  };

  const handleFile = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: '*/*',
      });
      if (res.type === 'success') {
        console.log('Selected file:', res.uri);
        setFile(res);
      } else {
        console.log('File picker cancelled or failed');
      }
    } catch (err) {
      console.log('File picker error:', err);
    }
  };

  const handlePresser = () => {
    // Handle submit logic here, including the file if it's required
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      type: 'application/octet-stream',
      name: file.name,
    });
  
    const hashtags = [hashtag1, hashtag2, hashtag3].filter(Boolean); // Filter out empty or undefined hashtags
  
    const params = new URLSearchParams();
    params.append('name', name);
    params.append('description', description);
    params.append('userid', userId)
    hashtags.forEach((hashtag) => {
      params.append('hashtags', hashtag);
    });
  
    fetch(`http://192.168.4.64:5000/posts?${params}`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          console.log('POSTED');
          navigation.navigate('Home')
        } else {
          console.log('Error:', response.status);
        }
      })
      .catch((error) => {
        console.log('Error:', error.message);
      });
  };
  
  
  

  return (
    <View>
      <Text style={Styles.nmainh}>New Post</Text>
      <View style={Styles.nform}>
        <TextInput
          placeholder="Title:"
          value={name}
          onChangeText={handleNameChange}
          style={Styles.nnamei}
          placeholderTextColor="black"
        />
        <TextInput
          placeholder="Description:"
          value={description}
          onChangeText={handleDescriptionChange}
          style={Styles.ndescriptioni}
          placeholderTextColor="black"
          multiline
        />
        <View style={Styles.nrow}>
          <TextInput
            placeholder="Hashtag 1:"
            value={hashtag1}
            onChangeText={handleHashtag1Change}
            style={Styles.nhashtag1i}
            placeholderTextColor="black"
          />
          <TextInput
            placeholder="Hashtag 2:"
            value={hashtag2}
            onChangeText={handleHashtag2Change}
            style={Styles.nhashtag2i}
            placeholderTextColor="black"
          />
        </View>
        <TextInput
          placeholder="Hashtag 3:"
          value={hashtag3}
          onChangeText={handleHashtag3Change}
          style={Styles.nhashtag3i}
          placeholderTextColor="black"
        />
        <TouchableOpacity style={Styles.nfilei} onPress={handleFile}>
          <Text
            style={Styles.nfilep}
          >
            Select File
          </Text>
        </TouchableOpacity>
        {file ? <Text style={Styles.ntruther}>Selected</Text> : <Text style={Styles.ntruther}>Not Selected</Text>}
        <TouchableOpacity style={Styles.nsub} onPress={handlePresser}>
          <Text style={Styles.nsubmitText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
