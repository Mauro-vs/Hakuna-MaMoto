import React, { useMemo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useThemeColors } from '../../store/preferencesStore';


export default function Home() {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.screen}>
        <Text style={styles.text}>Home Screen</Text>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColors>) =>
  StyleSheet.create({
    screen: {
      backgroundColor: colors.backgroundMain,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      color: colors.textBody,
      fontSize: 18,
      fontWeight: '600',
    },
  });