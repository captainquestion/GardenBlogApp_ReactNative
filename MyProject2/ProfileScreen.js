import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function ProfileScreen({ route, navigation }) {
  
  // Get the username from the navigation params
  const { username } = route.params;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button 
          title="Logout" 
          
          onPress={() => navigation.replace('Login')}
          color="#000000"
          
        />
      )
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome, {username}!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  }
});
