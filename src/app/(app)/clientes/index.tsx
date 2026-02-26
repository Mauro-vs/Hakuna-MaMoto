import { Stack, Redirect } from "expo-router";
import React, { useMemo } from "react";
import { View, FlatList, Text, ActivityIndicator } from "react-native";
import { PopUpCrear } from "../../../components/clientesPages/PopUpCrear";
import { ListaClienteItem } from "../../../components/clientesPages/ListaClientes";
import { useThemeColors } from "../../../store/preferencesStore";
import { createClientesHomeStyles } from "../../../style/clientesHome.styles";
import { useClientesHome } from "../../../hooks/useClientesHome";

export default function HomeClientes() {
  const colors = useThemeColors();
  const styles = useMemo(() => createClientesHomeStyles(colors), [colors]);
  const { visible, setVisible, list, isLoading, isError, shouldRedirectHome, handleSave } = useClientesHome();

  if (shouldRedirectHome) {
    return <Redirect href="/home" />;
  }

  if (isLoading) {
    return (
      <View style={[styles.pantalla, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={colors.primaryButton} />
        <Text style={{ marginTop: 12, color: colors.grayLabelText }}>Cargando clientes...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.pantalla, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: colors.errorText }}>Error cargando clientes</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "Clientes" }} />

      <View style={{ height: 18, backgroundColor: colors.backgroundMain}} />

      {/* Lista de clientes */}
      <View style={styles.pantalla}>
        <FlatList
          data={list}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <ListaClienteItem item={item} />}
          contentContainerStyle={list.length === 0 ? styles.listaVacia : styles.contenido}
          ListEmptyComponent={
            <View style={styles.estadoVacio}>
              <Text style={styles.textoVacio}>No hay clientes aún</Text>
              <Text style={styles.sugerencia}>Agrega tus primeros clientes</Text>
            </View>
          }
        />

        {/* Popup para crear nuevo cliente */}
        <PopUpCrear
          existingClientes={list}
          visible={visible}
          setVisible={setVisible}
          onSave={handleSave}
        />
      </View>
    </>
  );
}
