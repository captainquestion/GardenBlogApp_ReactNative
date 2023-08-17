import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity } from 'react-native';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const loginUser = async () => {
    try {
        let response = await fetch('http://172.20.10.5:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        });

        let data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Network response was not ok'); 
        }

        if (data.success) {
            Alert.alert('Success', data.message);
  
            // Load the user's garden
            const gardenResponse = await fetch(`http://172.20.10.5:5000/api/garden/load/${username}`);
            const gardenData = await gardenResponse.json();
          //   navigation.navigate('MainApp', { 
          //     params: { username: username }, // Passing the username to the entire MainApp
          //     screen: 'Garden', 
          //     params: { plants: gardenData }
          // });
            navigation.navigate('MainApp', { screen: 'Garden', params: { plants: gardenData, username: username } });
            navigation.navigate('MainApp', { screen: 'Profile', params: {  username: username } });
        } else {
            Alert.alert('Failed', data.message || 'Unable to login...');
        }
    } catch (error) {
        console.error(error);
        Alert.alert('Error', error.message || 'There was an error logging in. Please try again.');
    }
};

  

return (
  <View style={styles.container}>
    <Text style={styles.title}>Login</Text>
    <TextInput
      style={styles.input}
      placeholder="Username"
      placeholderTextColor="#7a7a7a"
      value={username}
      onChangeText={(text) => setUsername(text)}
    />
    <TextInput
      style={styles.input}
      placeholder="Password"
      placeholderTextColor="#7a7a7a"
      value={password}
      onChangeText={(text) => setPassword(text)}
      secureTextEntry
    />
    <TouchableOpacity style={styles.loginButton} onPress={loginUser}>
      <Text style={styles.buttonText}>Login</Text>
    </TouchableOpacity>
    <View style={styles.signupContainer}>
      <Text style={styles.signupInfoText}>Don't have an account?</Text>
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.signupText}> Sign Up</Text>
      </TouchableOpacity>
    </View>
  </View>
);
}

// Updated styles
const styles = StyleSheet.create({
container: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#4CAF50' // Garden Green
},
title: {
  fontSize: 28,
  fontWeight: 'bold',
  marginBottom: 20,
  color: '#FFFFFF' // White color for text to be visible against green background
},
input: {
  width: '80%',
  padding: 10,
  marginBottom: 10,
  borderWidth: 1,
  borderRadius: 5,
  borderColor: '#8B4513', // Brown border for garden soil theme
  backgroundColor: '#FFFFFF' // White for input fields
},
loginButton: {
  width: '80%',
  padding: 10,
  borderRadius: 5,
  backgroundColor: '#FFFFFF', // White button with green text for contrast
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 10,
  borderWidth: 1,
  borderColor: '#8B4513' // Brown border to continue the garden soil theme
},
buttonText: {
  color: '#4CAF50', // Garden Green text against the white button
  fontWeight: 'bold'
},
signupContainer: {
  flexDirection: 'row',
  marginTop: 20
},
signupInfoText: {
  color: '#FFFFFF' // White for clarity against green
},
signupText: {
  color: '#FFEB3B', // Using a different shade (yellow) for the "Sign Up" to make it pop out a bit
  fontWeight: 'bold'
}
});
