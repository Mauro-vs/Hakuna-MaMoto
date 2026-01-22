import React, { useMemo } from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '../../store/preferencesStore';

interface MenuOptionProps {
  icon: string;
  label: string;
  onPress: () => void;
}

export const MenuOption: React.FC<MenuOptionProps> = ({ icon, label, onPress }) => {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.menuOption,
        pressed && styles.menuOptionPressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.menuIconContainer}>
        <Ionicons name={icon as any} size={22} color={colors.primaryButton} />
      </View>
      <Text style={styles.menuLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={20} color={colors.grayPlaceholder} />
    </Pressable>
  );
};

const createStyles = (colors: ReturnType<typeof useThemeColors>) =>
  StyleSheet.create({
    menuOption: {
      backgroundColor: colors.backgroundCard,
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderRadius: 12,
      marginBottom: 10,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    menuOptionPressed: {
      opacity: 0.85,
      backgroundColor: colors.backgroundInput,
    },
    menuIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 10,
      backgroundColor: colors.backgroundInput,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 14,
    },
    menuLabel: {
      flex: 1,
      fontSize: 16,
      fontWeight: '600',
      color: colors.textBody,
    },
  });