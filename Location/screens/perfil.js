import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { Button, TextInput, Snackbar } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { NavigationContainer, CommonActions  } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Preferences from './preferences';
import { LinearGradient } from 'expo-linear-gradient';
import firebase from 'firebase';
import AuthScreen from './signup';
import { auth } from '../Services/firebase';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  gradiente: {
    flex: 1
  },
  text: {
    marginTop: '2%',
    paddingVertical: '1%',
    paddingLeft: '2%',
    textAlign: 'left',
    alignSelf: 'left',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom:5,
    marginLeft: 15, 
    color: '#FFDB00',
    textShadowColor:'#B01EEE',
    textShadowOffset:{width: 2, height: 2},
    textShadowRadius:2,
  },
  nome: {
    marginTop: '1%',
    paddingVertical: '1%',
    paddingLeft: '2%',
    color: '#20232a',
    textAlign: 'left',
    fontSize: 15,
  },
  textInput: {
    paddingLeft: '2%',
    paddingRight: '2%',
    backgroundColor: '#06E4FF',
    width: 350,
    height: 50,
    textAlign: 'left',
    justifyContent: 'center'
  },
  view2: {
    flex: 1, 
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    marginTop: 5, 
    marginRight: 20
  },
  view: {
    paddingTop: '5%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paperButton: {
    backgroundColor: 'black',
  },
  paperButton2: {
    backgroundColor: 'black',
  },
  snackbar: {
    position: 'absolute',
    textAlign: 'center',
    backgroundColor: 'green',
    color: 'white',
    alignContent: 'center'
  },
});

function SecondScreen({ navigation, route }) {
  const [user, setUser] = useState('');
  const [mail, setMail] = useState('');
  const [number, setNumber] = useState('');
  const [isEnabled, setIsEnabled] = React.useState(false);
  const [isEnabledMail, setIsEnabledMail] = React.useState(false);
  const [isEnabledPass, setIsEnabledPass] = React.useState(false);
  const [mostraSenha, setMostraSenha] = useState(false);
  const [isSnackbarVisible, setSnackbarVisible] = useState(false);
  const [image, setImg] = useState({ uri: '../img/ft_perfil.jpg' });
  const [hasImage, setHasImage] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = getUserId();
        const userRef = firebase.firestore().collection('usuários').doc(userId);
        const userData = await userRef.get();

        if (userData.exists) {
          const data = userData.data();
          setUser(data.username || '');
          setMail(data.email || '');
          setNumber(data.password || '');
          setHasImage(!!data.image);
          setImg({ uri: data.image || '../img/ft_perfil.jpg' });
        }
      } catch (error) {
        console.error('Erro ao buscar dados do perfil:', error);
      }
    };

    fetchData();
  }, []);

  const showSnackbar = () => {
    setSnackbarVisible(true);
  };

  const hideSnackbar = () => {
    setSnackbarVisible(false);
  };

  const ocultaSenha = () => {
    setMostraSenha(!mostraSenha);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImg({ uri: result.uri });
      setHasImage(true);
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

  const saveProfile = async () => {
    try {
      const userId = getUserId();
      const userRef = firebase.firestore().collection('usuários').doc(userId);

      if (isEnabledPass && (number.length < 8 || !/[!@#$%^&*(),.?":{}|<>]/.test(number))) {
        Alert.alert('Senha inválida. Deve ter pelo menos 8 caracteres e incluir pelo menos um caracter especial.');
        return;
      }

      if (isEnabledMail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
        Alert.alert('Email inválido. Deve ser um endereço de email válido.');
        return;
      }

      await userRef.update({
        username: user,
        email: mail,
        password: number,
        image: hasImage ? image.uri : '../img/ft_perfil.jpg',
      });

      console.log('Perfil atualizado com sucesso:');

      showSnackbar();
    } catch (error) {
      console.error('Erro ao salvar o perfil:', error);
    }
  };

  return (
    <LinearGradient
      colors={['#00EA95', '#B01EEE']}
      style={styles.gradiente}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <ScrollView>
        <View style={{marginBottom:300}}>
          <Text>{route.params?.params[0]}</Text>
          <Text>{route.params?.params[1]}</Text>

          <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 10 }}>
            <TouchableOpacity onPress={pickImage}>
              <Image source={hasImage ? { uri: image.uri } : require('../img/ft_perfil.jpg')} style={{ width: 100, height: 100, borderRadius: 50 }} />
            </TouchableOpacity>
          </View>
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Text style={styles.text}>Usuário</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Usuario123"
              disabled={!isEnabled}
              mode="outlined"
              value={user}
              onChangeText={(text) => setUser(text)}
              right={
                <TextInput.Icon
                  name={isEnabled ? 'pencil-off' : 'pencil-outline'}
                  onPress={() => {
                    setIsEnabled(!isEnabled);
                  }}
                />
              }
            ></TextInput>

            <Text style={styles.text}>Email</Text>
            <TextInput
              style={styles.textInput}
              placeholder="estudante@gmail.com"
              disabled={!isEnabledMail}
              mode="outlined"
              value={mail}
              onChangeText={(text) => setMail(text)}
              right={
                <TextInput.Icon
                  name={isEnabledMail ? 'pencil-off' : 'pencil-outline'}
                  onPress={() => {
                    setIsEnabledMail(!isEnabledMail);
                  }}
                />
              }
            ></TextInput>

            <Text style={styles.text}>Senha</Text>
            <TextInput
              style={styles.textInput}
              placeholder="*********"
              secureTextEntry={!mostraSenha}
              disabled={!isEnabledPass}
              mode="outlined"
              value={number}
              onChangeText={(text) => setNumber(text)}
              right={
                <TextInput.Icon
                  name={isEnabledPass ? 'pencil-off' : 'pencil-outline'}
                  onPress={() => {
                    setIsEnabledPass(!isEnabledPass);
                  }}
                />
              }
              left={<TextInput.Icon icon="eye" onPress={ocultaSenha} />}
            ></TextInput>
          </View> 

          <View style={styles.view}>
            <Button style={styles.paperButton2} icon="pencil" mode="contained" onPress={() => navigation.navigate('Preferencias')}>
              Editar Preferências
            </Button>
          </View>

          <View style={styles.view}>
            <Button style={styles.paperButton} icon="check" mode="contained" onPress={saveProfile}>
              Salvar
            </Button>
          </View>

          <Snackbar style={styles.snackbar} visible={isSnackbarVisible} onDismiss={hideSnackbar} duration={2000}>
            Perfil salvo com sucesso!
          </Snackbar>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

export default function main() {
  const Stack = createNativeStackNavigator();
  return (
      <Stack.Navigator initialRouteName="Profile" screenOptions={{ title: 'Perfil', headerTitleStyle: {color: 'white', fontSize: 20},headerStyle: { backgroundColor: '#6C009A', color: 'white' }}}>
        <Stack.Screen name="Profile" component={SecondScreen} />
        <Stack.Screen name="Preferencias" component={Preferences} />
        <Stack.Screen name="Login" component={AuthScreen} />
      </Stack.Navigator>
  );
}
