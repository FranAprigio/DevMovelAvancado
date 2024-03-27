import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { addLocation } from '../components/locationManager';

export default function Map() {
    const navigation = useNavigation();
    const [initialRegion, setInitialRegion] = useState(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.error('Permissão de localização não concedida');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setInitialRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });
        })();
    }, []);

    const handleLocationChange = (newLocation) => {
        const { latitude, longitude } = newLocation.coords;
        addLocation(latitude, longitude);
    };

    return (
        <View style={styles.container}>
            {initialRegion && (
                <MapView
                    style={styles.map}
                    initialRegion={initialRegion}
                    onUserLocationChange={handleLocationChange}
                >
                    <Marker coordinate={initialRegion} title="Localização atual" />
                </MapView>
            )}
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Distance')}>
                <Text style={styles.buttonText}>Ver Distância Percorrida</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    button: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#007bff',
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
});
