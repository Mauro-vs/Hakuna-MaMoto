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
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{(user?.nombre?.[0] ?? 'U').toUpperCase()}</Text>
          </View>
          
          <View style={styles.headerContent}>
            <Text style={styles.userName}>{user?.nombre ?? 'Usuario'}</Text>
            <View style={[styles.roleBadge, { backgroundColor: colors.primaryButton }]}>
              <Ionicons name="shield-checkmark" size={12} color="#ffffff" />
              <Text style={styles.roleBadgeText}>{user?.rol ?? 'sin rol'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.profileInfo}>
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons name="mail-outline" size={18} color="#ffffff" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Correo Electrónico</Text>
              <Text style={styles.infoValue}>{user?.email ?? 'usuario@example.com'}</Text>
            </View>
          </View>
        </View>
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
      borderRadius: 24,
      paddingVertical: 28,
      paddingHorizontal: 22,
      marginBottom: 32,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 8,
      borderWidth: 0.5,
      borderColor: colors.primaryButton,
    },
    profileHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      marginBottom: 20,
    },
    avatarContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primaryButton,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: colors.primaryButton,
      shadowOpacity: 0.4,
      shadowOffset: { width: 0, height: 6 },
      shadowRadius: 12,
      elevation: 8,
      flexShrink: 0,
    },
    avatarText: {
      fontSize: 32,
      fontWeight: '900',
      color: '#ffffff',
    },
    headerContent: {
      flex: 1,
      gap: 10,
    },
    userName: {
      fontSize: 20,
      fontWeight: '900',
      color: colors.textTitle,
      letterSpacing: 0.3,
    },
    roleBadge: {
      paddingVertical: 7,
      paddingHorizontal: 11,
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      alignSelf: 'flex-start',
      shadowColor: colors.primaryButton,
      shadowOpacity: 0.2,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 2,
    },
    roleBadgeText: {
      fontSize: 11,
      fontWeight: '800',
      color: '#ffffff',
      textTransform: 'capitalize',
      letterSpacing: 0.3,
    },
    divider: {
      height: 1,
      backgroundColor: colors.grayLabelText,
      opacity: 0.12,
      marginBottom: 20,
    },
    profileInfo: {
      gap: 0,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 14,
    },
    infoIcon: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: colors.primaryButton,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 2,
    },
    infoContent: {
      flex: 1,
      justifyContent: 'center',
      paddingVertical: 2,
    },
    infoLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.grayLabelText,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 4,
    },
    infoValue: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textBody,
      letterSpacing: 0.1,
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
