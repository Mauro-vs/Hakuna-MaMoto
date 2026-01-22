import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { LoginCard } from '../../components/login/LoginCard';
import { useThemeColors } from '../../store/preferencesStore';


export default function Login() {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

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