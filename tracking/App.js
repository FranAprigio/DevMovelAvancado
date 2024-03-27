import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Map from './src/Map';
import Distance from './src/Distance';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Map">
        <Stack.Screen name="Map" component={Map} options={{ title: 'Mapa' }} />
        <Stack.Screen name="Distance" component={Distance} options={{ title: 'Distância Percorrida' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
