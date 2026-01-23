import React, { useMemo } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useThemeColors } from '../../store/preferencesStore';
import { useUserStore } from '../../store/userStore';
import { OptionsSelect } from '../../components/home/optionsSelect';
import { AdminPanel } from '../../components/home/adminPanel';


export default function Home() {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const user = useUserStore((state) => state.user);

  const canSeeClientes = user?.rol === 'admin' || user?.rol === 'empleado';
  const isAdmin = user?.rol === 'admin';
  const isEmpleado = user?.rol === 'empleado';
  const isCliente = user?.rol === 'cliente';

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.contentContainer}>
      {/* Header con info del usuario */}
      <View style={styles.headerCard}>
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{(user?.nombre?.[0] ?? 'U').toUpperCase()}</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.greeting}>Bienvenido</Text>
            <Text style={styles.userName}>{user?.nombre ?? 'Usuario'}</Text>
            <Text style={styles.userRole}>{isAdmin && '👤 Administrador'}{isEmpleado && '👷 Empleado'}{isCliente && '🛒 Cliente'}</Text>
          </View>
        </View>
      </View>
      

      {/* Acciones principales */}
      <OptionsSelect canSeeClientes={canSeeClientes} />

      {/* Info según rol */}
      <AdminPanel rol={user?.rol ?? null} />
      
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
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 32,
    },
    headerCard: {
      backgroundColor: colors.backgroundCard,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 2,
    },
    avatarSection: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: colors.primaryButton,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    avatarText: {
      fontSize: 28,
      fontWeight: '700',
      color: '#fff',
    },
    headerInfo: {
      flex: 1,
    },
    greeting: {
      fontSize: 12,
      color: colors.grayPlaceholder,
      fontWeight: '600',
      marginBottom: 4,
    },
    userName: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.textTitle,
      marginBottom: 4,
    },
    userRole: {
      fontSize: 13,
      color: colors.textBody,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.grayPlaceholder,
      marginBottom: 12,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    footer: {
      alignItems: 'center',
      marginTop: 20,
    },
    footerText: {
      fontSize: 12,
      color: colors.grayPlaceholder,
    },
  });