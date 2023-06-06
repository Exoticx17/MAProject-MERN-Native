import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Styles from '../stylesheets/poststyles';

export default function Posts({ navigation }) {
  const [userId, setUserId] = useState('');
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
    retrieveUserId();
    checkIfLoggedIn();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchPosts();
    }
  }, [userId]);

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

  const fetchPosts = () => {
    fetch(`http://192.168.4.64:5000/posts/user?userId=${userId}`)
      .then((response) => response.json())
      .then((data) => {
        const fileIds = data.posts.map((post) => post.fileId);
        const imageSourcesPromises = fileIds.map((fileId) => fetchImage(fileId));
        Promise.all(imageSourcesPromises)
          .then((imageSources) => {
            const updatedImageSources = imageSources.map((imageSource, index) => {
              const post = data.posts[index];
              return {
                source: imageSource,
                fileId: post.fileId,
                name: post.metadata.name,
              };
            });
            setImageSources(updatedImageSources);
          })
          .catch((error) => {
            console.log(error.message);
          });
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  

  const fetchImage = (fileId) => {
    return fetch(`http://192.168.4.64:5000/posts/one/${fileId}`)
      .then((response) => response.blob())
      .then((blob) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve(reader.result);
          };
          reader.onerror = (error) => {
            reject(error);
          };
          reader.readAsDataURL(blob);
        });
      });
  };

  const renderImages = (startIndex, endIndex) => {
    const images = imageSources.slice(startIndex, endIndex);
    return images.map((image, index) => (
      <View key={index}>
        <TouchableOpacity onPress={() => navigation.navigate("SPost", { id: image.fileId })}>
          <Image source={{ uri: image.source }} style={Styles.p1images} />
          <View style={Styles.texts1}>
            {image.name && <Text style={Styles.pphotocap}>{image.name}</Text>}
          </View>
        </TouchableOpacity>
      </View>
    ));
  };

  return (
    <View>
      <View style={Styles.pmain}>
        <Text style={Styles.pmaint}>User Posts</Text>
      </View>
      <View style={Styles.pinfoc}>
        <Text style={Styles.pinfot}>Your Posts: </Text>
        <View style={Styles.pinfoim}>
          <View style={Styles.p1view}>{renderImages(0, 2)}</View>
          <View style={Styles.p2view}>{renderImages(2, 4)}</View>
          <View style={Styles.p3view}>{renderImages(4, 6)}</View>
        </View>
      </View>
    </View>
  );
}
