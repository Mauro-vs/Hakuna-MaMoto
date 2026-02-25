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

      {/* Hero para vender la app */}
      <View style={styles.heroContainer}>
        <View style={styles.heroBadgeRow}>
          <View style={styles.heroBadge}>
            <Ionicons name="speedometer" size={14} color={colors.primaryButton} />
            <Text style={styles.heroBadgeText}>Alquila tu moto desde el móvil</Text>
          </View>
        </View>

        <Text style={styles.heroTitle}>Alquila tu próxima moto en segundos</Text>
        <Text style={styles.heroSubtitle}>
          Elige modelo, fecha y duración desde tu móvil. Llega y ten tu moto lista para salir
          a rodar, sin llamadas ni papeleo.
        </Text>

        <View style={styles.heroHighlightsRow}>
          <View style={styles.heroHighlight}>
            <Ionicons name="calendar-outline" size={18} color={colors.primaryButton} />
            <View style={styles.heroHighlightTextWrap}>
              <Text style={styles.heroHighlightTitle}>Reserva en pocos toques</Text>
              <Text style={styles.heroHighlightSubtitle}>Selecciona moto, días y listo para recoger.</Text>
            </View>
          </View>

          <View style={styles.heroHighlight}>
            <Ionicons name="construct-outline" size={18} color={colors.primaryButton} />
            <View style={styles.heroHighlightTextWrap}>
              <Text style={styles.heroHighlightTitle}>Motos para cada plan</Text>
              <Text style={styles.heroHighlightSubtitle}>Scooters, naked o touring, todo en una app.</Text>
            </View>
          </View>
        </View>

        <View style={styles.heroActionsRow}>
          <Pressable
            style={styles.heroPrimaryButton}
            onPress={() => router.push('/modelos')}
          >
            <Text style={styles.heroPrimaryButtonText}>Explorar motos disponibles</Text>
            <Ionicons name="arrow-forward" size={18} color={colors.backgroundMain} />
          </Pressable>

          <Pressable
            style={styles.heroSecondaryButton}
            onPress={() => router.push('/reservas')}
          >
            <Ionicons name="eye-outline" size={16} color={colors.primaryButton} />
            <Text style={styles.heroSecondaryButtonText}>Ver mis reservas activas</Text>
          </Pressable>
        </View>
      </View>

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
    heroContainer: {
      backgroundColor: colors.backgroundCard,
      borderRadius: 24,
      paddingVertical: 24,
      paddingHorizontal: 20,
      marginBottom: 24,
      shadowColor: '#000',
      shadowOpacity: 0.12,
      shadowOffset: { width: 0, height: 6 },
      shadowRadius: 12,
      elevation: 6,
      borderWidth: 0.5,
      borderColor: colors.borderMain,
    },
    heroBadgeRow: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      marginBottom: 10,
    },
    heroBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: 999,
      backgroundColor: colors.backgroundMain,
      borderWidth: 1,
      borderColor: colors.borderMain,
    },
    heroBadgeText: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.textBody,
    },
    heroTitle: {
      fontSize: 22,
      fontWeight: '900',
      color: colors.textTitle,
      letterSpacing: 0.3,
      marginBottom: 6,
    },
    heroSubtitle: {
      fontSize: 13,
      color: colors.textBody,
      lineHeight: 18,
      marginBottom: 14,
    },
    heroHighlightsRow: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 16,
    },
    heroHighlight: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 8,
      paddingVertical: 10,
      paddingHorizontal: 10,
      borderRadius: 14,
      backgroundColor: colors.backgroundMain,
    },
    heroHighlightTextWrap: {
      flex: 1,
    },
    heroHighlightTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.textTitle,
      marginBottom: 2,
    },
    heroHighlightSubtitle: {
      fontSize: 11,
      color: colors.textBody,
    },
    heroActionsRow: {
      flexDirection: 'column',
      alignItems: 'stretch',
      gap: 10,
      marginTop: 4,
    },
    heroPrimaryButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 11,
      borderRadius: 14,
      backgroundColor: colors.primaryButton,
    },
    heroPrimaryButtonText: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.backgroundMain,
    },
    heroSecondaryButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 14,
      backgroundColor: colors.backgroundMain,
      borderWidth: 1,
      borderColor: colors.borderMain,
    },
    heroSecondaryButtonText: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.primaryButton,
    },
    headerCard: {
      backgroundColor: colors.backgroundCard,
      borderRadius: 24,
      paddingVertical: 32,
      paddingHorizontal: 24,
      marginBottom: 18,
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
      paddingHorizontal: 10,
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