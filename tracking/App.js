import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';

const YOUR_API_KEY = 'your-api-key-here';

export default function App() {
  const [location, setLocation] = useState(null);
  const [locationHistory, setLocationHistory] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(0);

  const updateZoomLevel = (region) => {
    const { width } = Dimensions.get('screen');
    const zoomLevel = Math.log2(360 * (width / 256 / region.longitudeDelta)) + 1;
    setZoomLevel(zoomLevel);
  };

  useEffect(() => {
    const requestLocationPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      if (tracking) {
        Location.watchPositionAsync({ distanceInterval: 0.01 }, (newLocation) => {
          setLocation(newLocation);
          const region = {
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
          };
          updateZoomLevel(region);
          setLocationHistory((prevLocationHistory) => [...prevLocationHistory, region]);
        });
      } else {
        let newLocation = await Location.getCurrentPositionAsync({});
        setLocation(newLocation);
      }
    };
    requestLocationPermissions();
  }, [tracking]);

  const filteredLocations = locationHistory.filter((location) => {
    if (startDate && endDate) {
      const timestamp = Date.parse(location.timestamp);
      return timestamp >= startDate && timestamp <= endDate;
    }
    return true;
  });

  const initialRegion = location && {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <SafeAreaView style={styles.container}>
      <MapView style={styles.map} onRegionChangeComplete={updateZoomLevel} initialRegion={initialRegion}>
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Minha localização"
            description="Eu estou aqui"
          />
        )}
        <Polyline
          coordinates={filteredLocations.map((location) => ({
            latitude: location.latitude,
            longitude: location.longitude,
          }))}
          strokeColor="#FF0000"
          strokeWidth={3}
        />
        {filteredLocations.length > 0 && location && (
          <MapViewDirections
            origin={filteredLocations[0]}
            waypoints={filteredLocations.slice(1, -1)}
            destination={filteredLocations[filteredLocations.length - 1]}
            apikey={YOUR_API_KEY}
            strokeWidth={3}
            strokeColor="#FF0000"
          />
        )}
      </MapView>
      <TouchableOpacity style={styles.button} onPress={() => setTracking(true)}>
        <Text style={styles.buttonText}>Começar rastreamento</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    flex: 1,
    width: '100%',
  },
  button: {
    backgroundColor: '#6495ED',
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
