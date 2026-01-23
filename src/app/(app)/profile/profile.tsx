import React, { useMemo } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '../../../store/preferencesStore';
import { MenuOption } from '../../../components/profilePages/menuOption';
import { useUserStore } from '../../../store/userStore';
import { useAuth } from '../../../context/AuthContext';


export default function Profile() {
  const router = useRouter();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { logout } = useAuth();
  const user = useUserStore((state) => state.user);

  const handleLogout = async () => {
    await logout();
    router.replace('/(login)/Login');
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.contentContainer}>

      {/* Info rapida */}
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{(user?.nombre?.[0] ?? 'U').toUpperCase()}</Text>
        </View>
        <Text style={styles.userName}>{user?.nombre ?? 'Usuario'}</Text>
        <Text style={styles.userEmail}>{user?.email ?? 'usuario@example.com'}</Text>
        <Text style={styles.userRole}>Rol: {user?.rol ?? 'sin rol'}</Text>
      </View>

      {/* Información Personal */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cuenta</Text>
        <MenuOption 
          icon="person-outline" 
          label="Información Personal"
          onPress={() => router.push('/profile/edit-profile')}
        />
      </View>

      {/* Preferencias */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferencias</Text>
        <MenuOption 
          icon="settings-outline" 
          label="Ajustes de Aplicación"
          onPress={() => router.push('/preferences')}
        />
      </View>

      {/* Cerrar Sesión */}
      <Pressable 
        style={({ pressed }) => [
          styles.logoutButton,
          pressed && styles.logoutButtonPressed
        ]}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={20} color={colors.headerText} />
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </Pressable>
    </ScrollView>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColors>) =>
  StyleSheet.create({
    screen: {
      backgroundColor: colors.backgroundMain,
      flex: 1,
    },
    contentContainer: {
      paddingVertical: 20,
      paddingHorizontal: 16,
    },
    profileCard: {
      backgroundColor: colors.backgroundCard,
      borderRadius: 16,
      paddingVertical: 28,
      paddingHorizontal: 20,
      alignItems: 'center',
      marginBottom: 28,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    avatarContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primaryButton,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    avatarText: {
      fontSize: 32,
      fontWeight: '700',
      color: '#ffffff',
    },
    userName: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.textTitle,
      marginBottom: 6,
    },
    userEmail: {
      fontSize: 14,
      color: colors.grayLabelText,
    },
    userRole: {
      marginTop: 4,
      fontSize: 13,
      color: colors.textBody,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.grayLabelText,
      marginBottom: 12,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
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
    logoutButton: {
      backgroundColor: colors.errorButton,
      paddingVertical: 16,
      borderRadius: 12,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 10,
      marginTop: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
    },
    logoutButtonPressed: {
      opacity: 0.85,
    },
    logoutText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '700',
    },
  });
