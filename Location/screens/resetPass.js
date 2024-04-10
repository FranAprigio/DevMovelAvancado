import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Button, StyleSheet, Alert, Image, ScrollView } from 'react-native';
import firebase from 'firebase';
import { LinearGradient } from 'expo-linear-gradient';
import { auth } from '../Services/firebase';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

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
    <View style={styles.container}>
      <Text style={styles.headingText}>Redefinir Senha</Text>
      <Text style={styles.campo}>E-mail</Text>
      <TextInput
        placeholder="exemplo@gmail.com"
        style={styles.input}
        onChangeText={(text) => setEmail(text)}
      />
      <TouchableOpacity onPress={handleResetPassword} style={styles.signup}>
        <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold' }}>Enviar E-mail</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.forgot}>
        <Text style={{ fontSize: 15, color: 'white', fontFamily: 'Rubik One' }}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ResetPasswordScreen;
