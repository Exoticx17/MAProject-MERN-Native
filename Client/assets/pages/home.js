import React, { useEffect, useState } from "react";
import { Button, View, Text, Image, TouchableOpacity } from "react-native";
import Styles from "../stylesheets/homestyles.js";
import Footer from "../components/footer.js";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home({ navigation }) {
  const [hdata, setHData] = useState({});
  const [imageSource, setImageSource] = useState([]);
  const [imageSources, setImageSources] = useState([]);

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

  useEffect(() => {
    checkIfLoggedIn()
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

    fetch("http://192.168.4.64:5000/posts/likes")
      .then((response) => response.json())
      .then(async (data) => {
        const fileId = data.fileId
        const name = data.metadata.name
        try {
          const imageSource = await fetchImage2(fileId);
          const file = data.file;
          const updatedImageSource = {
            source: imageSource,
            fileId: fileId,
            name: name
          };
          setImageSource([updatedImageSource]);
        } catch (error) {
          console.log(error.message);
        }
      })
      .catch((error) => {
        console.log(error.message);
      });

    fetch("http://192.168.4.64:5000/posts/random")
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

  const renderImage = () => {
    return imageSource.map((image) => (
      <View key={image.fileId}>
        <TouchableOpacity onPress={() => navigation.navigate("SPost", { id: image.fileId })}>
          <Image source={{ uri: image.source }} style={Styles.h1images} />
          <View style={Styles.texts1}>
            {image.name && <Text style={Styles.hphotocap2}>{image.name}</Text>}
          </View>
        </TouchableOpacity>
      </View>
    ));
  };

  const renderImages2 = (startIndex, endIndex) => {
    const images = imageSources.slice(startIndex, endIndex);
    return images.map((image, index) => (
      <View key={index}>
        <TouchableOpacity onPress={() => navigation.navigate("SPost", { id: image.fileId })}>
          <Image source={{ uri: image.source }} style={Styles.h2images} />
          <View style={Styles.texts1}>
            {image.name && <Text style={Styles.hphotocap}>{image.name}</Text>}
          </View>
        </TouchableOpacity>
      </View>
    ));
  };

  const searchNavigator = () => {
    navigation.navigate("Search");
  };

  const name = hdata?.metadata?.name;
  const hashtags = hdata?.metadata?.hashtags;
  return (
    <View style={{ flex: 1 }}>
      <View style={Styles.htop}>
        <Text style={Styles.mainh}>Discover</Text>
        <Text style={Styles.mainh2}> MAPosts</Text>
      </View>
      <View>{renderImage()}</View>
      <View style={Styles.hsall}>
        <Text style={Styles.hmid}>Exciting Posts</Text>
        <Text onPress={searchNavigator} style={Styles.seeall}>
          See All
        </Text>
      </View>
      <View style={Styles.hsimgs}>
        <View style={Styles.h2view}>{renderImages2(0, 2)}</View>
        <View style={Styles.h3view}>{renderImages2(2, 4)}</View>
      </View>
    </View>
  );
}
