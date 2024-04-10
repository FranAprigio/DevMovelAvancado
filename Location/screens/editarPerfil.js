import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function EditarPerfil({ navigation }) {
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');

  const handleSalvar = () => {
    navigation.navigate('Perfil', {
      nome,
      sobrenome,
      email,
      dataNascimento,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome:</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={(text) => setNome(text)}
      />
      <Text style={styles.label}>Sobrenome:</Text>
      <TextInput
        style={styles.input}
        value={sobrenome}
        onChangeText={(text) => setSobrenome(text)}
      />
      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <Text style={styles.label}>Data de Nascimento:</Text>
      <TextInput
        style={styles.input}
        value={dataNascimento}
        onChangeText={(text) => setDataNascimento(text)}
      />
      <TouchableOpacity style={styles.salvarButton} onPress={handleSalvar}>
        <Text style={styles.salvarButtonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  salvarButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  salvarButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
