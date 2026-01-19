import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LoginScreen from './src/app/(login)/Login';

export default function App() {
  return (
    <View style={styles.container}>
      <LoginScreen/> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
