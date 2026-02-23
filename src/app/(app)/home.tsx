import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useThemeColors } from '../../store/preferencesStore';
import { useUserStore } from '../../store/userStore';
import { OptionsSelect } from '../../components/home/optionsSelect';
import { AdminPanel } from '../../components/home/adminPanel';
import { supabase } from '../../services/supabaseClient';


export default function Home() {
  const router = useRouter();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const user = useUserStore((state) => state.user);
  const [pedidosCount, setPedidosCount] = useState<number | null>(null);

  const isAdmin = user?.rol === 'ADMIN';
  const isEmpleado = user?.rol === 'MECANICO';
  const isCliente = user?.rol === 'NORMAL';

  const loadPedidosCount = useCallback(async () => {
    if (!user?.id) {
      setPedidosCount(null);
      return;
    }

    const { count, error } = await supabase
      .from('reservas')
      .select('id', { count: 'exact', head: true })
      .eq('usuario_id', user.id);

    if (error) {
      console.warn('No se pudo cargar el numero de pedidos', error);
      setPedidosCount(0);
      return;
    }

    setPedidosCount(count ?? 0);
  }, [user?.id]);

  useEffect(() => {
    void loadPedidosCount();
  }, [loadPedidosCount]);

  useFocusEffect(
    useCallback(() => {
      void loadPedidosCount();
    }, [loadPedidosCount])
  );

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.contentContainer}>
      {/* Header con info del usuario */}
      <View style={styles.headerCard}>
        <View style={styles.headerMain}>
          <View style={styles.avatarSmall}>
            {user?.avatarUrl ? (
              <Image source={{ uri: user.avatarUrl }} style={styles.avatarSmallImage} />
            ) : (
              <Text style={styles.avatarSmallText}>{(user?.nombre?.[0] ?? 'U').toUpperCase()}</Text>
            )}
          </View>
          
          <View style={styles.headerInfo}>
            <Text style={styles.greetingSmall}>Buenos días</Text>
            <Text style={styles.userNameSmall}>{user?.nombre ?? 'Usuario'}</Text>
            
            <View style={styles.headerBottom}>
              <View style={[styles.rolePill, { backgroundColor: colors.primaryButton }]}>
                <Ionicons 
                  name={isAdmin ? 'shield-checkmark' : isEmpleado ? 'briefcase' : 'person'}
                  size={12}
                  color="#ffffff"
                />
                <Text style={styles.rolePillText}>
                  {isAdmin && 'ADMIN'}
                  {isEmpleado && 'MECANICO'}
                  {isCliente && 'CLIENTE'}
                </Text>
              </View>

              {pedidosCount !== null && (
                <View style={styles.pedidosBadge}>
                  <Ionicons name="document-text" size={12} color={colors.primaryButton} />
                  <Text style={styles.pedidosText}>{pedidosCount} reservas</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>

      {/* Acciones principales */}
      <OptionsSelect />

      {/* Acceso a favoritos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Motos</Text>
        <Pressable
          style={styles.favoritesButton}
          onPress={() => router.push('/modelos/favoritos')}
        >
          <View style={styles.favoritesIconWrap}>
            <Ionicons name="heart-outline" size={22} color="#ffffff" />
          </View>
          <View style={styles.favoritesTextWrap}>
            <Text style={styles.favoritesTitle}>Ver favoritos</Text>
            <Text style={styles.favoritesSubtitle}>
              Tus motos guardadas para reservar más rápido.
            </Text>
          </View>
        </Pressable>
      </View>

      {/* Info según rol */}
      <AdminPanel rol={user?.rol} />
      
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
      borderRadius: 24,
      paddingVertical: 32,
      paddingHorizontal: 24,
      marginBottom: 28,
      shadowColor: '#000',
      shadowOpacity: 0.15,
      shadowOffset: { width: 0, height: 8 },
      shadowRadius: 16,
      elevation: 8,
      borderWidth: 0.5,
      borderColor: colors.primaryButton,
    },
    headerMain: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 18,
    },
    avatarSmall: {
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
    avatarSmallText: {
      fontSize: 32,
      fontWeight: '900',
      color: '#ffffff',
    },
    avatarSmallImage: {
      width: 76,
      height: 76,
      borderRadius: 38,
    },
    headerInfo: {
      flex: 1,
      justifyContent: 'center',
    },
    greetingSmall: {
      fontSize: 12,
      color: colors.grayPlaceholder,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.6,
      marginBottom: 8,
    },
    userNameSmall: {
      fontSize: 22,
      fontWeight: '900',
      color: colors.textTitle,
      letterSpacing: 0.3,
      marginBottom: 14,
    },
    headerBottom: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    rolePill: {
      paddingVertical: 10,
      paddingHorizontal: 13,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 7,
      flexDirection: 'row',
      shadowColor: colors.primaryButton,
      shadowOpacity: 0.25,
      shadowOffset: { width: 0, height: 3 },
      shadowRadius: 6,
      elevation: 3,
    },
    rolePillText: {
      fontSize: 12,
      fontWeight: '900',
      color: '#ffffff',
      letterSpacing: 0.4,
    },
    pedidosBadge: {
      paddingVertical: 10,
      paddingHorizontal: 13,
      borderRadius: 12,
      backgroundColor: 'transparent',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
      borderWidth: 1.5,
      borderColor: colors.primaryButton,
    },
    pedidosText: {
      fontSize: 12,
      fontWeight: '800',
      color: colors.primaryButton,
      letterSpacing: 0.3,
    },
    statsCard: {
      backgroundColor: colors.backgroundCard,
      borderRadius: 16,
      paddingVertical: 18,
      paddingHorizontal: 16,
      marginBottom: 24,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 3 },
      shadowRadius: 6,
      elevation: 4,
    },
    statItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
    },
    statIconContainer: {
      width: 60,
      height: 60,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: colors.primaryButton,
      shadowOpacity: 0.2,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 3,
    },
    statContent: {
      flex: 1,
      justifyContent: 'center',
    },
    statLabel: {
      fontSize: 12,
      color: colors.grayPlaceholder,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.4,
      marginBottom: 4,
    },
    statValue: {
      fontSize: 28,
      fontWeight: '900',
      color: colors.textTitle,
      letterSpacing: 0.3,
    },
    nameRoleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 8,
    },
    nameRoleCol: {
      flex: 1,
    },
    roleTagContainer: {
      marginBottom: 20,
      alignItems: 'flex-start',
    },
    roleTag: {
      paddingVertical: 6,
      paddingHorizontal: 11,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      shadowColor: colors.primaryButton,
      shadowOpacity: 0.2,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 2,
    },
    roleTagText: {
      fontSize: 10,
      fontWeight: '800',
      color: '#ffffff',
      letterSpacing: 0.5,
    },
    headerContent: {
      alignItems: 'center',
      gap: 16,
    },
    avatarLarge: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: colors.primaryButton,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: colors.primaryButton,
      shadowOpacity: 0.4,
      shadowOffset: { width: 0, height: 8 },
      shadowRadius: 16,
      elevation: 10,
    },
    avatarLargeText: {
      fontSize: 42,
      fontWeight: '900',
      color: '#ffffff',
    },
    userInfoContainer: {
      alignItems: 'center',
      gap: 4,
    },
    greetingText: {
      fontSize: 14,
      color: colors.grayPlaceholder,
      fontWeight: '600',
      letterSpacing: 0.2,
    },
    userNameLarge: {
      fontSize: 26,
      fontWeight: '900',
      color: colors.textTitle,
      letterSpacing: 0.4,
    },
    subtitleText: {
      fontSize: 13,
      color: colors.grayPlaceholder,
      fontWeight: '500',
      marginTop: 2,
      letterSpacing: 0.1,
    },
    userRole: {
      fontSize: 13,
      color: colors.textBody,
    },
    divider: {
      height: 1,
      backgroundColor: colors.grayPlaceholder,
      opacity: 0.1,
      marginVertical: 18,
    },
    roleContainer: {
      alignItems: 'flex-start',
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
    favoritesButton: {
      backgroundColor: colors.backgroundCard,
      borderRadius: 16,
      paddingVertical: 14,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
      borderWidth: 1,
      borderColor: colors.borderMain,
    },
    favoritesIconWrap: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primaryButton,
      justifyContent: 'center',
      alignItems: 'center',
    },
    favoritesTextWrap: {
      flex: 1,
    },
    favoritesTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.textTitle,
      marginBottom: 2,
    },
    favoritesSubtitle: {
      fontSize: 12,
      color: colors.textBody,
    },
  });