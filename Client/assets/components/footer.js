import React, { useState } from "react";
import {
  Button,
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Styles from "../stylesheets/footerstyles.js";
import Menu from "../photos/menu.png";
import Add from "../photos/add.png";
import Files from "../photos/files.png";
import Search from "../photos/search.png";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Footer() {
  const navigation = useNavigation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  const handleNavigation = (screenName) => {
    setIsMenuOpen(false);
    navigation.navigate(screenName);
  };

  const handleLogout = () => {
    // Implement your logout logic here
    fetch('http://192.168.4.64:5000/user/logout',{
      method: 'POST'
    })
    .then(() => {
      AsyncStorage.setItem('loggedin', 'false')
      navigation.navigate("Login")
    })
  };

  return (
    <View style={Styles.fcontainer}>
      <TouchableOpacity onPress={toggleMenu}>
        <Image source={Menu} style={Styles.fmenu} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleNavigation("NewPost")}>
        <Image source={Add} style={Styles.fadd} />
        <Text style={Styles.ftextadd}>New</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleNavigation("Posts")}>
        <Image source={Files} style={Styles.fposts} />
        <Text style={Styles.ftextposts}>Posts</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleNavigation("Search")}>
        <Image source={Search} style={Styles.fsearch} />
        <Text style={Styles.ftextsearch}>Search</Text>
      </TouchableOpacity>
      <View style={Styles.fsizer}>
        <Modal
          visible={isMenuOpen}
          animationType="slide"
          onRequestClose={toggleMenu}
          style={{ height: "70%" }}
        >
          <View style={Styles.menuContainer}>
            <TouchableOpacity onPress={toggleMenu}>
              <Text style={Styles.menuClose}>Close</Text>
            </TouchableOpacity>
            <View style={Styles.menuContent}>
              <TouchableOpacity
                onPress={() => handleNavigation("Home")}
              >
                <Text style={Styles.fmohome}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleNavigation("Posts")}
              >
                <Text style={Styles.fmoposts}>Posts</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleNavigation("NewPost")}
              >
                <Text style={Styles.fmonpost}>New Post</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleNavigation("Search")}>
                <Text style={Styles.fmosearch}>Search</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleLogout}>
                <Text style={Styles.fmologout}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}
