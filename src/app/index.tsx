import React, { useMemo } from 'react';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useThemeColors } from '../store/preferencesStore';

export default function Index() {
  const { isSignedIn, isLoading } = useAuth();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  if (isLoading) {
    return (
      <View style={styles.screen}>
        <ActivityIndicator size="large" color={colors.avatarBackground} />
      </View>
    );
  }

  if (isSignedIn) {
    return <Redirect href="/home" />;
  }

  return <Redirect href="/(login)/Login" />;
}

const createStyles = (colors: ReturnType<typeof useThemeColors>) => StyleSheet.create({
  screen: {
    backgroundColor: colors.backgroundMain,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});