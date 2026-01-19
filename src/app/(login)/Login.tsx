import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LoginCard } from '../../components/login/LoginCard';


export default function Login() {
  return (
    <View style={styles.screen}>
      <LoginCard />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#ffffff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});