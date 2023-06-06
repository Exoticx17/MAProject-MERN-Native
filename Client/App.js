import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from './assets/pages/home'
import Login from './assets/pages/login'
import Footer from "./assets/components/footer";
import Signup from "./assets/pages/signup";
import SPost from "./assets/pages/spost";
import Posts from "./assets/pages/posts";
import NewPost from "./assets/pages/newpost";
import Search from "./assets/pages/search";

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} options={{ headerTransparent: true }} /> 
        <Stack.Screen name="NewPost" component={NewPost} options={{ headerTransparent: true }} />
        <Stack.Screen name="Search" component={Search} options={{ headerTransparent: true }} />
        <Stack.Screen name="Home" component={Home} options={{ headerTransparent: true }} />
        <Stack.Screen name="Signup" component={Signup} options={{ headerTransparent: true }} />
        <Stack.Screen name="SPost" component={SPost} options={{ headerTransparent: true }} />
        <Stack.Screen name="Posts" component={Posts} options={{ headerTransparent: true }} initialParams={{ id: null }}/>
      </Stack.Navigator>
      <Footer />
    </NavigationContainer>
  );
}
