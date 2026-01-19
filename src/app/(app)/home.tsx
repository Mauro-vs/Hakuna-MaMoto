import React from 'react';
import { StyleSheet, View, Text } from 'react-native';


export default function Home() {
  return (
    <View style={styles.screen}>
        <Text>Home Screen</Text>
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