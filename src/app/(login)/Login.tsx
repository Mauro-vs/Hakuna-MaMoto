import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Redirect } from 'expo-router';
import { LoginCard } from '../../components/login/LoginCard';
import { useThemeColors } from '../../store/preferencesStore';
import { useAuth } from '../../context/AuthContext';


export default function Login() {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { isSignedIn, isLoading } = useAuth();

  if (isSignedIn && !isLoading) {
    return <Redirect href="/home" />;
  }

  return (
    <View style={styles.screen}>
      <LoginCard />
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColors>) => StyleSheet.create({
  screen: {
    backgroundColor: colors.backgroundMain,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});