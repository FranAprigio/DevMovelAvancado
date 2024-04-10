import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import { Button } from 'react-native-paper';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SecondScreen from './perfil';
import firebase from 'firebase';
import { LinearGradient } from 'expo-linear-gradient';

function PreferencesScreen({ navigation }) {
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [loading, setLoading] = useState(true);

  const preferences = [
    'Restaurantes',
    'Lanchonetes',
    'Bares',
    'Shoppings',
    'Baladas',
    'Eventos',
    'Pizzarias',
    'Hamburguerias',
    'Sushi',
  ];

  const togglePreference = async (preference) => {
    try {
      const userId = getUserId();
      if (userId) {
        const userDocRef = firebase.firestore().collection('usuários').doc(userId);

        const userDoc = await userDocRef.get();
        const currentPreferences = userDoc.exists ? userDoc.data().preferences : [];

        const updatedPreferences = selectedPreferences.includes(preference)
          ? currentPreferences.filter((pref) => pref !== preference)
          : [...currentPreferences, preference];

        setSelectedPreferences(updatedPreferences);

        await userDocRef.update({
          preferences: updatedPreferences,
        });
      } else {
        console.warn('Não foi possível obter o ID do usuário.');
      }
    } catch (error) {
      console.error('Erro ao atualizar preferências:', error);
    }
  };

  const getUserId = () => {
    const user = firebase.auth().currentUser;
    if (user) {
      return user.uid;
    } else {
      console.warn('Usuário não autenticado.');
      return null;
    }
  };
  

  const savePreferences = async () => {
    try {
      const userId = getUserId();
      if (userId) {
        const preferencesCollection = firebase.firestore().collection('userPreferences');
        await preferencesCollection.doc(userId).set({
          preferences: selectedPreferences,
        });

        console.log('Preferências salvas com sucesso:', selectedPreferences);
        navigation.goBack();
      } else {
        console.warn('Não foi possível obter o ID do usuário.');
      }
    } catch (error) {
      console.error('Erro ao salvar preferências:', error);
    }
  };

  const loadPreferences = async () => {
    try {
      const userId = getUserId();
      if (userId) {
        const preferencesCollection = firebase.firestore().collection('usuários');
        const doc = await preferencesCollection.doc(userId).get();

        if (doc.exists) {
          const preferencesArray = doc.data().preferences;
          console.log(preferencesArray)
          setSelectedPreferences(preferencesArray);
        }
      } else {
        console.warn('Não foi possível obter o ID do usuário.');
      }
    } catch (error) {
      console.error('Erro ao carregar preferências:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPreferences();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.preferenceButton,
        {
          backgroundColor: selectedPreferences.includes(item) ? 'green' : 'white',
          borderColor: selectedPreferences.includes(item) ? 'green' : 'white',
        },
      ]}
      onPress={() => togglePreference(item)}
    >
      <Text style={styles.preferenceText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={['#00EA95', '#B01EEE']}
      style={styles.gradiente}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <View style={styles.container}>
        <FlatList
          data={preferences}
          renderItem={renderItem}
          keyExtractor={(item) => item}
          numColumns={3}
        />
        <TouchableOpacity style={styles.saveButton} onPress={savePreferences}>
          <Text style={styles.saveButtonText}>Salvar preferências</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

export default function main() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator initialRouteName="Preferences" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={SecondScreen} />
      <Stack.Screen name="Preferences" component={PreferencesScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  preferenceButton: {
    margin: 5,
    padding: 10,
    borderRadius: 50,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  preferenceText: {
    fontWeight: 'bold',
    color: 'black',
  },
  saveButton: {
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 100,
    fontWeight: 'bold'
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  paperButton: {
    backgroundColor: 'black',
    color: 'white',
    marginBottom: 10
  },
  gradiente: {
    flex: 1,
  },
});

