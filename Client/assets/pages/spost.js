import React, { useEffect, useState } from "react";
import { Button, View, Text, Image, TouchableOpacity, TextInput } from "react-native";
import { useRoute } from '@react-navigation/native';
import Styles from "../stylesheets/spoststyles.js";
import RNRestart from 'react-native-restart';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SPost({ navigation }) {
  const route = useRoute();
  const { id } = route.params;
  const [imageSource, setImageSource] = useState([]); 
  const [comments,setComments] = useState([]);
  const [com,setCom] = useState('');

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

  const handleCommentChange = (value) => {
    setCom(value);
  };

  useEffect(() => {
    checkIfLoggedIn();
    const fetchImage = (fileId) => {
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
    fetch(`http://192.168.4.64:5000/posts/specific/${id}`)
    .then((response) => response.json())
    .then(async (data) => {
      const fileId = data.fileId
      const name = data.metadata.name
      try {
        const imageSource = await fetchImage(fileId);
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


    fetch(`http://192.168.4.64:5000/posts/comments2/${id}`)
    .then((response) => response.json())
    .then((data) => {
      setComments(data.comments);
    })
    .catch((error) => {
      console.log(error.message);
    });


  }, []); // Add an empty dependency array to run the effect only once

  const renderImage = () => {
    return imageSource.map((image) => (
      <View key={image.fileId}>
          <View style={Styles.spcenter}>
            {image.name && <Text style={Styles.spphotocap}>{image.name}</Text>}
          </View>
          <Image source={{ uri: image.source }} style={Styles.spimages} />
      </View>
    ));
  };

  const renderComments = () => {
    return comments.map((comment) => {
      return (
        <View key={comment} style={Styles.scview}>
          <Text style={Styles.scomment}>{comment}</Text>
        </View>
      );
    });
  };

  const handlePresser = (e) => {
    fetch(`http://192.168.4.64:5000/posts/addcomment?id=${id}&comment=${com}`,{
      method: 'PUT',
      credentials: 'include',
    })
    .then((response) => {
      if (response.ok) {
        console.log('EDITED');
        setCom('')
      } else {
        console.log('Error:', response.status);
      }
    })
    .catch((error) => {
      console.log('Error:', error.message);
    });
  }
  

  return (
    <View>
      {renderImage()}
      {renderComments()}
      <View style={Styles.sacomment}>
        <View style={Styles.saform}>
          <Text style={Styles.satitle}>New Comment:</Text>
          <TextInput
            placeholder="Comment:"
            value={com}
            onChangeText={handleCommentChange}
            style={Styles.sai}
            placeholderTextColor="black"
          />
          <View style={Styles.ssf}>
            <TouchableOpacity style={Styles.ssub} onPress={handlePresser}>
              <Text style={Styles.ssubmitter}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}