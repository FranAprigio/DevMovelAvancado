import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Button, StyleSheet, Alert, Image, ScrollView } from 'react-native';
import firebase from 'firebase';
import { LinearGradient } from 'expo-linear-gradient';
import { auth } from '../Services/firebase';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { MainNavigator } from '../App';
import FirstLoginScreen from './firstLogin';

const AuthScreen = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const navigationn = useNavigation();

  const handleSignUp = async () => {
    try {
      if (!isLogin && userData.password !== userData.confirmPassword) {
        Alert.alert('Erro', 'As senhas não coincidem.');
        return;
      }

      if (!userData.email || !userData.password || (!isLogin && !userData.username) || (!isLogin && !userData.confirmPassword)) {
        Alert.alert('Erro', 'Por favor, preencha todos os campos.');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(userData.email)) {
        Alert.alert('Erro', 'Por favor, forneça um endereço de e-mail válido.');
        return;
      }

      if (!isLogin && (userData.password.length < 8 || !/[!@#$%^&*(),.?":{}|<>]/.test(userData.password))) {
        Alert.alert('Erro', 'A senha deve ter pelo menos 8 caracteres e incluir um caracter especial.');
        return;
      }

      if (isLogin) {
        await auth.signInWithEmailAndPassword(userData.email.trim(), userData.password);
        console.log('Usuário logado:', userData.email);
      } else {
        const userCredentials = await auth.createUserWithEmailAndPassword(userData.email.trim(), userData.password);
        const user = userCredentials.user;

        await user.sendEmailVerification();

        console.log('Conta criada:', user.uid);

        await firebase.firestore().collection('usuários').doc(user.uid).set({
          username: userData.username,
          email: userData.email,
          password: userData.password,
          preferences: [],
          photo: '../img/ft_perfil.jpg',
          location: '',
          selectedVenues: [],
          radius: 0
        });
      }
    } catch (error) {
      console.error('Erro durante o processo de autenticação:', error.message);
      Alert.alert('Erro de Autenticação', 'Email ou senha incorretos. Por favor, tente novamente.');
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        if (user.emailVerified) {
          if (user.metadata.creationTime === user.metadata.lastSignInTime) {
            navigationn.replace('FirstLogin');
          } else {
            navigation.navigate('Home');
          }
        } else {
          Alert.alert('Enviamos um link de confirmação no seu email. Confirme para entrar na conta');
        }
      } else {
        console.log('Usuário não autenticado.');
      }
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <LinearGradient
      colors={['#00EA95', '#B01EEE']}
      style={styles.gradiente}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image style={styles.logo} source={require('../img/LOGO.png')} />
        </View>

        <Text style={styles.headingText}>Bora dar um rolê?</Text>

        {isLogin ? (
          <View style={styles.inputContainer}>
            <Text style={styles.campo}>Email</Text>
            <TextInput
              placeholder="exemplo@gmail.com"
              style={styles.input}
              onChangeText={text => setUserData(prevState => ({ ...prevState, email: text }))}
            />
            <Text style={styles.campo}>Senha</Text>
            <TextInput
              placeholder="Senha"
              secureTextEntry
              style={styles.input}
              onChangeText={text => setUserData(prevState => ({ ...prevState, password: text }))}
            />
            <View style={styles.container}>
              <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')} style={styles.forgot}>
                <Text style={styles.forgot}>Esqueci minha senha</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.inputContainer}>
            <Text style={styles.campo}>Usuário</Text>
            <TextInput
              placeholder="Usuário"
              style={styles.input}
              onChangeText={text => setUserData(prevState => ({ ...prevState, username: text }))}
            />
            <Text style={styles.campo}>Email</Text>
            <TextInput
              placeholder="exemplo@gmail.com"
              style={styles.input}
              onChangeText={text => setUserData(prevState => ({ ...prevState, email: text }))}
            />
            <Text style={styles.campo}>Senha</Text>
            <TextInput
              placeholder="Senha"
              secureTextEntry
              style={styles.input}
              onChangeText={text => setUserData(prevState => ({ ...prevState, password: text }))}
            />
            <Text style={styles.campo}>Confirmar Senha</Text>
            <TextInput
              placeholder="Confirmar Senha"
              secureTextEntry
              style={styles.input}
              onChangeText={text => setUserData(prevState => ({ ...prevState, confirmPassword: text }))}
            />
          </View>
        )
        }

        <TouchableOpacity onPress={handleSignUp} style={styles.signup}>
          <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold' }}>{isLogin ? 'ENTRAR' : 'CADASTRAR'}</Text>
        </TouchableOpacity>

        <View style={styles.toggleContainer}>
          <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
            <Text style={{ color: 'white', textShadowColor: 'black', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 2, fontSize: 15, fontFamily: 'Rubik One', }}>{isLogin ? 'Cadastrar' : 'Já tenho uma conta. Entrar'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
    </LinearGradient>
  );
};

const ResetPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleResetPassword = async () => {
    try {
      await auth.sendPasswordResetEmail(email);
      Alert.alert('E-mail de redefinição enviado', 'Verifique sua caixa de entrada para redefinir sua senha.');
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao enviar e-mail de redefinição:', error.message);
      Alert.alert('Erro', 'Ocorreu um erro ao enviar o e-mail de redefinição. Por favor, tente novamente.');
    }
  };

  return (
    <LinearGradient
      colors={['#00EA95', '#B01EEE']}
      style={styles.gradiente}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <View style={styles.container2}>
        <Text style={styles.headingText}>Redefinir Senha</Text>
        <Text style={styles.campo}>E-mail</Text>
        <TextInput
          placeholder="exemplo@gmail.com"
          style={styles.input2}
          onChangeText={(text) => setEmail(text)}
        />
        <TouchableOpacity onPress={handleResetPassword} style={styles.signup}>
          <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold' }}>Enviar E-mail</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.forgot}>
          <Text style={{ fontSize: 15, color: 'white', fontFamily: 'Rubik One' }}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container2: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 240,
  },
  forgot: {
    fontSize: 15,
    marginTop: 20,
    color:'white',
    fontFamily:'Rubik One',
    textShadowColor:'black',
    textShadowOffset:{width: 2, height: 2},
    textShadowRadius:2,
  },
  campo: {
    marginBottom:10,
    color: '#FFDB00',
    fontWeight:'bold',
    textShadowColor:'#B01EEE',
    textShadowOffset:{width: 2, height: 2},
    textShadowRadius:2,
    fontSize:20,
  },
  logoContainer: {
    marginTop: 50,
    marginBottom: 20,
  },
  headingText: {
    fontSize: 18,
    marginBottom: 20,
    color:'white',
    fontFamily:'Rubik One',
    textShadowColor:'black',
    textShadowOffset:{width: 2, height: 2},
    textShadowRadius:2,
  },
  inputContainer: {
    width: '80%',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#06E4FF'
  },
  input2: {
    height: 40,
    width: 300,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#06E4FF'
  },
  toggleContainer: {
    marginTop: 20,
    marginBottom: 400,
  },
  gradiente: {
    flex: 1,
  },
  logo: {
    height: 70,
    width: 70,
  },
  signup: {
    marginTop:30,
    color:'black',
    borderColor: 'black',
    backgroundColor: '#FFDB00',
    borderWidth: 3,
    padding:10,
    width: 180,
    height: 50,
    alignItems:'center',
  }
});

const AppNavigator = () => {
  const Stack = createStackNavigator();
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Auth" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Home" component={MainNavigator} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="FirstLogin" component={FirstLoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export {AuthScreen}
export default AppNavigator;
