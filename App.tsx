import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { LoginScreen } from './src/app/LoginScreen';

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
    backgroundColor: '#797979ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
