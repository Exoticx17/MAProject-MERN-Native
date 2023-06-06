import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import Styles from "../stylesheets/searchStyles.js";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Search({ navigation }) {
  const [search, setSearch] = useState("");
  const [imageSources, setImageSources] = useState([]);
  const [submitted, setSubmitted] = useState(false);

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

  const handleSearchChange = (value) => {
    setSearch(value);
  };

  const nothing = () => {};

  const handlePresser = (e) => {
    console.log(search);
    setSubmitted(true)
    fetch(`http://192.168.4.64:5000/posts/search?name=${search}`)
      .then((response) => response.json())
      .then((data) => {
        const fileIds = data.files.map((file) => file.fileId);
        const imageSourcesPromises = fileIds.map((fileId) => fetchImage2(fileId));
        Promise.all(imageSourcesPromises).then((imageSources) => {
          const updatedImageSources = imageSources.map((imageSource, index) => {
            const file = data.files[index];
            return {
              source: imageSource,
              fileId: file.fileId,
              name: file.metadata.name
            };
          });
          setImageSources(updatedImageSources);
        });
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  useEffect(() => {
    checkIfLoggedIn();
    fetch("http://192.168.4.64:5000/posts/nine")
      .then((response) => response.json())
      .then((data) => {
        const fileIds = data.files.map((file) => file.fileId);
        const imageSourcesPromises = fileIds.map((fileId) => fetchImage2(fileId));
        Promise.all(imageSourcesPromises).then((imageSources) => {
          const updatedImageSources = imageSources.map((imageSource, index) => {
            const file = data.files[index];
            return {
              source: imageSource,
              fileId: file.fileId,
              name: file.metadata.name
            };
          });
          setImageSources(updatedImageSources);
        });
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, []);
  

  const fetchImage2 = (fileId) => {
    return fetch(`http://192.168.4.64:5000/posts/one/${fileId}`)
      .then((response) => response.blob())
      .then((blob) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve(reader.result);
          };
          reader.readAsDataURL(blob);
        });
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const renderImages = (startIndex, endIndex) => {
    const images = imageSources.slice(startIndex, endIndex);
    return images.map((image, index) => (
      <View key={index} >
        <TouchableOpacity onPress={() => navigation.navigate("SPost", { id: image.fileId })}>
        <Image source={{ uri: image.source }} style={Styles.s1images} />
        <View style={Styles.texts1}>
          {image.name && <Text style={Styles.sphotocap}>{image.name}</Text>}
        </View>
        </TouchableOpacity>
      </View>
    ));
  };

  const renderImages2 = () => {
    return imageSources.map((image, index) => (
      <View key={index}>
        <TouchableOpacity onPress={() => navigation.navigate("SPost", { id: image.fileId })}>
        <Image source={{ uri: image.source }} style={Styles.s1images} />
        <View style={Styles.texts1}>
          {image.name && <Text style={Styles.sphotocap}>{image.name}</Text>}
        </View>
        </TouchableOpacity>
      </View>
    ));
  };
  
  

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={Styles.stopt}>Search Posts</Text>
      <View style={Styles.ssearchform}>
        <TextInput
          placeholder="Enter Search Term Or Key:"
          value={search}
          onChangeText={handleSearchChange}
          style={Styles.ssearchi}
          placeholderTextColor="black"
        />
        <TouchableOpacity style={Styles.ssubmitf} onPress={handlePresser}>
          <Text
            style={{
              color: "white",
              fontSize: 20,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Submit
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ marginTop: 35 }}>
        <View style={Styles.s1view}>{submitted ? nothing() : renderImages(0, 3)}</View>
        <View style={Styles.s2view}>{submitted ? nothing() : renderImages(3, 6)}</View>
        <View style={Styles.s3view}>{submitted ? nothing() : renderImages(6, 9)}</View>
        <View style={Styles.s4view}>{submitted ? renderImages2() : nothing()}</View>
      </View>
    </View>
  );
}
