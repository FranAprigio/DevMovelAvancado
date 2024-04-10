import React, { useRef, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/Ionicons';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Image } from 'react-native';
import Home from './screens/home';
import Pesquisa from './screens/pesquisa';
import Perfil from './screens/perfil';
import {LinearGradient} from 'expo-linear-gradient';
import TinderScreen from './screens/restaurant';
import AuthScreen from './screens/signup';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const CustomTabBarButton = ({ children, onPress }) => (
  <TouchableOpacity style={styles.tabBarButton} onPress={onPress}>
    {children}
  </TouchableOpacity>
);

const SplashScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ]).start();

    const timer = setTimeout(() => {
      if (navigation && navigation.replace) {
        navigation.replace("Auth");
      }
    }, 3000);

    return () => {
      clearTimeout(timer);
      Animated.timing(fadeAnim).stop();
      Animated.timing(scaleAnim).stop();
    };
  }, [fadeAnim, scaleAnim, navigation]);

  return (
    <LinearGradient
      colors={['#00EA95', '#B01EEE']}
      style={styles.gradiente}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
    <Animated.View
      style={{
        ...styles.fadeInView,
        opacity: fadeAnim,
        transform: [{ scaleY: scaleAnim }],
      }}
    >
      <Image
        source={require('./img/LOGO.png')}
        style={{ width: '80%', height: '40%' }}
      />
    </Animated.View>
    </LinearGradient>
  );
};

const App = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Splash" headerMode="none">
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Main" component={MainNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          height: 90,
          paddingHorizontal: 5,
          paddingTop: 0,
          backgroundColor: '#6C009A',
          position: 'absolute',
          borderTopWidth: 3,
          borderTopColor: 'black',
        },
        headerShown: false,
        tabBarButton: props => <CustomTabBarButton {...props} />,
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Pesquisa') {
            iconName = 'magnify';
          } else if (route.name === 'Perfil') {
            iconName = 'account';
          } else if (route.name === 'Tinder') {
            iconName = 'sparkles';
          }

          return (
            <View style={[styles.iconContainer2, { backgroundColor: focused ? 'transparent' : 'transparent' }]}>
              <View style={[styles.iconContainer, { borderColor: focused ? 'black' : 'transparent', backgroundColor: focused ? '#FFDB00' : '#6C009A' }]}>
                {iconName === 'sparkles' ? (
                  <Image source={require('./img/Sparkling.png')}size={10}style={{tintColor: focused ? 'black' : 'white',}}/>
                ) : (
                  <MaterialCommunityIcons name={iconName} size={30} color={focused ? 'black' : 'white'} />
                )}
              </View>
            </View>
          );
        },
      })}
      tabBarOptions={{
        showLabel: false,
        style: { borderTopColor: 'black', borderTopWidth: 3 },
      }}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Pesquisa" component={Pesquisa} />
      <Tab.Screen name="Tinder" component={TinderScreen}/>
      <Tab.Screen name="Perfil" component={Perfil} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradiente: {
    flex: 1
  },
  tabBarButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 4,
    padding: 5,
  },
  iconContainer2: {
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 0,
    padding: 5,
  },
  fadeInView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export {MainNavigator};
export default App;
