import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import firebase from 'firebase';
import { MainNavigator } from '../App';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function FirstLoginScreen({ navigation }) {
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
        navigation.navigate('Home');
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
          backgroundColor: selectedPreferences.includes(item) ? 'green' : '#FFFFFF',
          borderColor: selectedPreferences.includes(item) ? 'green' : '#FFFFFF',
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
        <View style={styles.text}>
          <Text style={styles.headingText}>
            Selecione as preferências que mais se encaixam no seu estilo de rolê!
          </Text>
        </View>
        <FlatList
          data={preferences}
          renderItem={renderItem}
          keyExtractor={(item) => item}
          numColumns={3}
        />
        <TouchableOpacity style={styles.saveButton} onPress={savePreferences}>
          <Text style={styles.saveButtonText}>Salvar preferências</Text>
        </TouchableOpacity>
        <Button
          style={styles.paperButton}
          icon="keyboard-return"
          mode="contained"
          onPress={() => navigation.goBack()}
        >
          Voltar
        </Button>
      </View>
    </LinearGradient>
  );
}

const AppNavigator = () => {
  const Stack = createStackNavigator();
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="FirstLogin" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="FirstLogin" component={FirstLoginScreen} />
        <Stack.Screen name="Home" component={MainNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  flat: {
    backgroundColor: '#A087E8',
  },
  text: {
    textAlign: 'center',
    marginBottom: 15
  },
  headingText: {
    fontSize: 25,
    marginBottom: 20,
    marginLeft:10,
    marginRight:10,
    color: 'white',
    fontFamily: 'Rubik One',
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
    justifyContent: 'center',
    textAlign: 'center'
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
    marginBottom: 30,
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  paperButton: {
    backgroundColor: 'black',
    color: 'white',
    marginBottom: 100,
  },
  gradiente: {
    flex: 1,
  },
});

