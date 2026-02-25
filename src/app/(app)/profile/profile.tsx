import React, { useMemo } from 'react';
import { View, Text, Pressable, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '../../../store/preferencesStore';
import { MenuOption } from '../../../components/profilePages/menuOption';
import { createProfileStyles } from '../../../style/profile.styles';
import { useProfileScreen } from '../../../useControllers/useProfileScreen';


export default function Profile() {
  const router = useRouter();
  const colors = useThemeColors();
  const styles = useMemo(() => createProfileStyles(colors), [colors]);
  const { user, handleLogout } = useProfileScreen();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.contentContainer}>

      {/* Info rapida */}
      <View style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {user?.avatarUrl ? (
              <Image source={{ uri: user.avatarUrl }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>{(user?.nombre?.[0] ?? 'U').toUpperCase()}</Text>
            )}
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
