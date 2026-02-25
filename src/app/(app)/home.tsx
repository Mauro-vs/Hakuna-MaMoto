import React, { useMemo } from 'react';
import { View, Text, ScrollView, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '../../store/preferencesStore';
import { AdminPanel } from '../../components/home/adminPanel';
import { createHomeStyles } from '../../style/home.styles';
import { useHome } from '../../useControllers/useHome';


export default function Home() {
  const colors = useThemeColors();
  const styles = useMemo(() => createHomeStyles(colors), [colors]);

  const {
    userName,
    userInitial,
    userAvatarUrl,
    userRoleLabel,
    userRoleIconName,
    reservationsCount,
    handleExploreModels,
    handleViewReservations,
    handleViewFavorites,
    userRole,
  } = useHome();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.contentContainer}>
      {/* Header con info del usuario */}
      <View style={styles.headerCard}>
        <View style={styles.headerMain}>
          <View style={styles.avatarSmall}>
            {userAvatarUrl ? (
              <Image source={{ uri: userAvatarUrl }} style={styles.avatarSmallImage} />
            ) : (
              <Text style={styles.avatarSmallText}>{userInitial}</Text>
            )}
          </View>
          
          <View style={styles.headerInfo}>
            <Text style={styles.greetingSmall}>Buenos días</Text>
            <Text style={styles.userNameSmall}>{userName}</Text>
            
            <View style={styles.headerBottom}>
              <View style={styles.rolePill}>
                <Ionicons 
                  name={userRoleIconName as any}
                  size={12}
                  color="#ffffff"
                />
                <Text style={styles.rolePillText}>{userRoleLabel}</Text>
              </View>

              {reservationsCount !== null && (
                <View style={styles.pedidosBadge}>
                  <Ionicons name="document-text" size={12} color={colors.primaryButton} />
                  <Text style={styles.pedidosText}>{reservationsCount} reservas</Text>
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
        
        {/* Separador */}
        <View style={{ height: 1, backgroundColor: colors.borderMain, marginVertical: 18 }} />

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
            onPress={handleExploreModels}
          >
            <Text style={styles.heroPrimaryButtonText}>Explorar motos disponibles</Text>
            <Ionicons name="arrow-forward" size={18} color={colors.backgroundMain} />
          </Pressable>

          <Pressable
            style={styles.heroSecondaryButton}
            onPress={handleViewReservations}
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
          onPress={handleViewFavorites}
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
      {/* <AdminPanel rol={userRole ?? undefined} /> */}
      
    </ScrollView>
  );
}
